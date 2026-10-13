
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const initialBlogs = [
  {
    _id: '6ace3efaef35c22f09997d08',
    title: 'Testiblogi',
    author: 'Iso Tekijä',
    url: 'http://test.com',
    likes: 10,
    user: '6ace344f0f2961f609d196bd',
    __v: 0
  }
]

const initialUsers = [
  {
    _id: '6ace344f0f2961f609d196bd',
    username: 'samuli',
    name: 'Samuli Kohonen',
    passwordHash: '$2b$10$qtfDrWL4uWoJrWtVnHRZo.cCMDC/AEHwV/mqYqD4/4V9k7Cx5OLHS',
    __v: 5,
    blogs: ['6ace3efaef35c22f09997d08']
  }
]

const userForToken = {
  username: 'samuli',
  id: '6ace344f0f2961f609d196bd'
}
const userForWrongToken = {
  username: 'toni',
  id: '6ace346bd95f25e7ceaff2b0'
}
const token = jwt.sign(userForToken, process.env.SECRET)
const wrongtoken = jwt.sign(userForWrongToken, process.env.SECRET)


const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon', author: 'John Doe', url: 'http://example.com', likes: 0 })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs, initialUsers, nonExistingId, blogsInDb, usersInDb, token, wrongtoken
}
