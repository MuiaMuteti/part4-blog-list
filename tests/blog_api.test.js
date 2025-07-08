const { beforeEach, test, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./blog_test_helper')
const supertest = require('supertest')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})

test('all notes are returned and in json format', async () => {
    const response = await api
                    .get('/api/blogs')
                    .expect(200)
                    .expect('Content-Type', /application\/json/)
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('blog has id property', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => {
        assert(blog.hasOwnProperty('id'))
        assert(!blog.hasOwnProperty('_id'))
    })
})

test('a blog is added', async () => {
    const newBlog = {
        title: "Net Runners",
        author: "Arasaka",
        url: "cyberpunk.com",
        likes: 100000
    }

    await api.post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

    const blogsDB = await helper.blogsInDB()
    assert.strictEqual(blogsDB.length, helper.initialBlogs.length + 1)

    const titles = blogsDB.map(blog => blog.title)
    assert(titles.includes(newBlog.title))
})

test('missing likes property defaults to zero', async () => {
    const newBlog = {
        title: "Net Runners",
        author: "Arasaka",
        url: "cyberpunk.com"
    }
    const response = await api.post('/api/blogs').send(newBlog)
    assert.strictEqual(response.body.likes, 0)
})

test('missing title or url results to status code 400', async () => {
    const newBlog = {
        author: "Arasaka",
        likes: 100000
    }
    await api.post('/api/blogs')
            .send(newBlog)
            .expect(400)

    const blogsDB = await helper.blogsInDB()
    assert.strictEqual(blogsDB.length, helper.initialBlogs.length)
})

after(async () => {
    await mongoose.connection.close()
})