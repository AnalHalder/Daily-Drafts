const express = require('express')
const route = express.Router()
const {logIn,logOut,signUp} = require('../controllers/auth.controller')

route
    .post('/signup', signUp)
    .post('/login', logIn)
    .post('/logout',logOut)


    module.exports = route