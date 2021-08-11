const {Op} = require("sequelize");
const Users = require('../models/users')
const verifyToken = require('../authJWT')

const createUser = async (req,res) => {
    try {
    const user = await Users.create({
      ...req.body
    })
    
    const {email, firstName, lastName, ...rest} = user.dataValues
    const returnValues = {email, firstName, lastName}
    
    res.status(200).json({'data': returnValues})
  
    } catch (error) {
      res.status(400).json({'error': error})
    }
}

const getUsers = async (req,res) => {
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

const getUserFromMail = async (mail) => {
  return Users.findOne({
    where: {
      email: mail
    }
  })
}

module.exports = { getUsers, createUser, getUserFromMail }