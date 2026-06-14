const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../../app')
const listHelper = require('../blogs/blog.test.helper')
const Blog = require('../blogs/blog.model')
const User = require('./user.model')
const db = require('../blogs/blog.test.database')




const api = supertest(app)

beforeAll(async () => {
  await db.connect()
})

beforeEach(async () => {
  await db.clearDatabase()

  await db.seedDatabase()

})

afterAll(async () => {
  await db.closeDatabase()
})


test('a valid user can be created', async () => {



	const newUser = {
	  username: 'testuser',
	  name: 'Johannes',
	  password: 'unsafe'
	}
  
	await api
	  .post('/api/users')
	  .send(newUser)
	  .expect(201)
  
	const response = await api.get('/api/users')
    .expect(200)
  
	const usersInDb = await User.find({ username: 'testuser' })

  expect(usersInDb).toHaveLength(1)
  const user = usersInDb[0]
  expect(user.username).toBe('testuser')
  expect(user.name).toBe('Johannes')

 
  })

  test('a non-valid user cant be created', async () => {



	const newUser = {
	  username: 'aa',
	  name: 'Johannes',
	  password: 'unsafe'
	}
  
	await api
	  .post('/api/users')
	  .send(newUser)
	  .expect(400)
  
	const response = await api.get('/api/users')
    .expect(200)
  
	const usersInDb = await User.find({ username: 'aa' })

  expect(!usersInDb)

 
  })

   test('a non-valid user cant be created', async () => {



	const newUser = {
	  username: 'testuser',
	  name: 'Johannes',
	  password: 'un'
	}
  
	await api
	  .post('/api/users')
	  .send(newUser)
	  .expect(400)
  
	const response = await api.get('/api/users')
    .expect(200)
  
	const usersInDb = await User.find({ username: 'testuser' })

  expect(!usersInDb)

 
  })


  test('a duplicate user cant be created', async () => {



	const newUser = {
	  username: 'testuser',
	  name: 'Johannes',
	  password: 'unsafe'
	}
  
	await api
	  .post('/api/users')
	  .send(newUser)
	  .expect(201)
  
	const response = await api.get('/api/users')
    .expect(200)
  
	const usersInDb = await User.find({ username: 'testuser' })

  expect(usersInDb).toHaveLength(1)
  const user = usersInDb[0]
  expect(user.username).toBe('testuser')
  expect(user.name).toBe('Johannes')

  	const duplicateUser = {
	  username: 'testuser',
	  name: 'Johannes',
	  password: 'unsafe'
	}
  
	await api
	  .post('/api/users')
	  .send(duplicateUser)
	  .expect(400)

  const usersInDb2 = await User.find({ username: 'testuser' })

  expect(usersInDb2).toHaveLength(1)
  const user2 = usersInDb[0]
  expect(user2.username).toBe('testuser')
  expect(user2.name).toBe('Johannes')

 
  })
