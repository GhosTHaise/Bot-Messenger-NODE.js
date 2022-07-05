const FB = require('fb');
require('dotenv').config();

const executeSchedule = (req,res) => {

}
const textPublication = (page_id,_message) => {
    FB.setAccessToken(process.env.FB_WEB_TOKEN);
    FB.api(
        page_id,
        'POST',
        {
            message : _message
        },
            (response)=>{
                console.log(response);
            }
        
    )
}
