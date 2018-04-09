'use strict'

const express = require('express')
const ArtistController = require('../controllers/artist')
const middleware = require('../middlewares/authenticated')

var api = express.Router()

api.get('/artist/:id', middleware.ensureAuth, ArtistController.getArtist)
api.post('/artist', middleware.ensureAuth, ArtistController.saveArtist)
api.get('/artists/:page?', middleware.ensureAuth, ArtistController.getArtists)
api.put('/artist/:id', middleware.ensureAuth, ArtistController.updateArtist)

module.exports = api