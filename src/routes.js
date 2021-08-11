const routes = require('express').Router();
const { createUser, getUsers } = require('./controllers/users')
const login = require('./controllers/login')
const { getGroups, createGroup, inviteToGroup } = require('./controllers/groups');
const verifyToken = require('./authJWT');

routes.route('/subscribe')
  .post((req,res) => { createUser(req,res) })

routes.route('/login')
  .post((req,res) => { login(req,res) })

routes.route('/users')
  .get(verifyToken, (req,res) => { getUsers(req,res) })

routes.route('/groups')
  .get(verifyToken, (req,res) => { getGroups(req,res) })
  .post(verifyToken, (req,res) => { createGroup(req,res) })

routes.route('/groups/:groupId/invite')
  .post(verifyToken, (req,res) => { inviteToGroup(req,res) })

module.exports = routes;