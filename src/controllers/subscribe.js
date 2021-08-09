const sequelize = require('../database')
const Users = require('../models/users')

postSubscribe = async (req,res) => {
  let data = ''
  req.on('data', chunk => {
    data += chunk
  })
  req.on('end', async () => {
    try {
    const user = await Users.create({
      ...JSON.parse(data)
    })
    
    const {email, firstName, lastName, ...rest} = user.dataValues
    const returnValues = {email, firstName, lastName}
    
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end('{"data": '+ JSON.stringify(returnValues) +'}')
  
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end('{"error": ' + JSON.stringify(error) + '}')
    }
  })

}

module.exports = postSubscribe