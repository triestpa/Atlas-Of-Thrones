import './search-bar.scss'
import template from './search-bar.html'
import { Component } from '../component'

/**
 * Search Bar Component
 * Render and manage search-bar and search results.
 * @extends Component
 */
export class SearchBar extends Component {
  /** SearchBar Component Constructor
   * @param { Object } props.events.resultSelected Result selected event listener
   * @param { Object } props.data.searchService SearchService instance to use
   */
  constructor (placeholderId, props) {
    super(placeholderId, props, template)
    this.searchService = props.data.searchService
    this.searchDebounce = null

    // Trigger search function for new input in searchbar
    this.refs.input.addEventListener('keyup', (e) => this.onSearch(e.target.value))
  }

  /** Receive search bar input, and debounce by 200 ms */
  onSearch (value) {
    clearTimeout(this.searchDebounce)
    this.searchDebounce = setTimeout(() => this.search(value), 200)
  }

  /** Search for the input term, and display results in UI */
  search (term) {
    // Clear search results
    this.refs.results.innerHTML = ''

    // Get the top ten search results
    this.searchResults = this.searchService.search(term).slice(0, 10)

    // Display search results on UI
    this.searchResults.forEach((result) => this.displaySearchResult(result))
  }

  /** Add search result row to UI */
  displaySearchResult (searchResult) {
    let layerItem = document.createElement('div')
    layerItem.textContent = searchResult.name
    layerItem.addEventListener('click', () => this.searchResultSelected(searchResult))
    this.refs.results.appendChild(layerItem)
  }

  /** Display the selected search result  */
  searchResultSelected (searchResult) {
    // Clear search input and results
    this.refs.input.value = ''
    this.refs.results.innerHTML = ''

    // Send selected result to listeners
    this.triggerEvent('resultSelected', searchResult)
  }
}
