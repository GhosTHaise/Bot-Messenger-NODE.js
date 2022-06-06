const express  = require("express")
const viewEngineConfig = (app) => {
    app.use(express.static("./src/public"));
    app.set("view engine","ejs");
    app.set("views","./src/Views");
}

module.exports = viewEngineConfig;