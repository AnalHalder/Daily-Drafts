const express = require('express')
const authRouter = express.Router()
const {logIn,logOut,signUp} = require('../controllers/auth.controller')

authRouter
    .post('/signup', signUp)
    .post('/login', logIn)
    .post('/logout',logOut)


    module.exports = authRouter