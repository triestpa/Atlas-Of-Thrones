import { CancelToken, get } from 'axios'

export class MapApi {
  constructor (url = 'http://localhost:5000/') {
    this.url = url
    this.cancelToken = CancelToken.source()
  }

  async httpGet (endpoint = '', params = {}, cancelToken = null) {
    const response = await get(`${this.url}${endpoint}`, { params, cancelToken })
    return response.data
  }

  async getLocations (type) {
    return this.httpGet('locations', { type })
  }

  async getPoliticalBoundaries () {
    return this.httpGet('boundaries')
  }

  async getRegionSize (id) {
    return this.httpGet('size', { id })
  }

  async getCastleCount (id) {
    return this.httpGet('locations/castles/count', { id })
  }

  async getDetails (name) {
    this.cancelToken.cancel('Cancelled Ongoing Request')
    this.cancelToken = CancelToken.source()
    return this.httpGet('details', { name }, this.cancelToken.token)
  }
}
