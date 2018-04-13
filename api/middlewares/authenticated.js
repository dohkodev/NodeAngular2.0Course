'use strict'

const jwt = require('jwt-simple')
const moment = require('moment')
const config = require('../config')

exports.ensureAuth = function(req, res, next){
    if(!req.headers.authorization){
        return res.status(403).send({message: 'La peticion no tiene cabecera en la autenticacion'})
    }

    var token = req.headers.authorization.replace(/['"]+/g,'') //replace de las comillas simples y dobles
    try{
        var payload = jwt.decode(token, config.SECRET_TOKEN)
        if(payload.exp <= moment().unix()){
            return res.status(401).send({message: 'el token ha expirado'})
        }
    }catch(ex){
        //console.log(ex);
        return res.status(404).send({message: 'el token no es valido'})
    }
    req.user = payload

    next();
}