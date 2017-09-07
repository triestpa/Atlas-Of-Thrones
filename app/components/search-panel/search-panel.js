import './search-panel.scss'
import template from './search-panel.html'
import { Component } from '../component'

export class SearchPanelComponent extends Component {
  constructor (placeholderId, props) {
    super(placeholderId, template)
    this.searchService = props.searchService
    this.onResultSelected = props.onResultSelected

    this.searchDebounce = null
    this.inputElem = this.componentElem.querySelector('[rel=input]')
    this.inputElem.addEventListener('keyup', (e) => this.onSearch(e.target.value))
    this.resultsElem = this.componentElem.querySelector('[rel=results]')
  }

  /** Receive search bar input, and debounce by 200 ms */
  onSearch (value) {
    clearTimeout(this.searchDebounce)
    this.searchDebounce = setTimeout(() => this.search(value), 50)
  }

  /** Search for the input term, and display results in UI */
  search (term) {
    // Clear search results
    this.resultsElem.innerHTML = ''

    // Get the top ten search results
    this.searchResults = this.searchService.search(term).slice(0, 10)

    // Display search results on UI
    for (let i = 0; i < this.searchResults.length; i++) {
      let searchResult = this.searchResults[i]
      let layerItem = document.createElement('div')
      layerItem.textContent = searchResult.name
      layerItem.addEventListener('click', () => this.searchResultSelected(searchResult))
      this.resultsElem.appendChild(layerItem)
    }
  }

  /** Display the selected search result  */
  searchResultSelected (searchResult) {
    // Clear search input and results
    this.inputElem.value = ''
    this.resultsElem.innerHTML = ''

    this.onResultSelected(searchResult)
  }
}
