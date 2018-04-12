'use strict'

const express = require('express')
const SongController = require('../controllers/song')
const middleware = require('../middlewares/authenticated')
const multiparty = require('connect-multiparty')

var api = express.Router()
var mid_upload = multiparty({uploadDir: './uploads/songs'})

api.get('/song/:id', middleware.ensureAuth, SongController.getSong)
api.post('/song', middleware.ensureAuth, SongController.saveSong)
api.get('/songs/:album?', middleware.ensureAuth, SongController.getSongs)
api.put('/song/:id', middleware.ensureAuth, SongController.updateSong)
api.delete('/song/:id', middleware.ensureAuth, SongController.deleteSong)
api.post('/upload-file-song/:id', [middleware.ensureAuth, mid_upload], SongController.uploadFile)
api.get('/get-song-file/:songFile', SongController.getSongFile)

module.exports = api