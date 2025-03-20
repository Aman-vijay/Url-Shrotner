const express = require("express");
const router = express.Router()
const {GenerateNewUrl,redirectIdtoUrl,showAnalytics} = require("../controllers/url")

router.post("/",GenerateNewUrl);

router.get("/:shortId", redirectIdtoUrl);

router.get("/analytics/:shortId", showAnalytics);

module.exports = router;