const totalLikes = blogs => {
  return blogs.reduce((acc, blog) => acc + blog.likes, 0)
}

const favoriteBlog = blogs => {
  if (blogs.length === 0) {
    return null
  }

  return blogs.reduce((prev, current) => {
    return prev.likes > current.likes ? prev : current
  })
}

const mostBlogs = blogs => {
  if (blogs.length === 0) {
    return null
  }

  const blogsCount = {}

  blogs.forEach(blog => {
    blogsCount[blog.author] = blogsCount[blog.author] + 1 || 1
  })

  let authorWithMax = {
    author: Object.keys(blogsCount)[0],
    blogs: Object.values(blogsCount)[0],
  }

  Object.keys(blogsCount).forEach(key => {
    if (blogsCount[key] > authorWithMax.blogs) {
      authorWithMax = { author: key, blogs: blogsCount[key] }
    }
  })

  return authorWithMax
}

const mostLikes = blogs => {
  if (blogs.length === 0) {
    return null
  }

  const blogsCount = {}

  blogs.forEach(blog => {
    blogsCount[blog.author] = 0
  })

  blogs.forEach(blog => {
    blogsCount[blog.author] += blog.likes
  })

  let authorWithMaxLikes = {
    author: Object.keys(blogsCount)[0],
    likes: Object.values(blogsCount)[0],
  }

  Object.keys(blogsCount).forEach(key => {
    if (blogsCount[key] > authorWithMaxLikes.likes) {
      authorWithMaxLikes = { author: key, likes: blogsCount[key] }
    }
  })

  return authorWithMaxLikes
}
module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
