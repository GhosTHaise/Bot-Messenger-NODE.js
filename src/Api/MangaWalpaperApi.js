const axios = require("axios");
const options = {
  method: 'GET',
  url: 'https://best-manga-anime-wallpapers.p.rapidapi.com/',
  headers: {
    'X-RapidAPI-Host': 'best-manga-anime-wallpapers.p.rapidapi.com',
    'X-RapidAPI-Key': 'b10adcce97msh9638a9ae812c8aep106842jsn5c5e7b510b95'
  }
};
const getDatafromApi = () => {
    let apiresult = [];
    let i = 0;
    axios.request(options).then(function (response) {
        for(let categorie of response.data[0]){
            apiresult.push({
                "title":  Object.keys(response.data[0])[i],
                "subtitle" : "Is it what you want ?",
                "image_url" : response.data[0][0].thumbnail,
                "buttons" : {
                    "type" : "postback",
                    "title" : "Yes !",
                    "payload" : Object.keys(response.data[0])[i]
                }
            })
            i++;
        };
    }).catch(function (error) {
        console.error(error);
    });
    return apiresult;

}
module.exports = {
    walpaperInformation : getDatafromApi
}