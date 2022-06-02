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
        let obectKey = Object.keys(response.data[0]);
        for( categorie in response.data[0]){
            apiresult.push({
                "title":  "Categorie"+i,
                "subtitle" : "Is it what you want ?",
                "image_url" : response.data[0][categorie].thumbnail,
                "buttons" : {
                    "type" : "postback",
                    "title" : "Yes !",
                    "payload" : "yes"
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