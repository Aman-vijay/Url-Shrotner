const {nanoid} = require("nanoid");
const URL = require("../models/url")

async function GenerateNewUrl(req,res) {
    try{
    const {body} = req;
    const redirectUrI = body.url
    if(!redirectUrI) return res.status(400).json({error:"url is required"})
    const existingURL = await URL.findOne({ redirectUrl: redirectUrI });
    if (existingURL) {
        return res.json({ id: existingURL.shortUrl });
    }
    const shortId = nanoid(8);
    await URL.create({
        shortUrl:shortId,
        redirectUrl:redirectUrI,
        visitHistory:[],

    });

    return res.json({id:shortId});
}
catch(err){
    return res.status(404).json({err:"Something went wrong"})
}


}

async function redirectIdtoUrl(req,res){
    try{
    const shortId = req.params.shortId;
const entry = await URL.findOneAndUpdate(
    { shortUrl: shortId },
    { $push: { visitHistory: { timestamp: Date.now() } } },
    { new: true }
);

if (!entry) {
    return res.status(404).json({ error: "URL not found" });
}
   res.redirect(entry.redirectUrl);
}
catch(err){
    res.status(404).json({err:"Something went wrong"})
}
}

async function showAnalytics(req,res){
    try{
         const shortId = req.params.shortId;
         const count = await URL.findOne({
            shortUrl:shortId,
         })

         return res.json({totalClicks:count.visitHistory.length});

    }
    catch(err){
        res.status(404).json({err:"Something went wrong"})
    }
}

module.exports = {GenerateNewUrl,redirectIdtoUrl,showAnalytics};