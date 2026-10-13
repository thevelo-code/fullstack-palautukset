const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const favorite = blogs.reduce((max, blog) => {
    return blog.likes > max.likes
      ? blog
      : max
  }, blogs[0])

  return favorite
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  let authorCounts = {}
  blogs.forEach(blog => {
    authorCounts[blog.author] = (authorCounts[blog.author] || 0) + 1
  })

  const mostBlogsAuthor = Object.keys(authorCounts).reduce((maxAuthor, author) => {
    return authorCounts[author] > authorCounts[maxAuthor] ? author : maxAuthor
  }, blogs[0].author)

  return {
    author: mostBlogsAuthor,
    blogs: authorCounts[mostBlogsAuthor]
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  let authorLikes = {}
  blogs.forEach(blog => {
    authorLikes[blog.author] = (authorLikes[blog.author] || 0) + blog.likes
  })

  const mostLikesAuthor = Object.keys(authorLikes).reduce((maxAuthor, author) => {
    return authorLikes[author] > authorLikes[maxAuthor] ? author : maxAuthor
  }, blogs[0].author)

  return {
    author: mostLikesAuthor,
    likes: authorLikes[mostLikesAuthor]
  }
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}