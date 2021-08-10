const { Sequelize } = require('sequelize')
const { sequelize } = require("../config")
const Users = require('./users')

const Groups = sequelize.define('groups', {
  name: { type: Sequelize.STRING,  allowNull: false}
})

Groups.hasMany(Users)
Users.belongsTo(Groups)

module.exports = Groups