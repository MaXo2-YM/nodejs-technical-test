const jwt = require('jsonwebtoken')
const {secret} = require('../config')
const Users = require('../models/users')

const login = async (req,res) => {
  let data = ''
  req.on('data', chunk => {
    data += chunk
  })
  req.on('end', async () => {
    data = JSON.parse(data)
    const user = await Users.findOne({
      where: {
        email: data.email
      }
    })
    if(user && user.password === data.password){
      let token = jwt.sign({
        key: user.email
      },
      secret, {
          expiresIn: 300 //5 minutes
      })

      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end('{"data": { "authJWT" : "'+ token +'"}}')
    } else {
      res.writeHead(401, { 'Content-Type': 'application/json' })
      res.end('{"error": "wrong email/password couple"}')
    }
  })
}

module.exports = login