const {nanoid} = require("nanoid");
const {URL,Analytics} = require("../models/url")
const geoip = require("geoip-lite")

async function getGeoData(ip) {
    const geo = geoip.lookup(ip);
    return {
        city: geo?.city || null,
        country: geo?.country || null
    };
}


async function GenerateNewUrl(req, res) {
    try {
        const { body, userId } = req;
        
        // Check if userId exists
        if(!userId) return res.status(400).json({ error: "userId is required" });
        
        // Check if body exists and contains URL
        if(!body || !body.url) return res.status(400).json({ error: "URL is required" });
        
        const redirectUrl = body.url.trim();
        
        // // Validate URL format
        // try {
        //     new URL(redirectUrl);
        // } catch (error) { 
        //     return res.status(400).json({ error: "Invalid URL format" });
        // }
        
        // Check if URL already exists for this user
        const existingURL = await URL.findOne({ 
            redirectUrl: redirectUrl,
            userId: userId
        });
        
        if (existingURL) {
            return res.json({ id: existingURL.shortUrl });
        }
        
        // Generate a shortId or use customUrl if provided
        const shortId = body.customUrl?.trim() || nanoid(8);
        
        // Check if the custom URL is already taken
        if (body.customUrl) {
            const customUrlExists = await URL.findOne({ shortUrl: shortId });
            if (customUrlExists) {
                return res.status(409).json({ error: "Custom URL already in use" });
            }
        }
        
        // Create new URL record
       const newUrl= await URL.create({
            userId,
            shortUrl: shortId,
            title: body.title?.trim() || "Default Title",
            redirectUrl,
            customUrl: body.customUrl?.trim(),
            qr: body.qr,
        });

        // Create analytics record
        await Analytics.create({
            urlId:newUrl._id,
        })

        return res.status(201).json({ id: shortId });
    } catch (err) {
        console.error("URL generation error:", err);
        return res.status(500).json({ error: "Something went wrong" });
    }
}

async function redirectIdtoUrl(req, res) {
    try {
        const shortId = req.params.shortId;
        if (!shortId || typeof shortId !== 'string') {
            return res.status(400).json({ error: "Invalid short URL identifier" });
        }

        const entry = await URL.findOne({ shortUrl: shortId });
        if (!entry) {
            return res.status(404).json({ error: "Short URL not found2" });
        }
        const ip = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
        let { city, country } = getGeoData(ip);

        //In case of frontend 
        if (req.body.latitude && req.body.longitude) {
            city = req.body.city || city;
            country = req.body.country || country;
        }

        const userAgent = req.headers["user-agent"] || "";
        const deviceType = userAgent.includes("Mobile") ? "Mobile" : "Desktop";
       

        // Update Analytics
        await Analytics.findOneAndUpdate(
            { urlId: entry._id },
            {
                $push: {
                    clicks: {
                        Timestamp: Date.now(),
                        ip,
                        userAgent,
                        city,
                        country,
                        deviceType,
                        latitude: req.body.latitude || null,
                        longitude: req.body.longitude || null
                    }
                }
            },
            { new: true, upsert: true }
        );


        return res.redirect(entry.redirectUrl);
    } catch (err) {
        console.error("Redirect error:", err);
        return res.status(500).json({ error: "Something went wrong while redirecting" });
    }
}

async function showAnalytics(req, res) {
    try {
        const shortId = req.params.shortId;
        if (!shortId || typeof shortId !== 'string') {
            return res.status(400).json({ error: "Invalid short URL identifier" });
        }

        const entry = await URL.findOne({ shortUrl: shortId });
        if (!entry) {
            return res.status(404).json({ error: "Short URL not found1" });
        }

        const analyticsData = await Analytics.findOne({ urlId: entry._id });
        if (!analyticsData) {
            return res.json({ message: "No analytics data available for this URL." });
        }

        const analytics = {
            totalClicks: analyticsData.clicks.length,
            url: entry.redirectUrl,
            shortUrl: entry.shortUrl,
            createdAt: entry.createdAt,
            lastClickedAt: analyticsData.clicks.length > 0 
                ? new Date(analyticsData.clicks[analyticsData.clicks.length - 1].Timestamp) 
                : null,
            clicksPerDay: {}
        };

        // Aggregate clicks per day
        analyticsData.clicks.forEach(visit => {
            const date = new Date(visit.Timestamp).toISOString().split('T')[0];
            analytics.clicksPerDay[date] = (analytics.clicksPerDay[date] || 0) + 1;
        });

        return res.json(analytics);
    } catch (err) {
        console.error("Analytics error:", err);
        return res.status(500).json({ error: "Something went wrong while fetching analytics" });
    }
}

//Get url created by user
const getUrlsByUser = async (req, res) => {
    const userId = req.userId;
    
    if (!userId) {
        return res.status(400).json({ error: "userId is required" });
    }

    try {
   
        const urls = await URL.find({ userId: userId }).sort({ createdAt: -1 });
        
        if (!urls || urls.length === 0) {
            return res.status(404).json({ message: "No URLs found for this user" });
        }
        
        return res.json(urls);
    }
    catch(err) {

        return res.status(500).json({ error: "Something went wrong while fetching URLs" });
    }
}

//Delete URL by user
const deleteUrlByUser = async (req, res) => {
    const userId = req.userId;
    const urlId = req.params.urlId;
    
    if (!userId) {
        return res.status(400).json({ error: "userId is required" });
    }

    try {
        const url = await URL.findOneAndDelete({ _id: urlId, userId: userId });
        
        if (!url) {
            return res.status(404).json({ message: "URL not found or not authorized to delete" });
        }
        
       
        try {
            await Analytics.findOneAndDelete({ urlId: urlId });
        } catch (analyticsErr) {
            console.log("No analytics found or error deleting analytics:", analyticsErr);
        }
        
       
        
        return res.json({ message: "URL deleted successfully" });
    }
    catch(err) {
        return res.status(500).json({ error: "Something went wrong while deleting URL" });
    }
}

module.exports = {GenerateNewUrl,redirectIdtoUrl,showAnalytics,getUrlsByUser,deleteUrlByUser};