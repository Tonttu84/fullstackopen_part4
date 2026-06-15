const jwt = require('jsonwebtoken')
const config = require('../../utils/config')



const createToken = (user) => {
  const userForToken = {
    username: user.username,
    id: user._id
  }

  return jwt.sign(userForToken, config.SECRET, {
    expiresIn: '1h'
  })
}


const dummy = (blogs) => {
  return 1;
}

const totalLikes = (blogs) => {
  let result = 0

  blogs.forEach(blog => {
    result += blog.likes
  })

  return result
}

const mostLikes = (blogs) => {
  const counts = {}

  blogs.forEach(blog => {
    const author = blog.author
    const likes = blog.likes || 0

    if (!counts[author]) {
      counts[author] = 0
    }

    counts[author] += likes
  })

  let maxAuthor = null
  let maxLikes = -Infinity

  for (const author in counts) {
    if (counts[author] > maxLikes) {
      maxLikes = counts[author]
      maxAuthor = author
    }
  }

  return {
    author: maxAuthor,
    likes: maxLikes
  }
}

const mostBlogs = (blogs) => {
  const counts = {}

  blogs.forEach(blog => {
    const author = blog.author
    counts[author] = (counts[author] || 0) + 1
  })

  let maxAuthor = null
  let maxBlogs = 0

  for (const author in counts) {
    if (counts[author] > maxBlogs) {
      maxBlogs = counts[author]
      maxAuthor = author
    }
  }

  return {
    author: maxAuthor,
    blogs: maxBlogs
  }
}



const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  let favorite = blogs[0]
  return blogs.reduce((fav, blog) =>
    blog.likes > fav.likes ? blog : fav
  , favorite)
}

module.exports = { createToken, dummy, totalLikes, mostLikes, mostBlogs, favoriteBlog }