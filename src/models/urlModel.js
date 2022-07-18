const mongoose = require('mongoose');

const urlModel = new mongoose.Schema({
    longUrl: {
        type: String,
        required: true,
        trim: true,
    },
    shortUrl: {
        type: String,
        required: true,
        trim: true,
    },
    urlCode: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowerCase: true,
    },
},{timestamps: true})

module.exports = mongoose.model('Url', urlModel); 