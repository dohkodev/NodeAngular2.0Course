'use strict'

const express = require('express')
const bodyParser = require('body-parser')

var app = express()

//cargar rutas
var userRoutes = require('./routes/user')
var artistRoutes = require('./routes/artist')

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//configuracion de cabeceras http

//rutas base
app.use('/api', userRoutes)
app.use('/api', artistRoutes)

/* app.get('/prueba', function(req, res){
    res.status(200).send({message:'hola mundo'})
}) */
module.exports = app