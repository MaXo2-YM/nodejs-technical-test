const express = require('express');
const routes = require('./routes');
const app = express()

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', routes)

app.listen(PORT, () => {
  console.log('Server running at http://127.0.0.1:' + PORT)
})

module.exports = app
