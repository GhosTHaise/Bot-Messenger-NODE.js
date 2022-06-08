import {createRequire} from "module"
const require = createRequire(import.meta.url)
const axios = require('axios');
const { response } = require('express');
const type_supported = { 
    "normal" : [
        "uniform",
        "maid",
        "waifu",
        "marin-kitagawa",
        "mori-calliope",
        "raiden-shogun",
        "oppai",
        "selfies"
    ],
    "culture" : [
        "ass",
        "hentai",
        "milf",
        "oral",
        "paizuri",
        "ecchi",
        "ero"
    ]
}

const sendPicture = (type) => {
    const options = {
        method: 'GET',
        url: `https://api.waifu.im/random/?selected_tags=${type}&many=true`,
      };
    axios.request(options).then((result)=>{
        //traitement des donnees
        console.log(result.data)
    })
}
sendPicture("oppai")

module.exports = {
    sendPicture,
    type_supported 
}