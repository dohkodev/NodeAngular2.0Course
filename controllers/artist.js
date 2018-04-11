'use strict'

const fs = require('fs')
const path= require('path')
const mongoosePagination = require('mongoose-pagination')

const Artist = require('../models/artist')
const Album = require('../models/album')
const Song = require('../models/song')

function getArtist(req, res){
    var artistId = req.params.id
    Artist.findById(artistId, (err, artist) =>{
        if(err){
            res.status(500).send({message: 'Error al obtener artista'})
        }else{
            if(!artist){
                res.status(404).send({message: 'Artista no encontrado'})
            }else{
                res.status(200).send({artist})
            }
        }
    })
}

function getArtists(req, res){
    if(req.params.page){
        var page = req.params.page
    }else{
        var page = 1
    }

    var itemsPerPage = 3

    Artist.find().sort('name').paginate(page, itemsPerPage, (err, artists, total) => {
        if(err){
            res.status(500).send('error en la peticion de artistas')
        }else{
            if(!artists){
                res.status(404).send('no se encontraron artistas')
            }else{
                return res.status(200).send({
                    total: total,
                    artists: artists 
                })
            }
        }
    })
}

function saveArtist(req, res) {
    var artist = new Artist
    var params = req.body
    artist.name = params.name
    artist.description = params.description
    artist.image = 'null'

    artist.save((err, artistStored) => {
        if(err){
            res.status(500).send({message: 'erros al grabar artista'})
        }else{
            if(!artistStored){
                res.status(404).send({message: 'el artista no ha sido grabado'})
            }else{
                res.status(200).send({artist: artistStored})
            }
        }
    })
}

function updateArtist(req, res){
    var artistId = req.params.id
    var update = req.body
    Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
        if(err){
            res.status(500).send({message: 'error en la peticion'})
        }else{
            if(!artistUpdated){
                res.status(404).send({message: 'no se encontró el artista'})
            }else{
                res.status(200).send({artist: artistUpdated})
            }
        }
    })
}

function deleteArtist(req, res){
    var artistId = req.params.id
    Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
        if(err){
            res.status(500).send({message: 'error en la peticion'})
        }else{
            if(!artistRemoved){
                res.status(404).send({message: 'no se encontró el artista'})
            }else{
                Album.find({artist: artistRemoved._id}).remove((err, albumRemoved) => {
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
                                        res.status(200).send({artist: artistRemoved})
                                    }
                                }
                            })
                        }
                    }
                })
            }
        }
    })
}

function uploadImage(req, res){
    let artistId = req.params.id
    let fileName = 'No subido...'

    if(req.files){
        let filePath = req.files.image.path
        let fileSplit = filePath.split('\\')
        let fileName = fileSplit[2]

        let extSplit = fileName.split('\.')
        let fileExte = extSplit[1]

        if(fileExte == 'png' || fileExte == 'jpg' || fileExte == 'gif'){

            Artist.findByIdAndUpdate(artistId, {image: fileName}, (err, artistUpdated) => {
                if(!artistUpdated){
                    res.status(404).send({message: 'no se ha podido actualizar el usuario'})
                } else {
                    res.status(200).send({artist: artistUpdated})
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
    let pathFile = './uploads/artists/'+imageFile

    fs.exists(pathFile, function(exists){
        if(exists){
            res.sendFile(path.resolve(pathFile))
        }else{
            res.status(200).send({message: 'No existe la Imagen'})
        }
    })
}

module.exports = {
    getArtist,
    saveArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
}