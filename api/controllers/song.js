'use strict'

const fs = require('fs')
const path= require('path')
const mongoosePagination = require('mongoose-pagination')

const Artist = require('../models/artist')
const Album = require('../models/album')
const Song = require('../models/song')

function getSong(req, res){
    var songId = req.params.id
    Song.findById(songId).populate({path: 'album'}).exec((err, song) => {
        if(err){
            res.status(500).send({message: 'error en la petición'})
        }else{
            if(!song){
                res.status(404).send({message: 'no se encontró la canción'})
            }else{
                res.status(200).send({song})
            }
        }
    })
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

function getSongs(req, res){
    let albumId = req.params.album

    if(!albumId){
        var find = Song.find({}).sort('number')
    }else{
        var find = Song.find({album: albumId}).sort('number')
    }
    find.populate({
        path: 'album',
        populate: {
            path: 'artist',
            model: 'Artist'
        }
    }).exec((err, songs) => {
        if(err){
            res.status(500).send({message: 'error en la petición'})
        }else{
            if(!songs){
                res.status(404).send({message: 'no se encontraron la canciones'})
            }else{
                res.status(200).send({songs})
            }
        }
    })
}

function updateSong(req, res){
    let songId = req.params.id
    let update = req.body

    Song.findByIdAndUpdate(songId, update, (err, songUpdated) =>{
        if(err){
            res.status(500).send({message: 'error en la petición'})
        }else{
            if(!songUpdated){
                res.status(404).send({message: 'no se encontró la canción'})
            }else{
                res.status(200).send({song: songUpdated})
            }
        }
    })
}

function deleteSong(req, res){
    let songId = req.params.id
    Song.findByIdAndRemove(songId, (err, songRemoved) => {
        if(err){
            res.status(500).send({message: 'error en la petición'})
        }else{
            if(!songRemoved){
                res.status(404).send({message: 'no se encontró la canción'})
            }else{
                res.status(200).send({song: songRemoved})
            }
        }
    })
}

function uploadFile(req, res){
    let songId = req.params.id
    let fileName = 'No subido...'

    if(req.files){
        let filePath = req.files.file.path
        let fileSplit = filePath.split('\\')
        let fileName = fileSplit[2]

        let extSplit = fileName.split('\.')
        let fileExte = extSplit[1]

        if(fileExte == 'mp3' || fileExte == 'ogg'){

            Song.findByIdAndUpdate(songId, {file: fileName}, (err, songUpdated) => {
                if(!songUpdated){
                    res.status(404).send({message: 'no se ha podido actualizar la canción'})
                } else {
                    res.status(200).send({song: songUpdated})
                }
            })
        }else{
            res.status(200).send({message: 'Extension del archivo no valida'})
        }
    }else{
        res.status(200).send({message: 'No has subido ninguna canción...'})
    }
}

function getSongFile(req, res){
    let songFile = req.params.songFile
    let pathFile = './uploads/songs/'+songFile
    console.log(`path: ${pathFile}`)
    fs.exists(pathFile, function(exists){
        if(exists){
            res.sendFile(path.resolve(pathFile))
        }else{
            res.status(200).send({message: 'No existe el archivo de audio'})
        }
    })
}

module.exports = {
    getSong,
    saveSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadFile,
    getSongFile
}