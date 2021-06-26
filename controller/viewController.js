const planModel = require("../model/planModel"); // Requiring plan model

function getHomePage(req,res){ // Function for rendering the home page 
    const name = req.userName; // Extarcts the name, id and role from the request
    const id = req.id;
    const role = req.role;
    console.log(name + " " + id);
    res.render("home.pug",{ // Will render the template stored in home.pug
        title: "Home", // Sends the details recieved to the templating engine
        name,
        id,
        role
    });
}

function getBasePage(req,res){ // Function for getting base page
    res.render("base.pug",{ // Renders the base page
        title: "Base",
    });
}
async function getPlansPage(req,res){ // Function to display all the plans
    const plans = await planModel.find(); // Retrieves all plans from the DB 
    const name = req.userName; // Extracts name, id and role from the request
    const id = req.id;
    const role = req.role;
    res.render("plans.pug",{ // Renders the plans page and sends the plans retrieved from DB to the template
        title: "Plans",
        plans,
        name,
        id,
        role

    });
}
function getSigninPage(req,res){ // Function to display the signin page
    const name = req.userName; // Extracts the details from the request
    const id = req.id;
    const role = req.role;
    res.render("signin.pug",{ // Renders the signin page
        title: "Sign in",
        name,
        id,
        role
    });
}

function getResetPasswordPage(req,res){ // Function to display the reset password page
    res.render("resetpassword.pug",{
        title: "Reset Password"
    });
}

module.exports.getHomePage = getHomePage;
module.exports.getBasePage = getBasePage;
module.exports.getPlansPage = getPlansPage;
module.exports.getSigninPage = getSigninPage;
module.exports.getResetPasswordPage = getResetPasswordPage;