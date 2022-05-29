import express from "express"
import homePageController from "../Controllers/homePageController";

const Router = express.Router();

const initWebRoute = (app) => {
    Router.get("/",homePageController.getHomePage)

    //->define the root
    return app.use("/",Router);

}

module.exports = initWebRoute;