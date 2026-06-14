const jwt = require('jsonwebtoken')
const congif = require('../utils/config')

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return response.status(401).json({ error: 'token missing' })
  }

  const token = authorization.replace('Bearer ', '')

  request.token = token

  return next(); 
}

const userExtractor =  (request, response, next) => {
try {
    

    if (!request.token) {
    logger.warn('Token missing before verification')
    return response.status(401).json({ error: 'token missing' })
    }

    const decodedToken = jwt.verify(request.token, congif.SECRET)

    if (!decodedToken.id) {
        logger.warn({
        message: 'Token missing id',
        }) 
        return response.status(401).json({ error: 'token invalid' })
    }

    request.userId = decodedToken.id
    request.user = decodedToken.user;
    

    next()
  } catch (error) {
    return response.status(401).json({ error: 'token invalid' })
  }
}


module.exports = {tokenExtractor, userExtractor}