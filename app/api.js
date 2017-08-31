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
    return this.httpGet('location/all', { type })
  }

  async getLocationDetails (id) {
    return this.httpGet('location/summary', { id })
  }

  async getKingdoms () {
    return this.httpGet('kingdom/all')
  }

  async getRegionSize (id) {
    return this.httpGet('kingdom/size', { id })
  }

  async getRegionDetails (id) {
    return this.httpGet('kingdom/summary', { id })
  }

  async getCastleCount (id) {
    return this.httpGet('kingdom/castle/count', { id })
  }
}
