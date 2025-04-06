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
      type: String,
      required: true
    },
    shortUrl: {
      type: String,
      required: true,
      unique: true 
    },
    redirectUrl: {
      type: String,
      required: true
     
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    customUrl: {
      type: String,
      sparse: true,
      default: undefined
    },
    qr: {
      type: String,
      sparse: true,
      default: undefined
    }
  }, { timestamps: true });
  
  // ✅ Unique per user
  UrlSchema.index({ userId: 1, customUrl: 1 }, { unique: true, sparse: true });
  UrlSchema.index({ userId: 1, qr: 1 }, { unique: true, sparse: true });
  

  
const URL = mongoose.model("url",UrlSchema)
const Analytics = mongoose.model("analytics",AnalyticsSchema)

module.exports = {URL, Analytics}
