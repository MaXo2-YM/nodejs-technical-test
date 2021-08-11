const jwt = require('jsonwebtoken')
const {secret} = require('./config.js')

const verifyToken = (req, res, next) => {
    let token = req.headers['authorization']
    if (!token) {
      res.status(401).json({'error': "Unauthorized"})
    }
    token = token.split(' ')[1]
    return jwt.verify(token, secret, (error, decoded) => {
        if (error) {
          res.status(403).json({'error': "Forbidden"})
        }
        req.key = decoded.key
        next();
    })
}

module.exports = verifyToken