'use strict'

const express = require('express')
const UserController = require('../controllers/user')
const middleware = require('../middlewares/authenticated')
const multiparty = require('connect-multiparty')

var api = express.Router()
var mid_upload = multiparty({uploadDir: './uploads/users'})

api.get('/probando-controlador', middleware.ensureAuth, UserController.pruebas)
api.post('/register', UserController.saveUser)
api.post('/login', UserController.loginUser)
api.put('/user/:id', middleware.ensureAuth, UserController.updateUser)
api.post('/upload-image-user/:id', [middleware.ensureAuth, mid_upload], UserController.uploadImage)
api.get('/get-image-user/:imageFile', UserController.getImageFile)

module.exports = api