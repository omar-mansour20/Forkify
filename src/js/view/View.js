import icons from 'url:../../img/icons.svg'; // static assets

export default class View {
  _parentElement; // Parent element to which the content will be rendered
  _errorMessage; // Default error message
  _message; // Default success message
  _data; // Holds the data to be rendered

  // Renders the given data to the DOM
  render(data, render = true) {
    // If no data is provided or data is an empty array, show an error message
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    // Store the data
    this._data = data;

    // Generate the markup for the UI
    const markup = this._generateMarkup();

    // If render is false, return the markup instead of inserting into DOM
    if (!render) return markup;

    // Clear the parent element before inserting new content
    this.clear();

    // Insert the new content at the beginning of the parent element
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // Updates the DOM elements with new data without re-rendering the entire component
  update(data) {
    this._data = data;

    // Generate new markup for updated data
    const newMarkup = this._generateMarkup();

    // Convert new markup into DOM nodes
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      // If the new element differs from the current one and contains text, update it
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      // Update changed attributes
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }

  // Renders a loading spinner while fetching data
  renderSpiner() {
    const html = `
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>
      `;
    this.clear();
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }

  // Clears the content of the parent element
  clear() {
    this._parentElement.innerHTML = '';
  }

  // Displays an error message in the UI
  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <div>
            <svg>
              <use href="${icons}#icon-alert-triangle"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>`;
    this.clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // Displays a success or informational message in the UI
  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
        <div>
            <svg>
              <use href="${icons}#icon-smile"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>`;
    this.clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
