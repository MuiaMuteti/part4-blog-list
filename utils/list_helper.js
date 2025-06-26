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

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return null
    }
    const authorLikes = {}

    for (const blog of blogs) {
        authorLikes[blog.author] = (authorLikes[blog.author] || 0) + blog.likes
    }

    const mostLikesAuthor = Object.keys(authorLikes).
        reduce((maxLikesAuthor, currAuthor) =>
            authorLikes[currAuthor] > authorLikes[maxLikesAuthor]? currAuthor : maxLikesAuthor)
    
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