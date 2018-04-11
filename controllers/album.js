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

module.exports = {
    getALbum,
    saveAlbum,
    getAlbums
}