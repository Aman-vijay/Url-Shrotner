const mongoose = require("mongoose");

const AnalyticsSchema = new mongoose.Schema({
    urlId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"url",
        required:true
    },
    clicks: [
        {
            Timestamp:{
                type:Number,
                default: () => Date.now(),

            },
            ip:{
                type:String,
                default: null
            },
            userAgent:{
                type:String,
                default:null
            },
            city:{
                type:String,
                default:null
            },
            country:{
                type:String,
                default:null
            },
            deviceType: { type: String, default: null },
            latitude: { type: Number, default: null },
            longitude: { type: Number, default: null }

        }
    ]

},{timestamps:true})

const UrlSchema = new mongoose.Schema({
    title: {
        type:String,
        required:true
    },
    
    shortUrl : {
        type:String,
        required:true,
        unique:true    
    },
    redirectUrl : {
        type:String,
        required:true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    
    customUrl : {
        type:String,
        unique:true,
        sparse:true,
    },
    qr:{
        type:String,
        unique:true,
        sparse: true
    }
},{timestamps:true})

const URL = mongoose.model("url",UrlSchema)
const Analytics = mongoose.model("analytics",AnalyticsSchema)

module.exports = {URL, Analytics}
