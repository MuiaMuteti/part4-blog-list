const { beforeEach, test, after, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const User = require('../models/user')
const helper = require('./blog_test_helper')

const api = supertest(app)

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        
        const passwordHash = await bcrypt.hash('pass123$', 10)
        const user = new User({
            username: 'root1',
            name: 'root alpha',
            passwordHash
        })
        await user.save()
    })

    describe('creation of a new user', () => {
        test('suceeds with valid data', async () => {
            const usersAtStart = await helper.usersInDB()

            const newUser = {
                username: 'robot1',
                name: 'mr robot',
                password: 'secret9090'
            }
            const savedUser = await api
                .post('/api/users')
                .send(newUser)
                .expect(201)
                .expect('Content-Type', /application\/json/)
            
            const usersAtEnd = await helper.usersInDB()
            assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

            const usernames = usersAtEnd.map(u => u.username)
            assert(usernames.includes(newUser.username))
        })

        test('fails with status code 400 if username is missing', async () => {
            const usersAtStart = await helper.usersInDB()

            const newUser = {
                name: 'mr robot',
                password: 'secret9090'
            }

            await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
            
            const usersAtEnd = await helper.usersInDB()
            assert.strictEqual(usersAtEnd.length, usersAtStart.length)
        })

        test('fails with status code 400 if username is not unique', async () => {
            const usersAtStart = await helper.usersInDB()

            const newUser = {
                username: 'root1',
                name: 'mr root',
                password: 'secret9090'
            }

            await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
            
            const usersAtEnd = await helper.usersInDB()
            assert.strictEqual(usersAtEnd.length, usersAtStart.length)
        })

        test('fails with status code 400 if username is less than 3 characters long', async () => {
            const usersAtStart = await helper.usersInDB()

            const newUser = {
                username: 'ro',
                name: 'mr root',
                password: 'secret9090'
            }

            await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
            
            const usersAtEnd = await helper.usersInDB()
            assert.strictEqual(usersAtEnd.length, usersAtStart.length)
        })

        test('fails with status code 400 if password is missing', async () => {
            const usersAtStart = await helper.usersInDB()

            const newUser = {
                username: 'root1',
                name: 'mr root'
            }

            await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
            
            const usersAtEnd = await helper.usersInDB()
            assert.strictEqual(usersAtEnd.length, usersAtStart.length)
        })

        test('fails with status code 400 if password is less than 3 characters long', async () => {
            const usersAtStart = await helper.usersInDB()

            const newUser = {
                username: 'root1',
                name: 'mr root',
                password: 's0'
            }

            await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
            
            const usersAtEnd = await helper.usersInDB()
            assert.strictEqual(usersAtEnd.length, usersAtStart.length)
        })
    })
})

after(async () => {
    await mongoose.connection.close()
})
