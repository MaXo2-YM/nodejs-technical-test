const express = require('express');
const verifyToken = require('./authJWT');
const { getGroups, createGroup, inviteToGroup } = require('./controllers/groups');
const app = express()
const login = require('./controllers/login')
const { createUser, getUsers } = require('./controllers/users')

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/subscribe', (req,res) => {
  createUser(req,res)
})

app.post('/login', (req,res) => {
  login(req,res)
})

app.get('/users', verifyToken, (req,res) => {
  getUsers(req,res)
})

app.get('/groups', verifyToken, (req,res) => {
  getGroups(req,res)
})

app.post('/groups', verifyToken, (req,res) => {
  createGroup(req,res)
})

app.post('/groups/:groupId/invite', verifyToken, (req,res) => {
  inviteToGroup(req,res)
})

app.listen(PORT, () => {
  console.log('Server running at http://127.0.0.1:' + PORT)
})

module.exports = app
