const axios = require("axios");
const options = {
  method: 'GET',
  url: 'https://best-manga-anime-wallpapers.p.rapidapi.com/',
  headers: {
    'X-RapidAPI-Host': 'best-manga-anime-wallpapers.p.rapidapi.com',
    'X-RapidAPI-Key': 'b10adcce97msh9638a9ae812c8aep106842jsn5c5e7b510b95'
  }
};
let axiosResponse;
const getDatafromApi = (message) => {
axios.request(options).then(function (response) {
	axiosResponse = response.data;
}).catch(function (error) {
	console.error(error);
});
for(let categorie in axiosResponse[0]){
    console.log(categorie);
    console.log(axiosResponse[0])
}
let apiResult = [{
    "title": message,
    "subtitle": "Tap a button to answer.",
    "image_url" : "https://wallpapercave.com/wpt/qXrvHA3.jpg",
    "buttons": [
      {
        "type": "postback",
        "title": "Yes!",
        "payload": "yes",
      },
      {
        "type": "postback",
        "title": "No!",
        "payload": "no",
      }
    ],
  }]
return apiResult;
}
module.exports = {
    walpaperInformation : getDatafromApi
}