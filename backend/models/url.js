const mongoose = require("mongoose");

const UrlSchema = new mongoose.Schema({
    shortUrl : {
        type:String,
        required:true,
        unique:true    
    },
    redirectUrl : {
        type:String,
        required:true
    },
    userId :{
        type:String,
        required:true,
        unique:true
    },
    customUrl : {
        type:String,
        unique:true
    },
    qr:{
        type:String,
        unique:true
    },
    visitHistory:[
        {
            Timestamp:{type:Number}
        }
    ]
},{timestamps:true})

const URL = mongoose.model("url",UrlSchema)

module.exports = URL
