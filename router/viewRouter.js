const express = require("express"); // Requiring express module 
const viewRouter = express.Router(); // Creating a router or mini app for handling views

const {
    getHomePage,
    getBasePage,
    getPlansPage,
    getSigninPage,
    getResetPasswordPage
} = require("../controller/viewController");

const {
    isUserLoggedIn,
    protectRoute
} = require("../controller/authController");

viewRouter.use(isUserLoggedIn);

viewRouter.get("/",getHomePage);
viewRouter.get("/base",getBasePage);
viewRouter.get("/plans",getPlansPage);
viewRouter.get("/signin",getSigninPage);
viewRouter.get("/resetpassword/:token",getResetPasswordPage);

module.exports = viewRouter;