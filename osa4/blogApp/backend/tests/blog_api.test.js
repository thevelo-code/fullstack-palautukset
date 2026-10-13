const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)


describe('viewing blogs', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('id field is named id', async () => {
    const response = await api.get('/api/blogs')
    const blogId = response.body[0].id
    assert.ok(blogId)
  })
})

describe('addition of a new blog', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await User.insertMany(helper.initialUsers)
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('a valid blog can be added ', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Test Author',
      url: 'https://test-blog.com',
      likes: 5
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${helper.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const contents = blogsAtEnd.map(b => b.title)

    assert(contents.includes('Test Blog'))
  })

  test('if likes property is missing, it defaults to 0', async () => {
    const newBlog = {
      title: 'Test Blog Without Likes',
      author: 'Test Author',
      url: 'https://test-blog.com'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${helper.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const blog = blogsAtEnd.find(b => b.title === 'Test Blog Without Likes')
    assert.strictEqual(blog.likes, 0)
  })

  test('blog without title is not added and response status is 400', async () => {
    const newBlog = {
      url: 'https://test-blog.com',
      author: 'Test Author',
      likes: 5
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${helper.token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('blog without url is not added and response status is 400', async () => {
    const newBlog = {
      title: 'Test Blog Without URL',
      author: 'Test Author',
      likes: 5
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${helper.token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('adding a blog without token fails with status code 401', async () => {
    const newBlog = {
      title: 'Test Blog Without Token',
      author: 'Test Author',
      url: 'https://test-blog.com',
      likes: 5
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })
})

describe('deletion of a blog', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await User.insertMany(helper.initialUsers)
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${helper.token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
  })

  test('fails with status code 401 if token is missing', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('fails with status code 403 if user is not the owner of the blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${helper.wrongtoken}`)
      .expect(403)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })
})

describe('updating a blog', () => {
  test('succeeds with status code 200 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlogData = {
      title: 'Updated Blog Title',
      author: 'Updated Blog Author',
      url: 'https://updated-blog.com',
      likes: 10
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlogData)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlog = blogsAtEnd.find(b => b.id === blogToUpdate.id)
    assert.strictEqual(updatedBlog.title, 'Updated Blog Title')
    assert.strictEqual(updatedBlog.author, 'Updated Blog Author')
    assert.strictEqual(updatedBlog.url, 'https://updated-blog.com')
    assert.strictEqual(updatedBlog.likes, 10)
  })

  test('with only likes succeeds with status code 200 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlogData = {
      likes: 15
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlogData)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlog = blogsAtEnd.find(b => b.id === blogToUpdate.id)
    assert.strictEqual(updatedBlog.likes, 15)
  })
})

after(async () => {
  await mongoose.connection.close()
})