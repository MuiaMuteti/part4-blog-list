const { beforeEach, test, after, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./blog_test_helper')
const supertest = require('supertest')

const api = supertest(app)

describe('when there is initially some blogs saved', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)
    })

    test('all blogs are returned and in json format', async () => {
        const response = await api
                        .get('/api/blogs')
                        .expect(200)
                        .expect('Content-Type', /application\/json/)
        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('all blogs returned have unique identifier property', async () => {
        const response = await api.get('/api/blogs')
        response.body.forEach(blog => {
            assert(blog.hasOwnProperty('id'))
            assert(!blog.hasOwnProperty('_id'))
        })
    })

    describe('addition of a new blog', () => {
        test('succeeds with valid data', async () => {
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

        test('missing the likes property succeeds and the property defaults to zero', async () => {
            const newBlog = {
                title: "Net Runners",
                author: "Arasaka",
                url: "cyberpunk.com"
            }
            const response = await api.post('/api/blogs').send(newBlog).expect(201)
            assert.strictEqual(response.body.likes, 0)
        })

        test('fails with status code 400 if title is missing', async () => {
            const newBlog = {
                author: "Arasaka",
                likes: 100000,
                url: "cyberpunk.com"
            }
            await api.post('/api/blogs')
                    .send(newBlog)
                    .expect(400)

            const blogsDB = await helper.blogsInDB()
            assert.strictEqual(blogsDB.length, helper.initialBlogs.length)
        })

        test('fails with status code 400 if url is missing', async () => {
            const newBlog = {
                title: "Net Runners",
                author: "Arasaka",
                likes: 100000
            }
            await api.post('/api/blogs')
                    .send(newBlog)
                    .expect(400)

            const blogsDB = await helper.blogsInDB()
            assert.strictEqual(blogsDB.length, helper.initialBlogs.length)
        })
    })

    describe('deletion of a blog', () => {
        test('succeeds with status code 204 if id is valid', async () => {
            const blogsAtStart = await helper.blogsInDB()
            const blogToDelete = blogsAtStart[0]

            await api.delete(`/api/blogs/${blogToDelete.id}`)
                .expect(204)

            const blogsAtEnd = await helper.blogsInDB()
            assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

            const titles = blogsAtEnd.map(blog => blog.title)
            assert(!titles.includes(blogToDelete.title))
        })
        test('fails with status code 400 if id is invalid', async () => {
            const invalidID = 'invalid123'

            await api.delete(`/api/blogs/${invalidID}`)
                .expect(400)

            const blogsAtEnd = await helper.blogsInDB()
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
        })
    })
    describe('updating of a blog', () => {
        test('succeeds with valid data', async () => {
            const blogsAtStart = await helper.blogsInDB()
            const blogToUpdate = blogsAtStart[0]

            blogToUpdate.title = 'Environment Variables'
            blogToUpdate.likes = 9090

            const updatedBlog = await api
                .put(`/api/blogs/${blogToUpdate.id}`)
                .send(blogToUpdate)
                .expect(200)
            
            assert.deepStrictEqual(updatedBlog.body, blogToUpdate)
        })
    })
})

after(async () => {
    await mongoose.connection.close()
})