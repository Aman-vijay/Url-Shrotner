const express = require("express");
const router = express.Router()
const {GenerateNewUrl,redirectIdtoUrl,showAnalytics,getUrlsByUser,deleteUrlByUser} = require("../controllers/url")
const {verifyTokenMiddleware} = require("../utils/jwt")

router.post("/",verifyTokenMiddleware, GenerateNewUrl);

router.get("/:shortId", redirectIdtoUrl);

router.get("/analytics/:shortId", verifyTokenMiddleware, showAnalytics);

router.get("/api/geturls", verifyTokenMiddleware, getUrlsByUser);

router.delete("/api/deleteurl/:urlId", verifyTokenMiddleware, deleteUrlByUser);

module.exports = router;