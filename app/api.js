import { CancelToken, get } from 'axios'

export class MapApi {
  constructor (url = 'http://localhost:5000/') {
    this.url = url
    this.CancelToken = CancelToken
    this.cancelSource = this.CancelToken.source()
  }

  async httpGet (endpoint = '', params = {}, cancelToken = null) {
    const response = await get(`${this.url}${endpoint}`, { params, cancelToken })
    return response.data
  }

  async getLocations (type) {
    return this.httpGet('locations', { type })
  }

  async getPoliticalBoundaries () {
    return this.httpGet('political/boundaries')
  }

  async getRegionSize (id) {
    return this.httpGet('political/size', { id })
  }

  async getDetails (name) {
    this.cancelSource.cancel('Cancelled Ongoing Request')
    this.cancelSource = this.CancelToken.source()
    return this.httpGet('details', { name }, this.cancelSource.token)
  }
}
