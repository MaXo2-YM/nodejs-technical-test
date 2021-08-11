const Groups = require('../models/groups')
const Users = require('../models/users')
const verifyToken = require('../authJWT')
const { getUserFromMail, getUsersFromGroupId } = require('./users')

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

      let users = await getUsersFromGroupId(group.id)
      users = users.map((user) => {
        return {
          'email': user.email,
          'firstName': user.firstName,
          'lastName': user.lastName
        }
      })
      
      const {name, ...still} = group.dataValues
      const returnValues = {name, 'users': users}
      
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end('{"data":  { "groups": ['+ JSON.stringify(returnValues) +']}}')
    
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end('{"error": ' + JSON.stringify(error) + '}')
      }
    })
  } else {
    res.writeHead(401, { 'Content-Type': 'application/json' })
    res.end('{"error": "Unhautorized"}')
  }
}

const inviteToGroup = async (req,res) => {
  if(verifyToken(req)) {
    let data = ''
    req.on('data', chunk => {
      data += chunk
    })
    req.on('end', async () => {
      try {
        const userGuest = await getUserFromMail({...JSON.parse(data)}.email)
        const group = await getGroupFromId(extractIdFromUrl(req.url))

        userGuest.groupId = group.id
        await userGuest.save()

        let users = await getUsersFromGroupId(group.id)

        users = users.map((user) => {
          return {
            'email': user.email,
            'firstName': user.firstName,
            'lastName': user.lastName
          }
        })

        const {name, ...still} = group.dataValues
        const returnValues = {name, 'users': users}

        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end('{"data":  { "groups": ['+ JSON.stringify(returnValues) +']}}')
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end('{"error": ' + JSON.stringify(error) + '}')
      }
    })
  } else {
    res.writeHead(401, { 'Content-Type': 'application/json' })
    res.end('{"error": "Unhautorized"}')
  }
}

function extractIdFromUrl(url) {
  const id  = url.match(/\/groups\/(\d*)\/invite/)
  return id[1]
}

async function getGroupFromId(id) {
  return Groups.findOne({
    where: {
      id: id
    }
  })
}

module.exports = {getGroups, createGroup, inviteToGroup}