const {getUsers} = require('../controllers/users')

const routeToUsers = async (req,res) => {
  switch(req.method) {
    case 'GET':
      getUsers(req,res)
    break;
    default:
      res.writeHead(404, { 'Content-Type': 'application/json' })
      res.end('{ "error": "Method not implemented" }')
    }
}

module.exports = routeToUsers