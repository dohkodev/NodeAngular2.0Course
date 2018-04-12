'use strict'

const fs = require('fs')
const path= require('path')
const mongoosePagination = require('mongoose-pagination')

const Artist = require('../models/artist')
const Album = require('../models/album')
const Song = require('../models/song')

function getSong(req, res){
    res.status(200).send({message: 'controlador cancion'})
}

function saveSong(req, res){
    var params = req.body    

    let song = new Song()
    song.number = params.number
    song.name = params.name
    song.duration = params.duration
    song.file = 'null'
    song.album = params.album

    song.save((err, songStored) => {
        if(err){
            res.status(500).send({message: 'error en la petición'})
        }else{
            if(!songStored){
                res.status(404).send({message: 'no se ha guardado la canción'})
            }else{
                res.status(200).send({song: songStored})
            }
        }
    })
}   

module.exports = {
    getSong,
    saveSong
}