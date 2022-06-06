require("dotenv").config();
import express from "express";
import viewEngineConfig from "./config/viewEngine";
import initWebRoute from "./Routes/web.js";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 8000;
//Moteur de template
viewEngineConfig(app);
//
//Body-Parser used to post data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
//
//Mes routes
initWebRoute(app);

//Ecouter au port
app.listen(PORT,()=>{
    console.log(`Your app is ready on  http://localhost:${PORT}`);
})