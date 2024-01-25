import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    // REndering spinner
    if (!id) return;
    recipeView.renderSpinner();

    // Updaate search result with marked result selected
    bookmarksView.update(model.state.bookMarks);
    resultsView.update(model.getSearchResultsPage());

    // Loading redipe 1
    await model.loadRecipe(id);

    // Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // Get query search
    const query = searchView.getQuery();
    if (!query) return;

    // Load search results
    await model.loadSearchResults(query);

    // Rendering search results
    resultsView.render(model.getSearchResultsPage());

    // Render the initiation pagination button
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // Rendering New search results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // Render the New pagination button
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (state)
  model.updateServings(newServings);

  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookMark = function () {
  // Add/Remove bookmarks
  if (!model.state.recipe.bookMarked) model.addBookMark(model.state.recipe);
  else model.deleteBookMark(model.state.recipe.id);

  // Update the recipe bookmars
  recipeView.update(model.state.recipe);

  // Render the bookmarks
  bookmarksView.render(model.state.bookMarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookMarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Render spinner
    recipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);

    // Render the recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookMarks);

    // Change ID in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookMark(controlAddBookMark);
  searchView.addHnadlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  console.log('Welcome');
};
init();
