const urlModel = require("../models/urlModel");
const shortid = require("shortid");

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
    const regex =
      /^([hH][tT][tT][pP]([sS])?:\/\/.)(www\.)?[-a-zA-Z0-9@:%.\+#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%\+.#?&//=_]*$)/g;
    if (typeof longUrl !== "string" || !regex.test(longUrl.trim()))
      return res
        .status(400)
        .send({ status: false, message: "Please provide valid Url" });

    let checkUrl = await urlModel.find({ longUrl });
    if (checkUrl.length != 0) {
      return res
        .status(400)
        .send({ status: false, message: "Url already shorted" });
    }

    let baseUrl = "http://localhost:3000";
    let urlCode = shortid.generate();
    let shortUrl = baseUrl + "/" + urlCode;

    url = new urlModel({
      longUrl,
      shortUrl,
      urlCode,
    });

    let savedUrl = await urlModel.create(url);

    let finalUrl = await urlModel
      .findOne({ _id: savedUrl._id })
      .select({ __v: 0, createdAt: 0, updatedAt: 0, _id: 0 });

    return res.status(201).send({
      status: true,
      message: "shortUrl has been created successfully",
      data: finalUrl,
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

// ============> Get Url Api <====================
const getUrl = async function (req, res) {
  try {
    let shortUrl = req.params.urlCode;

    if (!shortUrl) {
      return res
        .status(400)
        .send({ status: false, message: "urlCoder must be present" });
    }
    let getUrl = await urlModel.findOne({ urlCode: shortUrl });
    // console.log(getUrl);
    if (getUrl) {
      return res.status(302).redirect(getUrl.longUrl);
    } else {
      return res
        .status(400)
        .send({ status: false, message: "Invalid urlCode" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports.createUrl = createUrl;
module.exports.getUrl = getUrl;
