const axios = require("axios");
//Manga walpaper
/* const options = {
  method: 'GET',
  url: 'https://best-manga-anime-wallpapers.p.rapidapi.com/',
  headers: {
    'X-RapidAPI-Host': 'best-manga-anime-wallpapers.p.rapidapi.com',
    'X-RapidAPI-Key': 'b10adcce97msh9638a9ae812c8aep106842jsn5c5e7b510b95'
  }
}; */
//Mange scan info
let ApiData = [];
const options = {
    method: 'GET',
    url: 'https://manga11.p.rapidapi.com/news',
    headers: {
      'X-RapidAPI-Host': 'manga11.p.rapidapi.com',
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
for(let i=0;i<5;i++){
    ApiData.push(
        {
            "title": axiosResponse[i].title,
            "subtitle": "Tap a button to answer.",
            "image_url" : axiosResponse[i].url,
            
          }
    )
}
let apiResult = ApiData;
return apiResult;
}
module.exports = {
    walpaperInformation : getDatafromApi
}