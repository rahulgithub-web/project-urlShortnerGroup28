const express = require("express");
const router = express.Router();
const { createUrl, getUrl } = require("../controller/urlController");

router.post("/url/shorten", createUrl);

router.get("/:urlCode", getUrl);

router.all("/*", async function (req, res) {
  res.status(404).send({ status: false, msg: "Page Not Found!!!" });
});

module.exports = router;
