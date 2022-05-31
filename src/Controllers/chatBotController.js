require("dotenv").config();
const request = require('request');
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

// Handles messages events
const handleMessage = (sender_psid, received_message) => {
  let response;

  // Check if the message contains text
  if (received_message.text) {    

    // Create the payload for a basic text message
    response = {
      "text": `You sent the message: "${received_message.text}". Now send me an image!`
    }
  }  
  
  // Sends the response message
  callSendAPI(sender_psid, response);
}

// Handles messaging_postbacks events
const handlePostback = (sender_psid, received_postback) => {

}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }
  // Send the HTTP request to the Messenger Platform
  request({
    "url": "https://graph.facebook.com/v6.0/me/messages",
    "qs": { "access_token": "EAAHZAi22jRqwBAG7bxviym6HbJNzQ4398vcKKB6OXZBzZALMHI74Wd6DIs4JTgCudXSAsxcoHjwkOFzuXQLHgsEqgZCsOZB98hZC5cQZB4wVjSxbgSPIFEFpaiV9eqoJXLmmmwKm0hbcDlzPSEQ16qdlZCRsDaJfVqz1ZBXr5XpqCJ3tXj6TG7B51"},
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!');
      console.log(response);
    } else {
      console.error("Unable to send message:" + err);
    }
  }); 
}

module.exports = {
    postWebhook : postWebhook,
    getWebhook : getWebhook
}