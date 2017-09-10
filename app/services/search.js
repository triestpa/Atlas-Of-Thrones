import Fuse from 'fuse.js'

/** Location Search Service Class */
export class SearchService {
  constructor () {
    this.options = {
      keys: ['name'],
      shouldSort: true,
      threshold: 0.3,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1
    }

    this.searchbase = []
    this.fuse = new Fuse([], this.options)
  }

  /** Add JSON items to Fuse intance searchbase
   * @param { Object[] } geojson Array geojson items to add
   * @param { String } geojson[].properties.name Name of the GeoJSON item
   * @param { String } geojson[].properties.id ID of the GeoJSON item
   * @param { String } layerName Name of the geojson map layer for the given items
  */
  addGeoJsonItems (geojson, layerName) {
    // Add items to searchbase
    this.searchbase = this.searchbase.concat(geojson.map((item) => {
      return { layerName, name: item.properties.name, id: item.properties.id }
    }))

    // Re-initialize fuse search instance
    this.fuse = new Fuse(this.searchbase, this.options)
  }

  /** Search for the provided term */
  search (term) {
    return this.fuse.search(term)
  }
}
