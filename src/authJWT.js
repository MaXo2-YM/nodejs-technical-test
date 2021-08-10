const jwt = require('jsonwebtoken')
const {secret} = require('./config.js')

const verifyToken = (req) => {
    let token = req.headers['authorization']
    if (!token) {
      return false
    }
    return jwt.verify(token.substring(7), secret, (error, decoded) => {
        if (error) {
          return false
        }
        req.key = decoded.key
        return true
    })
}

module.exports = verifyToken