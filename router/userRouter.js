const express = require("express");
const userRouter = express.Router();

const { 

    getProfile,
    updateProfile,
    deleteProfile,
    getAllProfiles

} = require("../controller/userController.js");

const {
    signup,
    login,
    protectRoute,
    isAuthorized,
    isUserLoggedIn,
    signout,
    forgotPassword,
    resetPassword
    
} = require("../controller/authController");

userRouter.use(isUserLoggedIn);

userRouter.post("/signup",signup);
userRouter.post("/login",login);
userRouter.get("/signout",signout);
userRouter.patch("/forgotpassword",forgotPassword);
userRouter.patch("/resetpassword/:token",resetPassword);


// userRouter.get("/allusers",protectRoute,isAuthorized(["admin"]),getAllProfiles);

userRouter.use(protectRoute);

userRouter
    .route("/profile/")
    .get(getProfile)
    .patch(updateProfile)
    .delete(deleteProfile);

module.exports = userRouter;