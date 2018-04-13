'use strict'

const express = require('express')
const AlbumController = require('../controllers/album')
const middleware = require('../middlewares/authenticated')
const multiparty = require('connect-multiparty')

var api = express.Router()
var mid_upload = multiparty({uploadDir: './uploads/albums'})

api.get('/album/:id', middleware.ensureAuth, AlbumController.getALbum)
api.post('/album', middleware.ensureAuth, AlbumController.saveAlbum)
api.get('/albums/:artist?', middleware.ensureAuth, AlbumController.getAlbums)
api.put('/album/:id', middleware.ensureAuth, AlbumController.updateAlbum)
api.delete('/album/:id', middleware.ensureAuth, AlbumController.deleteAlbum)
api.post('/upload-image-album/:id', [middleware.ensureAuth, mid_upload], AlbumController.uploadImage)
api.get('/get-image-album/:imageFile', AlbumController.getImageFile)

module.exports = api