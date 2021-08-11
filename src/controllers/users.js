const {Op} = require("sequelize");
const Users = require('../models/users')
const verifyToken = require('../authJWT')

const createUser = async (req,res) => {
  let data = ''
  req.on('data', chunk => {
    data += chunk
  })
  req.on('end', async () => {
    try {
    const user = await Users.create({
      ...JSON.parse(data)
    })
    
    const {email, firstName, lastName, ...rest} = user.dataValues
    const returnValues = {email, firstName, lastName}
    
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end('{"data": '+ JSON.stringify(returnValues) +'}')
  
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end('{"error": ' + JSON.stringify(error) + '}')
    }
  })

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

module.exports = { getUsers, createUser }