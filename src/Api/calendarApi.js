const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const scheduleSimple_request = (callback) => {
    const credentials = {
        "installed":{"client_id":"979034939858-h3fl2v5adjga0leq8jv50jo21nm25pkf.apps.googleusercontent.com","project_id":"direct-obelisk-352606","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"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","redirect_uris":["http://localhost:8080"]}
    }
    const token = {
        "access_token":"ya29.a0ARrdaM_DjFm6BAQqFnLSmxUuVZAAnxwZExZzKlrvRO6aZckaU2s1STRVQ3F_h9-0tztnUr8nQtzrFtCXNOjcpplioE9sYaH0UHK60HM3taZOGjhmeRFYsgBbcLtzQiWqhyqRKC4xleEeaAzJn0h9QXbn38GJ","refresh_token":"1//03LeZOgJ5oXPyCgYIARAAGAMSNwF-L9IrHGc4ipitFuaGpzdxbnDkmUcgiWbexBk23_68qQmUD3XZUKMX47fQuwAVwOTyk3sVH6k","scope":"https://www.googleapis.com/auth/calendar.readonly","token_type":"Bearer","expiry_date":1686132372}
    try{
        const {client_secret, client_id, redirect_uris} = credentials.installed;
    const auth = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);
      auth.setCredentials(JSON.parse(token));
      //Main code
      const calendar = google.calendar({version: 'v3', auth});
      callback("event en cours ...")
    calendar.events.list({
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const events = res.data.items;
        if (events.length) {
        console.log('Upcoming 10 events:');
        events.map((event, i) => {
            const start = event.start.dateTime || event.start.date;
            console.log(event)
            console.log(`${start} - ${event.summary}`);
            
        });
        callback("send your schedule")
        } else {
        callback("No up comming event")
        console.log('No upcoming events found.');
        }
    });
    }catch(err){
        callback("unable to get your schedule !")
    }
}
const schedule = (callback) => {
    // If modifying these scopes, delete token.json.
callback("je vai vous envoyer l'emploie du temps")
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

    fs.readFile('client_secret.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Calendar API.
  authorize(JSON.parse(content), listEvents);
});
// Load client secrets from a local file.


/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listEvents(auth) {
  const calendar = google.calendar({version: 'v3', auth});
  callback("event en cours ...")
  calendar.events.list({
    calendarId: 'primary',
    timeMin: (new Date()).toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const events = res.data.items;
    if (events.length) {
      console.log('Upcoming 10 events:');
      events.map((event, i) => {
        const start = event.start.dateTime || event.start.date;
        console.log(event)
        console.log(`${start} - ${event.summary}`);
        
      });
      callback("send your schedule")
    } else {
        callback("No up comming event")
      console.log('No upcoming events found.');
    }
  });
}
}
module.exports = {
    scheduleSimple_request
}