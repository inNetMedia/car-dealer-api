const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const UserSchema = new Schema({
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    wishList: { type: Array },
    refreshToken: { type: String },
    active: { type: Boolean, default: false },
    role: { type: String },
    joined: { type: Date, default: Date.now() }
})

module.exports = mongoose.model('User', UserSchema)
