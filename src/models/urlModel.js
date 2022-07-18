const mongoose = require('mongoose');

const urlModel = new mongoose.Schema({
    urlCode: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    longUrl: {
        type: String,
        required: true,
        trim: true,
    },
    shortUrl: {
        type: String,
        required: true,
        trim: true,
    }
},{timestamps: true})

module.exports = mongoose.model('Url', urlModel); 