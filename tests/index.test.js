const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const Users = require('../src/models/users')
const Groups = require('../src/models/groups')
/* Users.sync(/*{ force: true  })
Groups.sync(/*{ force: true  })*/

const server = require('../src')
// We are going to store the JWT in this variable to easily pass it to routes that need it
// Login should be done with a Authorization header like "Bearer eyJhbGcioi..."
let authJWT = ''

describe('NodeJS Tests', () => {
  describe('POST /subscribe', () => {
    test('Should create a new account (200)', async () => {
      const res = await chai
        .request(server)
        .post('/subscribe')
        .send({ email: 'node@test.com', firstName: 'node', lastName: 'test', password: 'n0d3jst3s!'})

      expect(res.status).toEqual(200)
      expect(res.body.data).toBeDefined()
      expect(res.body.data.email).toBeDefined()
      expect(res.body.data.firstName).toBeDefined()
      expect(res.body.data.lastName).toBeDefined()
      expect(res.body.data.password).not.toBeDefined()
    })
    test('Should fail because email already exists (400)', async () => {
      const res = await chai
        .request(server)
        .post('/subscribe')
        .send({ email: 'node@test.com', firstName: 'node', lastName: 'test', password: 'n0d3jst3s!'})

      expect(res.status).toEqual(400)
      expect(res.body.error).toBeDefined()
    })
    test('Should create a new friend account (200)', async () => {
      const res = await chai
        .request(server)
        .post('/subscribe')
        .send({ email: 'friend@test.com', firstName: 'friend', lastName: 'test', password: 'n0d3jst3s!'})

      expect(res.status).toEqual(200)
      expect(res.body.data).toBeDefined()
    })
  })

  describe('POST /login', () => {
    test('Should fail login (401)', async () => {
      const res = await chai
        .request(server)
        .post('/login')
        .send({ email: 'wrong@mail.com', password: 'wr0ngpass!'})

      expect(res.status).toEqual(401)
      expect(res.body.error).toBeDefined()
    })
    test('Should fail login (401)', async () => {
      const res = await chai
        .request(server)
        .post('/login')
        .send({ email: 'node@test.com', password: 'wr0ngpass!'})

      expect(res.status).toEqual(401)
      expect(res.body.error).toBeDefined()
    })
    test('Should successfully login (200)', async () => {
      const res = await chai
        .request(server)
        .post('/login')
        .send({ email: 'node@test.com', password: 'n0d3jst3s!'})

      expect(res.status).toEqual(200)
      expect(res.body.data).toBeDefined()
      expect(res.body.data.authJWT).toBeDefined()
      authJWT = res.body.data.authJWT
    })
  })

  describe('GET /users', () => {
    test('Should fail because not logged in (401)', async () => {
      const res = await chai
        .request(server)
        .get('/users')

      expect(res.status).toEqual(401)
      expect(res.body.error).toBeDefined()
    })

    test('Should return one user (200)', async () => {
      const res = await chai
        .request(server)
        .get('/users')
        .auth(authJWT, { type: 'bearer' })

      expect(res.status).toEqual(200)
      expect(res.body.data).toBeDefined()
      expect(res.body.data.users.length).toEqual(1)
      expect(res.body.data.users[0]).toMatchObject({
        email: 'friend@test.com',
        firstName: 'friend',
        lastName: 'test',
      })
    })
  })

  describe('GET /groups', () => {
    test('Should fail because not logged in (401)', async () => {
      const res = await chai
        .request(server)
        .get('/groups')

      expect(res.status).toEqual(401)
      expect(res.body.error).toBeDefined()
    })

    test('Should return an empty array of groups (200)', async () => {
      const res = await chai
        .request(server)
        .get('/groups')
        .auth(authJWT, { type: 'bearer' })

      expect(res.status).toEqual(200)
      expect(res.body.data).toBeDefined()
      expect(res.body.data.groups.length).toEqual(0)
    })
  })

  describe('POST /groups', () => {
    test('Should fail because not logged in (401)', async () => {
      const res = await chai
        .request(server)
        .post('/groups')
        .send({ name: 'My Awesome Group' })

      expect(res.status).toEqual(401)
      expect(res.body.error).toBeDefined()
    })

    test.skip('Should create a new group and return it with current user in it (200)', async () => {
      const res = await chai
        .request(server)
        .post('/groups')
        .auth(authJWT, { type: 'bearer' })
        .send({ name: 'My Awesome Group' })

      expect(res.status).toEqual(200)
      expect(res.body.data).toBeDefined()
      expect(res.body.data.groups.length).toEqual(1)
      expect(res.body.data.groups[0]).toMatchObject({
        name: 'My Awesome Group',
        users: [
          {
            email: 'node@test.com',
            firstName: 'node',
            lastName: 'test'
          }
        ]
      })
    })
  })
  describe('POST /groups/{groupId}/invite', () => {
    test('Should fail because not logged in (401)', async () => {
      const res = await chai
        .request(server)
        .post('/groups/1/invite')
        .send({ email: 'friend@test.com' })

      expect(res.status).toEqual(401)
      expect(res.body.error).toBeDefined()
    })

    // We invite to the group number 1 as it should be the first group created
    // Feel free to modify this test if you want to use uuid or anything else instead of incremental ids
    test('Should invite user to our group', async () => {
      const res = await chai
        .request(server)
        .post('/groups/1/invite')
        .auth(authJWT, { type: 'bearer' })
        .send({ email: 'friend@test.com' })

      expect(res.status).toEqual(200)
      expect(res.body.data).toBeDefined()
      expect(res.body.data.groups.length).toEqual(2)
      expect(res.body.data.groups[0]).toMatchObject({
        name: 'My Awesome Group',
        users: [
          {
            email: 'node@test.com',
            firstName: 'node',
            lastName: 'test'
          },
          {
            email: 'friend@test.com',
            firstName: 'friend',
            lastName: 'test'
          }
        ]
      })
    })
  })
})
