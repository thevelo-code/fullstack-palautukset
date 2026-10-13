const { listWithOneBlog, blogs, emptyList }  = require('../examples/exampleblogs')
const { test, describe } = require('node:test')
const listHelper = require('../utils/list_helper')
const assert = require('node:assert')

describe('total likes', () => {
  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  }),

  test('when list has many blogs equals the sum of likes', () => {
    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 36)
  }),

  test('when list is empty equals zero', () => {
    const result = listHelper.totalLikes(emptyList)
    assert.strictEqual(result, 0)
  })
})

describe('favorite blog', () => {
  test('when list has only one blog equals that blog', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    assert.deepStrictEqual(result, listWithOneBlog[0])
  }),
  test('when list has many blogs equals the blog with most likes', () => {
    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, blogs[2])
  }),
  test('when list is empty equals null', () => {
    const result = listHelper.favoriteBlog(emptyList)
    assert.deepStrictEqual(result, null)
  })
})


describe('most blogs', () => {
  test('when list has only one blog equals that author and 1', () => {
    const result = listHelper.mostBlogs(listWithOneBlog)
    assert.deepStrictEqual(result, { author: 'Edsger W. Dijkstra', blogs: 1 })
  }),
  test('when list has many blogs equals the author with most blogs and the number of blogs', () => {
    const result = listHelper.mostBlogs(blogs)
    assert.deepStrictEqual(result, { author: 'Robert C. Martin', blogs: 3 })
  }),
  test('when list is empty equals null', () => {
    const result = listHelper.mostBlogs(emptyList)
    assert.deepStrictEqual(result, null)
  })
})

describe('most likes', () => {
  test('when list has only one blog equals that author and the number of likes', () => {
    const result = listHelper.mostLikes(listWithOneBlog)
    assert.deepStrictEqual(result, { author: 'Edsger W. Dijkstra', likes: 5 })
  }),
  test('when list has many blogs equals the author with most likes and the number of likes', () => {
    const result = listHelper.mostLikes(blogs)
    assert.deepStrictEqual(result, { author: 'Edsger W. Dijkstra', likes: 17 })
  }),
  test('when list is empty equals null', () => {
    const result = listHelper.mostLikes(emptyList)
    assert.deepStrictEqual(result, null)
  })
})
