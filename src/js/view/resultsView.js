import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg'; // static assets

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'Sorry, no recipes found ';
  _message = '';

  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}
export default new ResultsView();
