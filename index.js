if (process.env.NODE_ENV === 'local') {
  require('dotenv').config()
}

require('./server')