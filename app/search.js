import Fuse from 'fuse.js'

export class Search {
  constructor (searchbase) {
    var options = {
      keys: ['name', 'type'],
      shouldSort: true,
      includeScore: true,
      threshold: 0.6,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1
    }

    console.log(searchbase)

    this.fuse = new Fuse(searchbase, options)
  }

  search (term) {
    return this.fuse.search(term)
  }
}
