const Groups = require('../models/groups')
const Users = require('../models/users')
const verifyToken = require('../authJWT')
const { getUserFromMail, getUsersFromGroupId } = require('./users')

const getGroups = async (req,res) => {
  let groups = await Groups.findAll()
  groups = groups.map((group) => {
    return {'name': group.name}
  })
  res.status(200).json({'data': { 'groups': groups}})
}

const createGroup = async (req, res) => {
  try {
    const user = await getUserFromMail(req.key)
    const group = await Groups.create({
      ...req.body
    })
    user.groupId = group.id //must be a cleaner way to do this
    await user.save()

    let users = await getUsersFromGroupId(group.id)
    users = users.map((user) => {
      return {
        'email': user.email,
        'firstName': user.firstName,
        'lastName': user.lastName
      }
    })
    res.status(200).json({'data': {'groups': [{'name': group.name, 'users': users}]}})

  } catch (error) {
    res.status(400).json({'error': error})
  }

}

const inviteToGroup = async (req,res) => {
  try {
    const userGuest = await getUserFromMail(req.body.email)
    const group = await getGroupFromId(req.params.groupId)

    userGuest.groupId = group.id
    await userGuest.save()

    let users = await getUsersFromGroupId(group.id)

    users = users.map((user) => {
      return {
        'email': user.email,
        'firstName': user.firstName,
        'lastName': user.lastName
      }
    })

    res.status(200).json({'data': {'groups': [{'name': group.name, 'users': users}]}})
  } catch (error) {
    res.status(400).json({'error': error})
  }
}

async function getGroupFromId(id) {
  return Groups.findOne({
    where: {
      id: id
    }
  })
}

module.exports = {getGroups, createGroup, inviteToGroup}