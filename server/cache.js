/**
 * Redis Cache Module
 */

const redis = require('redis')
const log = require('./logger')
const client = redis.createClient()

// Catch and log Redis error
client.on('error', function (err) {
  log.error('Redis Error', err)
})

module.exports = {
  /** Check the cache for the key */
  get: (key) => {
    return new Promise((resolve, reject) => {
      client.get(key, function (err, data) {
        if (err) { reject(err) }
        resolve(data)
      })
    })
  },

  /** Cache the value with the key */
  set: (key, value) => {
    return new Promise((resolve, reject) => {
      client.set(key, value, function (err, reply) {
        if (err) { reject(err) }
        resolve(reply)
      })
    })
  }
}
