'use strict'

const fs = require('fs')
const path= require('path')
const mongoosePagination = require('mongoose-pagination')

const Artist = require('../models/artist')
const Album = require('../models/album')
const Song = require('../models/song')

function getALbum(req, res){
    var albumId = req.params.id
    Album.findById(albumId).populate({path: 'artist'}).exec((err, album) => {
        if(err){
            res.status(500).send({message: 'error en la petición'})
        }else{
            if(!album){
                res.status(404).send({message: 'album no encontrado'})
            }else{
                res.status(200).send({album})
            }
        }
    })
}

function saveAlbum(req, res){
    var params = req.body
    //console.log(params)
    var album = new Album()
    album.title = params.title
    album.description = params.description
    album.year = params.year
    album.image = 'null'
    album.artist = params.artist

    album.save((err, albumStored) => {
        if(err){
            res.status(500).send({message: 'error en el servidor'})
        }else{
            if(!albumStored){
                res.status(404).send({message: 'error al grabar album'})
            }else{
                res.status(200).send({album: albumStored})
            }
        }
    })
}

function getAlbums(req, res){
    var artistId = req.params.artist

    if(!artistId){
        //obtiene todos los albunes de todos los artistas
        var find = Album.find({}).sort('title')
    }else{
        //obtiene los albunes de un artista
        var find = Album.find({artist: artistId}).sort('year')
    }

    find.populate({path: 'artist'}).exec((err, albums) => {
        if(err){
            res.status(500).send({message: 'error en la petición'})
        }else{
            if(!albums){
                res.status(404).send({message: 'no se encontraron albunes'})
            }else{
                res.status(200).send({albums})
            }
        }
    })
}

function updateAlbum(req, res){
    var albumId = req.params.id
    var update = req.body

    Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) => {
        if(err){
            res.status(500).send({message: 'error en la petición'})
        }else{
            if(!albumUpdated){
                res.status(404).send({message: 'error al actualizar album'})
            }else{
                res.status(200).send({album: albumUpdated})
            }
        }
    })
}

function deleteAlbum(req, res){
    let albumId = req.params.id
    Album.findByIdAndRemove(albumId, (err, albumRemoved) => {
        if(err){
            res.status(500).send({message: 'error en la peticion'})
        }else{
            if (!albumRemoved){
                res.status(404).send({message: 'no se encontró el album del artista'})
            }else{
                Song.find({album: albumRemoved._id}).remove((err, songRemoved) => {
                    if (err){
                        res.status(500).send({message: 'error en la peticion'})
                    }else{
                        if (!songRemoved){
                            res.status(404).send({message: 'no se encontró la canción'})
                        }else{
                            res.status(200).send({album: albumRemoved})
                        }
                    }
                })
            }
        }
    })
}

function uploadImage(req, res){
    let albumId = req.params.id
    let fileName = 'No subido...'

    if(req.files){
        let filePath = req.files.image.path
        let fileSplit = filePath.split('\\')
        let fileName = fileSplit[2]

        let extSplit = fileName.split('\.')
        let fileExte = extSplit[1]

        if(fileExte == 'png' || fileExte == 'jpg' || fileExte == 'gif'){

            Album.findByIdAndUpdate(albumId, {image: fileName}, (err, albumUpdated) => {
                if(!albumUpdated){
                    res.status(404).send({message: 'no se ha podido actualizar el usuario'})
                } else {
                    res.status(200).send({album: albumUpdated})
                }
            })
        }else{
            res.status(200).send({message: 'Extension del archivo no valida'})
        }

        console.log(fileName);
    }else{
        res.status(200).send({message: 'No has subido ninguna imagen...'})
    }
}

function getImageFile(req, res){
    let imageFile = req.params.imageFile
    let pathFile = './uploads/albums/'+imageFile

    fs.exists(pathFile, function(exists){
        if(exists){
            res.sendFile(path.resolve(pathFile))
        }else{
            res.status(200).send({message: 'No existe la Imagen'})
        }
    })
}

module.exports = {
    getALbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
}