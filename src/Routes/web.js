import express from "express"
const Router = express.Router();

const initWebRoute = (app) => {
    Router.get("/",(req,res)=>{
        res.send("Hello world !");
    })
    return app.use("/",Router);

}

module.exports = initWebRoute;