const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

const User = require('../users/user.model')
const Blog = require('./blog.model')

let mongoServer

const connect = async () => {
  mongoServer = await MongoMemoryServer.create()
  const uri = mongoServer.getUri()

  await mongoose.connect(uri)
}

const clearDatabase = async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})
}

const seedDatabase = async () => {
  const users = await User.insertMany([
    { username: 'alice', name: 'Alice Doe', passwordHash: 'hashedpw1', blogs: [] },
    { username: 'bob', name: 'Bob Smith', passwordHash: 'hashedpw2', blogs: [] },
    { username: 'charlie', name: 'Charlie Brown', passwordHash: 'hashedpw3', blogs: [] }
  ])

  const [alice, bob, charlie] = users

  const blogs = await Blog.insertMany([
    { title: 'Alice Blog 1', author: 'Alice', url: 'http://a1.com', user: alice._id, likes : 5 },
    { title: 'Alice Blog 2', author: 'Alice', url: 'http://a2.com', user: alice._id },
    { title: 'Bob Blog', author: 'Bob', url: 'http://b.com', user: bob._id },
    { title: 'Charlie Blog 1', author: 'Charlie', url: 'http://c1.com', user: charlie._id },
    { title: 'Charlie Blog 2', author: 'Charlie', url: 'http://c2.com', user: charlie._id }
  ])

  await User.findByIdAndUpdate(alice._id, {
    blogs: blogs.filter(b => b.user.equals(alice._id)).map(b => b._id)
  })

  await User.findByIdAndUpdate(bob._id, {
    blogs: blogs.filter(b => b.user.equals(bob._id)).map(b => b._id)
  })

  await User.findByIdAndUpdate(charlie._id, {
    blogs: blogs.filter(b => b.user.equals(charlie._id)).map(b => b._id)
  })
}

const closeDatabase = async () => {
  await mongoose.connection.close()
  await mongoServer.stop()
}

module.exports = {
  connect,
  clearDatabase,
  seedDatabase,
  closeDatabase
}