const routesToSubscribe = require('./subscribe')
const routesToLogin = require('./login')
const routesToUsers = require('./users')
const routesToGroups = require('./groups')
const {inviteToGroup} = require('../controllers/groups')
const routes = async (req,res) => {
  switch(req.url) {
    case '/subscribe':
      routesToSubscribe(req,res)
    break;
    case '/login':
      routesToLogin(req,res)
    break;
    case '/users':
      routesToUsers(req,res)
    break;
    case '/groups':
      routesToGroups(req,res)
    break;
    case req.url.match(/\/groups\/\d*\/invite/)?.input: //yeah that's ugly, don't do this at home, kids.
      inviteToGroup(req,res)
    break;
    default:
      res.writeHead(404, { 'Content-Type': 'application/json' })
      res.end('{ "error": "Route not implemented" }')
  }
}

module.exports = routes