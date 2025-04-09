const express = require("express");
const router = express.Router()
const {GenerateNewUrl,showAnalytics,getUrlsByUser,deleteUrlByUser,getUrlsById} = require("../controllers/url")
const {verifyTokenMiddleware} = require("../utils/jwt")

router.post("/createNewUrl",verifyTokenMiddleware, GenerateNewUrl);


router.get("/analytics/:shortId", verifyTokenMiddleware, showAnalytics);
router.get("/url/:shortId", verifyTokenMiddleware, getUrlsById);

router.get("/geturls", verifyTokenMiddleware, getUrlsByUser);

router.delete("/deleteurl/:urlId", verifyTokenMiddleware, deleteUrlByUser);

module.exports = router;