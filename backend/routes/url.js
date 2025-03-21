const express = require("express");
const router = express.Router()
const {GenerateNewUrl,redirectIdtoUrl,showAnalytics} = require("../controllers/url")
const {verifyTokenMiddleware} = require("../utils/jwt")

router.post("/",verifyTokenMiddleware, GenerateNewUrl);

router.get("/:shortId", redirectIdtoUrl);

router.get("/analytics/:shortId", verifyTokenMiddleware, showAnalytics);

module.exports = router;