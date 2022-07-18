const urlModel = require('../models/urlModel');

const createUrl = async function(req,res) {
    try {
        let urlCode = req.body; 

    } catch {
        return res.status(404).send({ status: false, message: err.message});
    }
};

module.exports.createUrl = createUrl;