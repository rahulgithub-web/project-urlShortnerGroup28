const urlModel = require("../models/urlModel");
const shortid = require("shortid");
const redis = require("redis");

const { promisify } = require("util");

// =========> Connect to Redis <============
const redisClient = redis.createClient(
  11230,
  "redis-11230.c264.ap-south-1-1.ec2.cloud.redislabs.com",
  { no_ready_check: true }
);
redisClient.auth(
  "6NR1xH1btGGwgh2Zq8b0FLyRpLF979Op",
  function (err) {
    if (err) throw err;
  }
);

redisClient.on("connect", async function () {
  console.log("Connected to Redis...");
});

// 1.connect to server 
// 2. use the commands 

// Connection setup for Redis  

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient); 
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

// ===========> Create Short Url <=================
const createUrl = async function (req, res) {
  try {
    let data = req.body;
    let { longUrl } = data;

    if (Object.keys(data).length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "All fields are mandatory" });
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

    let checkUrl = await urlModel.findOne({ longUrl }).select({longUrl:1,shortUrl:1,urlCode:1});

    if (checkUrl) {
      return res
        .status(200)
        .send({ status: false, message: "Url already shorted", data: checkUrl });
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

      await SET_ASYNC(`${longUrl}`, JSON.stringify(finalUrl));
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
    let urlCode = req.params.urlCode;

    let cachedUrl = await GET_ASYNC(`$(urlCode)`);

    if (!urlCode) {
      return res
        .status(400)
        .send({ status: false, message: "urlCode must be present" });
    }
    if(cachedUrl) {
      return res.status(302).redirect(cachedUrl);
    } 
    let getUrl = await urlModel.findOne({ urlCode: urlCode });

    if (getUrl) {
      return res.status(302).redirect(getUrl.longUrl);
    } else {
      await SET_ASYNC(`${cachedUrl}`, JSON.stringify(getUrl));
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
