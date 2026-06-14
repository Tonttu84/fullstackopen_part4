const express = require('express')
const middleware = require('./middleware/middleware.js')

const blogRouter = require('./modules/blogs/blog.controller.js')
const userRouter = require('./modules/users/user.controller.js')

const app = express()

app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app