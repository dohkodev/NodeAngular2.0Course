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

module.exports = {
    getArtist,
    saveArtist,
    getArtists
}