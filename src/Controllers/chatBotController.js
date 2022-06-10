require("dotenv").config();
const request = require('request');
const {scheduleSimple_request}= require("../Api/calendarApi");
const {sendPicture,type_supported} = require("../Api/WaifuApi");
const postWebhook = (req,res) => {
    // Parse the request body from the POST
  let body = req.body;

  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {

      // Gets the body of the webhook event
  let webhook_event = entry.messaging[0];
  //console.log(webhook_event);

  // Get the sender PSID
  let sender_psid = webhook_event.sender.id;
  console.log('Sender PSID: ' + sender_psid);

  // Check if the event is a message or postback and
  // pass the event to the appropriate handler function
  if (webhook_event.message) {
    handleMessage(sender_psid, webhook_event.message);        
  } else if (webhook_event.postback) {
    handlePostback(sender_psid, webhook_event.postback);
  }
    });

    // Return a '200 OK' response to all events
    res.status(200).send('EVENT_RECEIVED');

  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
}
//ajouter verification webhook
const getWebhook = (req,res) => {
    // Your verify token. Should be a random string.
  let VERIFY_TOKEN = process.env.MY_VERIFY_FB_TOKEN;
    
  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
    
  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
  
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
}

//Additional function for NLP
function firstTrait(nlp, name) {
  return nlp && nlp.entities && nlp.traits[name] && nlp.traits[name][0];
}

// Handles messages events
const handleMessage = async (sender_psid, received_message) => {
  let response;

  
  const responseText = (text) =>{
    return new Promise((resolve,reject)=>{
      callSendAPI(sender_psid,{
      "text" : text
     });
     resolve()
    });
  }
  //Greeting
  let entitiesArr = ['wit$greetings','wit$thanks','wit$bye'];
  let entityChoosen = "";
  // check greeting is here and is confident
  entitiesArr.forEach((entity)=>{
    let message_type = firstTrait(received_message.nlp, entity);
    if(message_type && message_type.confidence > 0.8){
        entityChoosen = entity;
    }
  })
  if (entityChoosen == "wit$greetings") {
   await responseText('Hi there !');
  }else if(entityChoosen == 'wit$thanks'){
   await responseText("You are welcome !")
  }else if(entityChoosen == "wit$bye"){
   await responseText("See you next time !")
  } else { 
  // default logic
  
  // Check if the message contains text
  if (received_message.text) {    
    if(received_message.text == "schedule"){
      /* responseText("envoiye de l'emploie du temps");
      responseText("veillez patienter"); */
      scheduleSimple_request(responseText)
    }
    if(received_message.text == "Man of culture"){
      quickReply(sender_psid,type_supported,"Good ! Now choose one : ")
    }
    for(let _element of type_supported){
      if(received_message.text == _element.title){
          const data = [];
          for(let subdata of _element.data){
            data.push({
            "title": subdata
          })
          }
          quickReply(sender_psid,data,"Our Available category : ");
      }
    }
    for(let _element of type_supported){
          for(let subdata of _element.data){
            console.log("send your picture : "+subdata)
            if(received_message.text == subdata){
              console.log("send your picture")
              let elements = [];
              let waifu_api_result = await sendPicture(received_message.text);
                for(let picture of waifu_api_result){
                  elements.push(elementsConstructeur(
                      "#"+picture.image_id,
                      picture.width+" x "+picture.height,
                      picture.url,
                      [
                        buttonConstructor("Send me this !","userToBot->getPicture->"+picture.file),
                        buttonConstructor("url","userToBot->getPictureUrl->"+picture.url)
                      ]
                  ))
                };
                callSendAPI(sender_psid,responseObject(elements));   
            }
              
          }
    }
    if(received_message.text == "Developer"){
     responseText("Do you know me ? I am GhosT !").then(()=>{
       setTimeout(()=>{
        responseText("See my works on : https://github.com/GhosTHaise")
       },1500);
     }) 
    }
    // Create the payload for a basic text message
    //"text": `You sent the message: "${received_message.text}". Now send me an image!`
    if(received_message.text == "sex"){
      response = {
        "attachment": {
          "type": "template",
          "payload": {
            "template_type": "media",
            "elements": [
              {
                "media_type": "image",
                "attachment_id":"583556273146252"
             }
            ]
          }
        }
      } 
    }else if(received_message.text == "love" || received_message.text == "Love"){
      response = {
        "attachment": {
          "type": "template",
          "payload": {
            "template_type": "media",
            "elements": [
              {
                "media_type": "image",
                "attachment_id":"576659263894493"
                
             }
            ]
          }
        }
      } 
    }
    
  } else if (received_message.attachments) {
  
    // Gets the URL of the message attachment
    let attachment_url = received_message.attachments[0].payload.url;
    
  } 

  
  // Sends the response message
    callSendAPI(sender_psid, response);
  } 
}

// Handles messaging_postbacks events
const handlePostback = (sender_psid, received_postback) => {
  let response;
  // Get the payload for the postback
  let payload = received_postback.payload;
  console.log(payload)
  // Set the response based on the postback payload
  if(payload.split("->").length > 0){
      let res = payload.split("->");
      if(res[1] == "getPicture"){
          send_file_2_attachementId(sender_psid,"image",res[2]);
          callSendAPI(sender_psid,{
            "text" : "Don't forget to like and share our page"
          });
      }else if(res[1] == "getPictureUrl"){
        callSendAPI(sender_psid,{
          "text" : "You can take this picture on : "+res[2]
        })
      }
  }

  if(payload == "yes" || payload == "no"){
    if (payload === 'yes') {
      response = { "text": "Thanks!" }
    } else if (payload === 'no') {
      response = { "text": "Oops, try sending another image." }
    }
    // Send the message to acknowledge the postback
    callSendAPI(sender_psid, response);
  }
}

const quickReply = (sender_psid,ArrayofValue,text) => {
  // Construct the message body
  let quick_replies_content = [];
  for(let _element of ArrayofValue){
      quick_replies_content.push({
        "content_type":"text",
        "title":_element.title,
        "payload":_element.title,
      })
  }
  console.log(quick_replies_content)
    let request_body = {
      recipient: {
        id: sender_psid
      },
      messaging_type: "RESPONSE",
      message: {
        "text": text,
        "quick_replies":quick_replies_content
      }
    }
    // Send the HTTP request to the Messenger Platform
    request({
      uri: "https://graph.facebook.com/v14.0/me/messages",
      qs: { "access_token": process.env.FB_WEB_TOKEN},
      method: "POST",
      json: request_body
    }, (err, res, body) => {
      if (!err) {
        console.log('Quick message sent!');
        /* console.log(response);
        console.log(res) */
      } else {
        console.error("Quick Unable to send message:" + err);
      }
    }); 
  }

// Sends response messages via the Send API
function callSendAPI(sender_psid, response,messagingtype) {
  // Construct the message body
  let request_body = {
    recipient: {
      id: sender_psid
    },
    message: response
  }
  // Send the HTTP request to the Messenger Platform
  request({
    uri: "https://graph.facebook.com/v14.0/me/messages",
    qs: { "access_token": process.env.FB_WEB_TOKEN},
    method: "POST",
    json: request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!');
      /* console.log(response);
      console.log(res) */
    } else {
      console.error("Unable to send message:" + err);
    }
  }); 
}
/**retourner du text :
 * utiliser cette fonction si vous souhaiter retourner du text
 * 
 * **/
//TransferFile to attachment_id
const send_file_2_attachementId = (_sender_psid,_type,_url) => {
    let request_body = {
      "recipient":{
        "id": _sender_psid
      },
      "message":{
        "attachment":{
          "type": _type, 
          "payload":{
            "url" : _url,
            "is_reusable" : true
          }
        }
      }
    }
    request({
      uri : "https://graph.facebook.com/v14.0/me/messages",
      qs: { "access_token": process.env.FB_WEB_TOKEN},
      method: "POST",
      json: request_body
    },(err,res,body)=>{
      if(!err){
        console.log(res.attachment_id)
         console.log(body)
         send_media_file(_sender_psid,_type,res.attachment_id)
      }else{
        console.log("Sorry,we are unable to send this picture")
      }
    })
}
//envoyer un fichier de type media
const send_media_file = (_sender_psid,_type,_attachment_id) =>{
  const send_media_request = {"attachment":{
    "type":_type, 
    "payload": _attachment_id
  }}
  callSendAPI(_sender_psid,send_media_request);
}
//Build generic template
const buttonConstructor = (_title,_payload) => {
  return {
    "type": "postback",
    "title": _title,
    "payload": _payload,
  }
}
const elementsConstructeur = (_title,_subtitle,_url,_Button) => {
  return {
    "title": _title,
    "subtitle": _subtitle,
    "image_url": _url,
    "buttons": _Button,
  }
}
const responseObject = (_element) => {
  return {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "image_aspect_ratio" : "square",
          "elements": _element
        }
      }
    }
}
module.exports = {
    postWebhook : postWebhook,
    getWebhook : getWebhook
}
