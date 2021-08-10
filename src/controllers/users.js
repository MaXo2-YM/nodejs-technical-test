const jwt = require('jsonwebtoken')
const {Op} = require("sequelize");
const {secret} = require('../config')
const Users = require('../models/users')
const verifyToken = require('../authJWT')

getUsers = async (req,res) => {
  if(verifyToken(req)) {
    const users = await Users.findAll({
      where: {
        email: {
          [Op.notLike] : req.key
        }
      }
    })
    const strippedUsers = users.map((user) => {
      return {
        email: user.getDataValue('email'),
        firstName: user.getDataValue('firstName'),
        lastName: user.getDataValue('lastName'),
      }
    })
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end('{"data": { "users": '+ JSON.stringify(strippedUsers) +'}}')
  } else {
      res.writeHead(401, { 'Content-Type': 'application/json' })
      res.end('{"error": "Unhautorized"}')
  }
}

module.exports = getUsers