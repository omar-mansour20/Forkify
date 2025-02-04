import { API_URL, resultsPerPage, KEY } from '../config.js';
import { getJSON, AJAX } from '../helpers.js';


//  Application state containing recipe, search, and bookmarks data.
export const state = {
  recipe: {
    ingredients: [],
  },
  search: {
    query: '',
    results: [],
    resultsPerPage: resultsPerPage,
    page: 1,
  },
  bookmarks: [],
};

/**
 * Creates a formatted recipe object from API response data.
 * @param {Object} data - API response data.
 * @returns {Object} Formatted recipe object.
 */
const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

/**
 * Loads a recipe by ID and updates the state.
 * @param {string} id - Recipe ID.
 */
export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}`);
    state.recipe = createRecipeObject(data);

    state.recipe.bookmarked = state.bookmarks.some(bookmark => bookmark.id === id);
  } catch (err) {
    throw err;
  }
};

/**
 * Loads search results based on a query and updates the state.
 * @param {string} query - Search query.
 */
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}`);

    state.search.results = data.data.recipes.map(rec => ({
      id: rec.id,
      title: rec.title,
      publisher: rec.publisher,
      image: rec.image_url,
      ...(rec.key && { key: rec.key }),
    }));
  } catch (err) {
    throw err;
  }
};

/**
 * Retrieves paginated search results.
 * @param {number} [page=state.search.page] - Page number.
 * @returns {Array} Paginated search results.
 */
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

/**
 * Updates the servings for a recipe and adjusts ingredient quantities accordingly.
 * @param {number} newServings - New number of servings.
 */
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

// Saves bookmarks to local storage
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

/**
 * Adds a recipe to bookmarks and updates state.
 * @param {Object} recipe - Recipe object.
 */
export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};

/**
 * Removes a recipe from bookmarks and updates state.
 * @param {string} id - Recipe ID.
 */
export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};

/**
 * Uploads a new recipe to the API and updates state.
 * @param {Object} newRecipe - New recipe object.
 */
export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error('Wrong ingredient format! Please use the correct format :)');

        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

// Initializes bookmarks from local storage.
const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();