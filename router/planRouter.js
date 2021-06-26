const express = require("express");
const planRouter = express.Router();

const {
    getAllPlans,
    createPlan,
    getPlan,
    updatePlan,
    deletePlan
} = require("../controller/planController");

const {
    protectRoute,
    isAuthorized,
    isUserLoggedIn
} = require("../controller/authController");

planRouter.use(isUserLoggedIn);
planRouter.use(protectRoute);
// planRouter.use(isAuthorized(["admin"]));

planRouter
    .route("")
    .get(getAllPlans)
    .post(createPlan);

planRouter
    .route("/:id")
    .get(getPlan)
    .patch(updatePlan)
    .delete(deletePlan);


module.exports = planRouter;