// Import necessary modules and views
import * as model from '../model/model.js';
import recipeView from '../view/recipeView.js';
import searchView from '../view/searchView.js';
import resultsView from '../view/resultsView.js';
import paginationView from '../view/paginationView.js';
import bookmarksView from '../view/bookmarksView.js';
import addRecipeView from '../view/addRecipeView.js';

// Import configuration constants
import { MODAL_CLOSE_SEC } from '../config.js';

// Enable Hot Module Replacement (HMR) if supported
if (module.hot) {
  module.hot.accept();
}

// Selecting the recipe container from DOM
const recipeContainer = document.querySelector('.recipe');

// Controller function to handle loading and displaying a recipe
const controlRecipes = async function () {
  try {
    // Get the recipe ID from the URL hash
    const id = window.location.hash.slice(1);

    // If no ID is found, exit function
    if (!id) return;

    // Show loading spinner while fetching data
    recipeView.renderSpiner();

    // Update search results view with highlighted selected recipe
    resultsView.update(model.getSearchResultsPage());

    // Render bookmarks to ensure they are updated
    bookmarksView.render(model.state.bookmarks);

    // Load recipe from API
    await model.loadRecipe(id);

    // Render the fetched recipe on UI
    recipeView.render(model.state.recipe);
  } catch (err) {
    // Render error message if something goes wrong
    recipeView.renderError();
  }
};

// Controller function to handle search results
const controlSearchResults = async function () {
  try {
    // Show loading spinner while fetching search results
    resultsView.renderSpiner();

    // Get search query from input field
    const query = searchView.getQuery();
    if (!query) return;

    // Fetch search results from API
    await model.loadSearchResults(query);

    // Render the first page of search results
    resultsView.render(model.getSearchResultsPage(1));

    // Render pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    // Render error message if search fails
    recipeView.renderError();
  }
};

// Controller function to handle pagination
const controlPagination = function (goToPage) {
  // Render selected page of search results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // Update pagination buttons accordingly
  paginationView.render(model.state.search);
};

// Controller function to update recipe servings
const controlServings = function (newServings) {
  // Update the number of servings in the state
  model.updateServings(newServings);

  // Reflect the updated servings in the UI
  recipeView.update(model.state.recipe);
};

// Controller function to handle bookmarking a recipe
const controlAddBookmark = function () {
  // Check if recipe is already bookmarked, if not, add it
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id); // Remove bookmark if already bookmarked

  // Update the recipe view with bookmark state
  recipeView.update(model.state.recipe);

  // Render the updated list of bookmarks
  bookmarksView.render(model.state.bookmarks);
};

// Controller function to render bookmarks on page load
const controlBookmarks = function () {
  // Display stored bookmarks
  bookmarksView.render(model.state.bookmarks);
};

// Controller function to handle adding a new recipe
const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner while processing new recipe
    addRecipeView.renderSpiner();

    // Upload new recipe data to the backend
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render the newly uploaded recipe
    recipeView.render(model.state.recipe);

    // Show success message to user
    addRecipeView.renderMessage();

    // Update bookmarks view with new recipe if bookmarked
    bookmarksView.render(model.state.bookmarks);

    // Change URL to reflect newly added recipe
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close the add recipe form window after a delay
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    // Log and display error message
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
};

// Initialize event listeners and handlers
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks); // Handle rendering of bookmarks when page loads
  recipeView.addHandelerRender(controlRecipes); // Handle recipe rendering when hash changes in the URL
  recipeView.addHandlerUpdateServings(controlServings); // Handle updating servings for a recipe
  recipeView.addHandlerAddBookmark(controlAddBookmark); // Handle adding/removing bookmarks
  searchView.addHandlerSearch(controlSearchResults); // Handle search input submission
  addRecipeView.addHandlerUpload(controlAddRecipe); // Handle new recipe form submission
};

// Execute initialization function
init();
