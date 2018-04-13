'use strict'

const jwt = require('jwt-simple')
const moment = require('moment')
const config = require('../config')

exports.createToken = function(user){
    var payload = {
        sub: user._id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(14, 'days').unix
    }

    return jwt.encode(payload, config.SECRET_TOKEN)
}