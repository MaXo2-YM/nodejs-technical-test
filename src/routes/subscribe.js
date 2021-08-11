const {createUser} = require('../controllers/users')

const routesToSubscribe = async (req,res) => {
  switch(req.method) {
    case 'POST':
      createUser(req,res)
    break;
    default:
      res.writeHead(404, { 'Content-Type': 'application/json' })
      res.end('{ "error": "Method not implemented" }')
    }
}

module.exports = routesToSubscribe