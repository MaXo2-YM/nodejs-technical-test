const express = require('express')
const app = express()
const { createUser } = require('./controllers/users');

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/subscribe', (req,res) => {
  createUser(req,res)
})

app.listen(PORT, () => {
  console.log('Server running at http://127.0.0.1:' + PORT)
})

module.exports = app
