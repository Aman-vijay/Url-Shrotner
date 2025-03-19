const express = require("express");
const router = express.Router()
const {GenerateNewUrl} = require("../controllers/url")

router.post("/",GenerateNewUrl);

module.exports = router;