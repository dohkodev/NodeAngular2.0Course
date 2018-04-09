'use strict'

const express = require('express')
const ArtistController = require('../controllers/artist')
const middleware = require('../middlewares/authenticated')

var api = express.Router()

api.get('/artist', middleware.ensureAuth, ArtistController.getArtist)
api.post('/artist', middleware.ensureAuth, ArtistController.saveArtist)

module.exports = api