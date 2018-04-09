'use strict'

const express = require('express')
const ArtistController = require('../controllers/artist')
const middleware = require('../middlewares/authenticated')
const multiparty = require('connect-multiparty')

var api = express.Router()
var mid_upload = multiparty({uploadDir: './uploads/artists'})

api.get('/artist/:id', middleware.ensureAuth, ArtistController.getArtist)
api.post('/artist', middleware.ensureAuth, ArtistController.saveArtist)
api.get('/artists/:page?', middleware.ensureAuth, ArtistController.getArtists)
api.put('/artist/:id', middleware.ensureAuth, ArtistController.updateArtist)
api.delete('/artist/:id', middleware.ensureAuth, ArtistController.deleteArtist)
api.post('/upload-image-artist/:id', [middleware.ensureAuth, mid_upload], ArtistController.uploadImage)
api.get('/get-image-artist/:imageFile', ArtistController.getImageFile)

module.exports = api