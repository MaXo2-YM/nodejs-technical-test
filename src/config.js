const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres://user:password@host:port/dbname')
const secret = 'your-secret-phrase-here'

module.exports = {
  sequelize,
  secret
};