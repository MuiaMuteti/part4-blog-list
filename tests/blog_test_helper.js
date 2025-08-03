const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        title: "Env Variables",
        author: "Muia",
        url: "localclub.com",
        likes: 1029
    },
    {
        title: "Supertest",
        author: "Muia",
        url: "testing.com",
        likes: 3043
    }
]

const blogsInDB = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDB = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = {
    initialBlogs,
    blogsInDB,
    usersInDB
}