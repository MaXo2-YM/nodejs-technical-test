const { Sequelize } = require('sequelize')
const sequelize = require("../database")

const Users = sequelize.define('users', {
  email: { type: Sequelize.STRING,  allowNull: false, unique: 'compositeIndex', validate: {isEmail: true}},
  password: { type: Sequelize.STRING, allowNull: false },
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
})

module.exports = Users