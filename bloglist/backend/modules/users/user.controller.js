const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userRouter = require('express').Router()
const User = require('./user.model.js')
const config = require('../../utils/config')



userRouter.get('/', async (request, response) => {
	
	
	const users = await User.find({})
	response.json(users)
	
  })

userRouter.post('/', async (request, response) => {
	const { username, name, password } = request.body

	if (!username || !name || !password) {
    return response.status(400).json({
      error: 'username, name or password missing'
    })
  }

  	if (password.length < 3)
	{
		return response.status(400).json({
      error: 'Password is too short'
    })
	}


	const saltRounds = 10
	const passwordHash = await bcrypt.hash(password, saltRounds)
	
	const user = new User({
    username,
    name,
    passwordHash,
  })

	const savedUser = await user.save()
	response.status(201).json(savedUser)

  })

  userRouter.post('/login', async (request, response) => {
	const { username, password } = request.body

	if (!username || !password) {
    return response.status(400).json({
      error: 'username,  or password missing'
    })
  }
  	 const user = await User.findOne({ username }).select('+passwordHash')
	 let passwordCheckPassed = false;

	if (user) 
	{
		passwordCheckPassed = await bcrypt.compare(password, user.passwordHash)
	}

	if (!user || passwordCheckPassed !== true)
	{
		return response.status(401).json({
      	error: 'invalid username or password'
    })
	}

	 const userForToken = {
    username: user.username,
    id: user._id,
  }

  	 const token = jwt.sign(
    userForToken, 
    config.SECRET,
    { expiresIn: 60*60 }
  )

	response
    .status(200)
    .send({ token, username: user.username, name: user.name })


 })

module.exports = userRouter