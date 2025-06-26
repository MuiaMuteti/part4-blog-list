const lodash = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((accum, blog) => {
        return accum + blog.likes
    }, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return null
    }

    return blogs.reduce((maxLikesBlog, blog) => {
        return blog.likes > maxLikesBlog.likes? blog : maxLikesBlog
    })
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return null
    }

    const authors = lodash.countBy(blogs, 'author')
    const authorMostBlogs = Object.keys(authors).
            reduce((maxAuthor, currAuthor) => 
                authors[currAuthor] > authors[maxAuthor]? currAuthor : maxAuthor)
    return {
        author: authorMostBlogs,
        blogs: authors[authorMostBlogs]
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
}