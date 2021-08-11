const login = require('../controllers/login')

const routesToLogin = async (req,res) => {
  switch(req.method) {
    case 'POST':
      login(req,res)
    break;
    default:
      res.writeHead(404, { 'Content-Type': 'application/json' })
      res.end('{ "error": "Method not implemented" }')
    }
}

module.exports = routesToLogin