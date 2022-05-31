import express from "express"
import homePageController from "../Controllers/homePageController";
import chatBotController from "../Controllers/chatBotController";
const Router = express.Router();

const initWebRoute = (app) => {
    Router.get("/",homePageController.getHomePage);
    Router.get("/webhook",chatBotController.getWebhook);
    Router.post("/webhook",chatBotController.postWebhook); 
    //->define the root
    return app.use("/",Router);

}

module.exports = initWebRoute;