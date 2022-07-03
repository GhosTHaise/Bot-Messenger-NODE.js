const request = require("request");
require('dotenv').config();

const setupGetStartedButton = (req,res) => {
    const messageData = {
        "get_started" : [
            {
                "payload" : "START_BUTTON"
            }
        ]
    }
    request({
        uri: "https://graph.facebook.com/v14.0/me/messages",
        qs: { "access_token": process.env.FB_WEB_TOKEN},
        method: "POST",
        json : messageData
    },(err,res,body)=>{
        if(!err){
            console.log("Get started : ");
        }else{
            console.log("Get started error : "+err);
        }
    });    
}
module.exports = setupGetStartedButton;