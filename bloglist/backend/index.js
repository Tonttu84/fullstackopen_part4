const app = require('./app')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')

logger.info('connecting to MongoDB...')

mongoose
  .connect(config.mongoUrl)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})