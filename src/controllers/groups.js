const Groups = require('../models/groups')
const Users = require('../models/users')
const verifyToken = require('../authJWT')
const { getUserFromMail } = require('./users')

const getGroups = async (req,res) => {
  if(verifyToken(req)) {
    const groups = await Groups.findAll()
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end('{"data": { "groups": '+ JSON.stringify(groups) +'}}')
  } else {
    res.writeHead(401, { 'Content-Type': 'application/json' })
    res.end('{"error": "Unhautorized"}')
  }
}

const createGroup = async (req, res) => {
  if(verifyToken(req)) {
    let data = ''
    req.on('data', chunk => {
      data += chunk
    })
    req.on('end', async () => {
      try {
      const user = await getUserFromMail(req.key)
      const group = await Groups.create({
        ...JSON.parse(data)
      })
      user.groupId = group.id //must be a cleaner way to do this
      await user.save()
      
      const {email, firstName, lastName, ...rest} = user.dataValues
      const {name, ...still} = group.dataValues
      const returnValues = {name, 'users': [{email, firstName, lastName}]}
      
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end('{"data":  { "groups": ['+ JSON.stringify(returnValues) +']}}')
    
      } catch (error) {
        console.error(error);
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end('{"error": ' + JSON.stringify(error) + '}')
      }
    })
  } else {
    res.writeHead(401, { 'Content-Type': 'application/json' })
    res.end('{"error": "Unhautorized"}')
  }
}

module.exports = {getGroups, createGroup}