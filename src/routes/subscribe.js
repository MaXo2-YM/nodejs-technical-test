const postSubscribe = require('../controllers/subscribe')

const routesToSubscribe = async (req,res) => {
  switch(req.method) {
    case 'POST':
      postSubscribe(req,res)
    break;
    default:
      res.writeHead(404, { 'Content-Type': 'application/json' })
      res.end('{ "error": "Method not implemented" }')
    }
}

module.exports = routesToSubscribe