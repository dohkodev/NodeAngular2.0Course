'use strict'

const mongoose = require('mongoose')
const config = require('./config')

var app = require('./app')
const port = config.port || 1337

mongoose.connect(config.db, (err, res) => {
    if(err){   
        throw err;
    }else{
        console.log('base de datos corriendo correctamente');
        app.listen(port, function(){
            console.log(`servidor del api corriendo en http://localhost:${port}`)
        })
    }
})