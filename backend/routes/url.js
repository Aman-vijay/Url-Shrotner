const express = require("express");
const router = express.Router()
const {GenerateNewUrl,redirectIdtoUrl,showAnalytics,getUrlsByUser} = require("../controllers/url")
const {verifyTokenMiddleware} = require("../utils/jwt")

router.post("/",verifyTokenMiddleware, GenerateNewUrl);

router.get("redirect/:shortId", redirectIdtoUrl);

router.get("/analytics/:shortId", verifyTokenMiddleware, showAnalytics);

router.get("/geturls", verifyTokenMiddleware, getUrlsByUser);

module.exports = router;