'use strict'

const express = require('express')
const AlbumController = require('../controllers/album')
const middleware = require('../middlewares/authenticated')
const multiparty = require('connect-multiparty')

var api = express.Router()
var mid_upload = multiparty({uploadDir: './uploads/artists'})

api.get('/album/:id', middleware.ensureAuth, AlbumController.getALbum)
api.post('/album', middleware.ensureAuth, AlbumController.saveAlbum)
api.get('/albums/:artist?', middleware.ensureAuth, AlbumController.getAlbums)

module.exports = api