var cryptoRandomString = require('crypto-random-string')

module.exports = {
    listen: process.env.APP_LISTEN || '0.0.0.0',
    port: process.env.APP_PORT || 9090,
    sessionSecret: process.env.SESSION_SECRET || cryptoRandomString(30)
}