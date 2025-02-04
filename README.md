# 🍳 Forkify Recipe App

Forkify is a web application that allows users to search, view, adjust servings, bookmark, and even upload their own recipes. It's built using modern JavaScript practices, including modules and a clear separation of concerns using the MVC (Model-View-Controller) architectural pattern.

## 🚀 Features

*   **Recipe Search:** Search for recipes by keyword. 🔍
*   **Recipe View:** View detailed information about a recipe, including ingredients, instructions, cooking time, and image. 📖
*   **Serving Size Adjustment:** Dynamically adjust the number of servings for a recipe. 🍽️
*   **Bookmark Recipes:** Save your favorite recipes for easy access. 🔖
*   **Upload Recipes:** Share your own recipes with the community. 📤
*   **Responsive Design:** Works seamlessly on different screen sizes. 📱
*   **MVC Architecture:** Well-structured code using the Model-View-Controller pattern for maintainability and scalability. ⚙️
*   **Modern JavaScript:** Utilizes ES6 modules, async/await, and other modern JavaScript features. ✨
*   **Parcel Bundler:** Efficiently bundles the application's JavaScript and assets. 📦

## 🛠️ Technologies Used

*   **HTML:** Structure and content of the web pages.
*   **CSS:** Styling and layout.
*   **JavaScript:** Core logic, interactivity, and DOM manipulation.
*   **Parcel:** Bundler for managing JavaScript modules and assets.

## ⚙️ How to Use

1.  Clone the repository: `git clone [repository URL]`
2.  Navigate to the project directory: `cd forkify`
3.  Install dependencies: `npm install` or `yarn install`
4.  Start the development server: `npm start` or `yarn start`
5.  Open `index.html` in your web browser.
6.  Use the search bar to find recipes.
7.  Click on a recipe to view its details.
8.  Adjust the serving size using the "+" and "-" buttons.
9.  Click the bookmark icon to save or unsave a recipe.
10. Use the "Upload Recipe" form to add your own recipes.

## 📚 MVC Architecture Overview

*   **Model (`model.js`):** Handles data and business logic.  It interacts with the API, manages the application's state (recipes, search results, bookmarks), and persists data (e.g., bookmarks in local storage).
*   **View (`views/*.js`):** Responsible for rendering the UI and handling user interactions.  Each view component (recipe view, search view, etc.) manages a specific part of the UI.  They extend a base `View` class for common functionality.
*   **Controller (`controller.js`):** Acts as the intermediary between the Model and the Views. It handles user input from the Views, updates the Model, and then instructs the Views to update based on the changes in the Model.

## 🤝 Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature-name`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request


---

⭐️ If you found this project helpful, please give it a star on GitHub! ⭐️
