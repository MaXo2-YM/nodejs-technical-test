const {Op} = require("sequelize");
const Users = require('../models/users')
const verifyToken = require('../authJWT')

const createUser = async (req,res) => {
    try {
    const user = await Users.create({
      ...req.body
    })
    
    const {email, firstName, lastName, ...rest} = user.dataValues
    const returnValues = {email, firstName, lastName}
    
    res.status(200).json({'data': returnValues})
  
    } catch (error) {
      res.status(400).json({'error': error})
    }
}

const getUsers = async (req,res) => {
  let users = await Users.findAll({
    where: {
      email: {
        [Op.notLike] : req.key
      }
    }
  })
  users = users.map((user) => {
    return {
      email: user.getDataValue('email'),
      firstName: user.getDataValue('firstName'),
      lastName: user.getDataValue('lastName'),
    }
  })
  res.status(200).json({'data': {'users': users}})
}

const getUserFromMail = async (mail) => {
  return Users.findOne({
    where: {
      email: mail
    }
  })
}

const getUsersFromGroupId = async (id) => {
  return Users.findAll({
    where: {
      groupId: id
    }
  })
}

module.exports = { getUsers, createUser, getUserFromMail, getUsersFromGroupId }