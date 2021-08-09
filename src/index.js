const http = require('http')
const routes = require('./routes/index')

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  console.log('Received an api call on', req.url)
  routes(req,res)
}).listen(PORT)
console.log('Server running at http://127.0.0.1:' + PORT)

module.exports = server
