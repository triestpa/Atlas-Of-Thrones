import { CancelToken, get } from 'axios'

export class MapApi {
  constructor (url = 'http://localhost:5000/') {
    this.url = url
    this.cancelToken = CancelToken.source()
  }

  async httpGet (endpoint = '', params = {}) {
    this.cancelToken.cancel('Cancelled Ongoing Request')
    this.cancelToken = CancelToken.source()
    const response = await get(`${this.url}${endpoint}`, { params, cancelToken: this.cancelToken.token })
    return response.data
  }

  async getLocations (type) {
    return this.httpGet('locations', { type })
  }

  async getLocationDetails (id) {
    return this.httpGet('locations/summary', { id })
  }

  async getPoliticalBoundaries () {
    return this.httpGet('political/boundaries')
  }

  async getRegionSize (id) {
    return this.httpGet('political/size', { id })
  }

  async getRegionDetails (id) {
    return this.httpGet('political/summary', { id })
  }

  async getCastleCount (id) {
    return this.httpGet('political/castles/count', { id })
  }
}
