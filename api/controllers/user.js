'use strict'

const bcrypt = require('bcrypt-nodejs')
const User = require('../models/user')
const jwt = require('../services/jwt')
const fs = require('fs')
const path= require('path')

function pruebas(req, res){
    res.status(200).send({
        message: 'probando controlador user'
    })
}

function saveUser(req, res){
    var params = req.body
    console.log(params)
    var user = new User()
    user.name = params.name
    user.lastname = params.lastname
    user.email = params.email
    user.role = 'ROLE_ADMIN'
    user.image = 'null'

    if(params.password){
        //encriptar password
        bcrypt.hash(params.password, null, null, function(err, hash){
            user.password = hash
            if (user.name != null && user.lastname != null && user.email != null){
                user.save((err, userStored) => {
                    if(err){
                        res.status(500).send({message: 'ERROR: se produjo un error al guardar usuario'})
                    }else{
                        if(!userStored){
                            res.status(404).send({message: 'ERROR: usuario no registrado'})
                        }else{
                            res.status(200).send({user: userStored})
                        }
                    }
                })
            }else{
                res.status(400).send({message: 'Todos los campos son requeridos'})
            }
        })
    }else{
        res.status(400).send({message: 'Introduce la contraseña'})
    }
}

function loginUser (req, res){
    var params = req.body
    var email = params.email
    var password = params.password

    User.findOne({email: email.toLowerCase()}, (err, user) => {
        if (err){
            res.status(500).send({message: 'Error en la peticion'})
        }else{
            if(!user){
                res.status(404).send({message: 'Usuario No Existe'})
            }else{
                //comprobar contraseña
                bcrypt.compare(password, user.password, function(err, check){
                    if(check){
                        //devolver datos
                        if(params.gethash){
                            //devolver un token jwt
                            res.status(200).send({
                                token: jwt.createToken(user)
                            })
                        }else{
                            res.status(200).send({user})
                        }
                    }else{
                        //404
                        res.status(404).send({message: 'Usuario no se puede logear'})
                    }
                })
            }
        }
    })
}

function updateUser(req, res){
    var userId = req.params.id
    var update = req.body

    User.findByIdAndUpdate (userId, update, (err, userUpdated) => {
        if(err){
            res.status(500).send({message: 'Error al actualizar usuario'})
        }else{
            if(!userUpdated){
                res.status(404).send({message: 'no se ha podido actualizar el usuario'})
            }else{
                res.status(200).send({user: userUpdated})
            }
        }
    })
}

function uploadImage(req, res){
    let userId = req.params.id
    let fileName = 'No subido...'

    if(req.files){
        let filePath = req.files.image.path
        let fileSplit = filePath.split('\\')
        let fileName = fileSplit[2]

        let extSplit = fileName.split('\.')
        let fileExte = extSplit[1]

        if(fileExte == 'png' || fileExte == 'jpg' || fileExte == 'gif'){

            User.findByIdAndUpdate(userId, {image: fileName}, (err, userUpdated) => {
                if(!userUpdated){
                    res.status(404).send({message: 'no se ha podido actualizar el usuario'})
                } else {
                    res.status(200).send({image: fileName, user: userUpdated})
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
    let pathFile = './uploads/users/'+imageFile

    fs.exists(pathFile, function(exists){
        if(exists){
            res.sendFile(path.resolve(pathFile))
        }else{
            res.status(200).send({message: 'No existe la Imagen'})
        }
    })
}

module.exports = {
    pruebas,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile
}