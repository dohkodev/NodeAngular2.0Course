'use strict'

const express = require('express')
const SongController = require('../controllers/song')
const middleware = require('../middlewares/authenticated')
const multiparty = require('connect-multiparty')

var api = express.Router()
var mid_upload = multiparty({uploadDir: './uploads/songs'})

api.get('/son/', middleware.ensureAuth, SongController.getSong)
api.post('/song', middleware.ensureAuth, SongController.saveSong)

module.exports = api