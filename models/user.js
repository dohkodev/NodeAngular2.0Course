const mongoose = require('mongoose')
const schema = mongoose.Schema

var UserSchema = schema({
    name: String,
    lastname: String,
    email: String,
    password: String,
    role: String,
    image: String
})

module.exports = mongoose.model('User', UserSchema)