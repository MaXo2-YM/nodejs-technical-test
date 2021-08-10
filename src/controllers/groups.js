const Groups = require('../models/groups')
const verifyToken = require('../authJWT')

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

module.exports = getGroups