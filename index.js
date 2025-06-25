const config = require('./utils/config')
const logger = require('./utils/logger')

const express = require('express')
const mongoose = require('mongoose')

const app = express()

const Blog = require('./models/blog')

const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl)

app.use(express.json())

app.get('/api/blogs', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog.save().then((result) => {
    response.status(201).json(result)
  })
})

const PORT = config.PORT

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})