/* import {createRequire} from "module"
const require = createRequire(import.meta.url) */
const axios = require('axios');
const { response } = require('express');
const type_supported = [ 
    {
        "title" : "normal",
        "data" : [
            "uniform",
            "maid",
            "waifu",
            "marin-kitagawa",
            "mori-calliope",
            "raiden-shogun",
            "oppai",
            "selfies"
        ]
    },
    {
        "title" : "culture",
        "data" : [
            "ass",
            "hentai",
            "milf",
            "oral",
            "paizuri",
            "ecchi",
            "ero"
        ]
    }
]

const sendPicture = async(type,call) => {
    let pictureList;
    const options = {
        method: 'GET',
        url: `https://api.waifu.im/random/?selected_tags=${type}&many=true`,
      };
    const fetchResult = await axios.request(options)
    //pictureList = fetchResult.images.slice(0,10);
    console.log("hello");
    console.log(fetchResult.data.images.slice(0,10));
}

module.exports = {
    sendPicture,
    type_supported
}
