'use strict'

const fs = require('fs')
const path= require('path')

const Artist = require('../models/artist')
const Album = require('../models/album')
const Song = require('../models/song')


function getArtist(req, res){
    res.status(200).send({message: 'Metodo getArtist del controlador artist'})
}

module.exports = {
    getArtist
}