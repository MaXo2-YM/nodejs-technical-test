const {getGroups, createGroup} = require('../controllers/groups')

const routeToGroups = async (req,res) => {
  switch(req.method) {
    case 'GET':
      getGroups(req,res)
    break;
    case 'POST':
      createGroup(req,res)
    break;
    default:
      res.writeHead(404, { 'Content-Type': 'application/json' })
      res.end('{ "error": "Method not implemented" }')
    }
}

module.exports = routeToGroups