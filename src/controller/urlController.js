const urlModel = require("../models/urlModel");
const shortid = require("shortid");
const validUrl = require("valid-url");

// ===========> Create Url <=================
const createUrl = async function (req, res) {
  try {
    let data = req.body;
    let { longUrl } = data;

    if (Object.keys(data).length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "All fields are mendatory" });
    }
    if (!longUrl) {
      return res
        .status(400)
        .send({ status: false, message: "longUrl must be present" });
    }
    if(!validUrl(longUrl)) {
        return res.status(400).send({status: false, message: "Provide a valid url"})
    }

    let baseUrl = "http://localhost:3000/";
    let urlCode = shortid.generate();
    console.log(urlCode);
    let shortUrl = baseUrl + "/" + urlCode;

    url = new urlModel({
      longUrl,
      shortUrl,
      urlCode,
    });

    let savedUrl = await urlModel.create(url);

    let finalUrl = await urlModel.findOne({_id: savedUrl._id}).select({__v:0, createdAt: 0, updatedAt:0, _id: 0});

    if(finalUrl) {
        return res.status(400).send({status: false, message: "short Url already created"});
    }
    return res
      .status(201)
      .send({
        status: true,
        message: "shortUrl has been created successfully",
        data: finalUrl,
      });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports.createUrl = createUrl;
