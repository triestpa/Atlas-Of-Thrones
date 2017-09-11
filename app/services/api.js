import { CancelToken, get } from 'axios'

/** API Wrapper Service Class */
export class ApiService {
  constructor (url = 'http://localhost:5000/') {
    this.url = url
    this.cancelToken = CancelToken.source()
  }

  async httpGet (endpoint = '') {
    this.cancelToken.cancel('Cancelled Ongoing Request')
    this.cancelToken = CancelToken.source()
    const response = await get(`${this.url}${endpoint}`, { cancelToken: this.cancelToken.token })
    return response.data
  }

  async getLocations (type) {
    return this.httpGet(`locations/${type}`)
  }

  async getLocationSummary (id) {
    return this.httpGet(`locations/${id}/summary`)
  }

  async getKingdoms () {
    return this.httpGet('kingdoms')
  }

  async getKingdomSize (id) {
    return this.httpGet(`kingdoms/${id}/size`)
  }

  async getCastleCount (id) {
    return this.httpGet(`kingdoms/${id}/castles`)
  }

  async getKingdomSummary (id) {
    return this.httpGet(`kingdoms/${id}/summary`)
  }

  async getAllKingdomDetails (id) {
    return {
      kingdomSize: await this.getKingdomSize(id),
      castleCount: await this.getCastleCount(id),
      kingdomSummary: await this.getKingdomSummary(id)
    }
  }
}
