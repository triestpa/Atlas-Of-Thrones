const redis = require("redis")
const client = redis.createClient()

client.on("error", function (err) {
  console.error('Redis Error', err)
})

function get(key) {
  return new Promise((resolve, reject) => {
    client.get(key, function (err, data) {
      if (err) reject(err);
      resolve(data)
    })
  })
}

function set(key, value) {
  return new Promise((resolve, reject) => {
    client.set(key, value, function (err, reply) {
      if (err) reject(err);
      resolve(reply)
    })
  })
}

module.exports = {
  get,
  set
}