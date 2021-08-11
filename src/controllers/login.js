const jwt = require('jsonwebtoken')
const {secret} = require('../config')
const Users = require('../models/users')
const { getUserFromMail } = require('./users')

const login = async (req,res) => {
    data = req.body
    const user = await getUserFromMail(data.email)
    if(user && user.password === data.password){
      let token = jwt.sign({
        key: user.email
      },
      secret, {
          expiresIn: 300 //5 minutes
      })

      res.status(200).json({'data': {'authJWT': token}})
    } else {
      res.status(401).json({'error': "Wrong email/password couple"})
    }

}

module.exports = login