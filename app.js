'use strict'

const express = require('express')
const bodyParser = require('body-parser')

var app = express()

//cargar rutas
const userRoutes = require('./routes/user')
const artistRoutes = require('./routes/artist')
const albumRoutes = require('./routes/album')

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//configuracion de cabeceras http

//rutas base
app.use('/api', userRoutes)
app.use('/api', artistRoutes)
app.use('/api', albumRoutes)

/* app.get('/prueba', function(req, res){
    res.status(200).send({message:'hola mundo'})
}) */
module.exports = app