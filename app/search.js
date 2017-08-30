import Fuse from 'fuse.js'

export class LocationSearch {
  constructor (searchbase) {
    var options = {
      keys: ['name'],
      shouldSort: true,
      threshold: 0.2,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1
    }

    this.fuse = new Fuse(searchbase, options)
  }

  search (term) {
    return this.fuse.search(term)
  }
}
