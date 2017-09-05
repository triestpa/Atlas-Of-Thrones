/**
 * Redis Cache Module
 */

const Redis = require('ioredis')
const redis = new Redis(process.env.REDIS_PORT, process.env.REDIS_HOST)
module.exports = redis
