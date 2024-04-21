require('dotenv').config()

const express = require('express')
const jwt = require('jsonwebtoken')
const model = require('./model/userSchema')

const router = express.Router();

//a middleware function to verify user's authorization with tokens before logging them into the tasks page

/*
const verifyUser = (req, res, next) => {
    const token = req.cookies.token
    if (!token) {
        return res.send('not-token')
    } else {
        jwt.verify(token, process.env.MY_SECRET, (err, decode) => {
            if (err) {
                req.body.email = decode.email
                next()
                 return res.send('not-token')
            } else {
                return res.send('not-token')
                //req.body.email = decode.email
                // next()
            }
        })
    }
} 
*/

//routes to create a new user
router.post('/signup', async (req, res) => {
    const newUser = new model({
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password
    })

    try {
        await newUser.save()
        res.send(newUser)
    } catch (error) {
        res.status(400)
        res.send({ error: error.message })
    }
})

//Login route and user's authentication with password and email check and authentication with web token
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const token = jwt.sign({ email }, process.env.MY_SECRET, { expiresIn: '1d' })
    try {
        const user = await model.findOne({ email: email })
        if (user.password === password) {
            res.cookie('token', token)
            res.send(user)
        }

    } catch (error) {
        res.status(401)
        res.send({ error: error.message })
    }
})

//route to get user and user's projects after authorization is confirmed 
router.get('/tasks',  async (req, res) => {
    try {
        const userDetails = await model.findOne({ email: req.query.email })
        res.send(userDetails)
    } catch (error) {
        res.status(400)
        res.send({ error: error.message })
    }
})

//route to create and add new project/tasks to the user's list
router.patch('/tasks',  async (req, res) => {

    try {
        const email = req.body.email
        const update = req.body
        const option = { new: true }

        const result = await model.findOneAndUpdate(
            { email }, { '$push': { tasks: update } }, option
        )
        res.send(result)
    }

    catch (error) {
        res.status(400)
        res.send({ error: error.message })
    }
})

//route to edit user's tasks based on title, description and deadline
router.patch('/tasks/edit',  async (req, res) => {
    try {
        const email = req.body.email
        const update = req.body
        const option = { new: true }

        const result = await model.findOneAndUpdate(
            { email, 'tasks._id': update._id }, {
            '$set': {
                'tasks.$.title': update.title,
                'tasks.$.description': update.description,
                'tasks.$.deadline': update.deadline,
                'tasks.$.isDone': update.isDone
            }
        }, option
        )
        res.send(result)
    }
    catch (error) {
        res.send(error)
    }
})

//route to update user's status to true of false
router.patch('/tasks/status',  async (req, res) => {

    try {
        const email = req.body.email
        const update = req.body
        const option = { new: true }

        const result = await model.findOneAndUpdate(
            { email, 'tasks._id': update._id }, { '$set': { 'tasks.$.isDone': update.isDone } }, option
        )
        res.send(result)
    }

    catch (error) {
        res.status(400)
        res.send({ error: error.message })
    }
})

//route to delete selected project/tasks from the user's list
router.patch('/tasks/delete',  async (req, res) => {

    try {
        const email = req.body.email
        const { title, description, deadline, isDone, _id } = req.body
        const option = { new: true }

        const result = await model.findOneAndUpdate(
            { email }, { '$pull': { tasks: { title, description, deadline, isDone, _id } } }, option
        )
        const response={
            result:result ,
            isDelete:true
        }
        res.send(response)
    }

    catch (error) {
        res.status(400)
        res.send({ error: error.message })
    }
})

//logging out a user
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.send('success')
})

module.exports = router
