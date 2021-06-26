const userModel = require("../model/userModel"); // Requiring user model for use
const secrets = require("../config/secrets"); // Requiring secrets file which stores confidential data

const emailHelper = require("../utility/email"); //Requires the emailing facility for forgot password

const jwt = require("jsonwebtoken"); // Requires JWT package installed with NPM

async function signup(req,res){ // POST request on users for signup
    try{
        let user = req.body; // Extracting user
        let createdUser = await userModel.create(user); // Creating a new user in the user DB and returning a promise which is waited to be fulfilled
        res.status(201).json({
            status: "Success",
        });

    }catch(err){ // Throws an error if unable to create user
        console.log(err.message);
        res.status(200).json({
            status:"Error Occurred",
            error : err.message
        });
    }
}

async function login(req,res){ // POST request on users for logging into account
    try{
        if(req.body.email && req.body.password){ // If both email and password are availible in the req's body
            const user = await userModel.findOne({email: req.body.email,
            password: req.body.password}).select("+password"); // Finds the matching user document having given email and password
            if(user){
                const id = user["_id"]; // Extracts the id of the user
                const token = jwt.sign({id},secrets.JWT_SECRET); // Creating token with id as payload. We will retrieve the payload(id) when the client sends a request and serve the request accordingly
                res.cookie("jwt", token, { httpOnly: true }); // adds the jwt token into the cookies of the client
                res.status(200).json({
                    status: "User Logged In",
                    user,
                });
            }else{
                throw new Error("Incorrect Email or Password");
            }
        }else{
            throw new Error("Invalid Input");
        }
    }catch(err){
        console.log(err.message);
        return res.status(200).json({
            status: "Error Occurred",
            err
        });
    }
}

async function protectRoute(req,res,next){ // Function used for user authorization on a particular route. It will check on the basis of the
                                           //  id and the role if the paricular route should be made accessible or not ?
    try{
        let token;
        if(req.cookies.jwt){
            token = req.cookies.jwt; // Extract the token from the cookies sent along with the request
        }
        if(token){
            const payload = jwt.verify(token,secrets.JWT_SECRET); // This will verify the JSON web token recieved and we will use the id extracted from payload for serving the request
            if(payload){
                const user = await userModel.findById(payload.id); // Find the user in the database with retrieved id
                req.id = payload.id; 
                req.role = user.role; // Add the role and id  and name of the user to the request to be used by other functions
                req.userName = user.name;
                next(); // Move on to the next middleware
            }else{
                throw new Error("Session Expired");
            }

        }else{
            throw new Error("Please Login First");
        }
    }catch(err){
        console.log(err.message);
        res.status(200).json({
            status: "Error Occurred",
            err
        });
    }
}

async function isAuthorized(roles){
    return function(req,res,next){ // Will authorise if the role in the request match the roles which should access this route
        if(roles.includes(req.role)){
            next(); // Move to the next middleware or controller function
        }else{
            res.status.json({
                status: "User Not Authorized",
            });
        }
    }
}

async function isUserLoggedIn(req, res, next) { // Function to check if the user is already logged in. If logged in it adds the id, role, username of the user to the request
    try {
        let token;
        if(req.cookies.jwt){
            token = req.cookies.jwt; // Extracting the token from the cookies
        }
        if(token){
            const payload = jwt.verify(token, secrets.JWT_SECRET); // Verifying the token. The payload gives the id of the user
            if (payload) {
                const user = await userModel.findById(payload.id); // Find the user in the db using the id and extract the name, role etc. of the user
                req.role = user.role;
                req.id = payload.id;
                req.userName = user.name; // Adding the details of the user into the request
                next(); // Calling the next middleware
            }else {
                next(); // Calling the next middleware
            }
        }else {
            next();
        }
    }catch(err){
        next(); // Even if the user is not logged in, we move to the next middleware
    }
}

function signout(req,res){ // function which signs out a particular user
    res.cookie("jwt","wrongtoken",{httpOnly: true}); // We set the jwt in the cookies to a wrong value 
    res.status(200).json({
        status: "Success",
    });    
}

async function forgotPassword(req,res){ // Function for managing forgot password option
    console.log("in protect route");
    let {email} = req.body; // Extracts email from req's body
    try{
        const user = await userModel.findOne({email: email}); // Finds the user from the DB using email
        if(user){ // If user is present
            const resetToken = user.createResetToken(); // We create a reset token for that user
            await user.save({ validateBeforeSave: false }); // Before saving we set validatebeforesaving to false so that confirm password etc. is not checked as we had set it to undefined before
            const resetPath = "http://localhost:3000/resetpassword/" + resetToken; // We create a reset path, on which if user sends a request, he will be able to change his password
            let text = resetPath; 
            let options = { // We send this reset path as an email to the user using nodemailer
                to : user.email,
                subject : "Reset Password",
                text : resetPath
            };
            await emailHelper(options); // Awaiting the sent email
            res.status(200).json({
                status: "Reset Email Sent",
            });

        }else{
            throw new Error("Email Not Registered");
        }

    }catch(err){
        console.log(err.message);
        res.status(200).json({
            status: "Error Occurred",
        });
    }
}

async function resetPassword(req,res){ // Function for resetting of password 
    let token = req.params.token;
    let {password, confirmPassword} = req.body; // Extracting the password and confirmpassword from req's body
    try{  
        let user = await userModel.findOne({ // We find the user from the DB who has the required resetToken and the resetToken hasn't yet expired
            resetToken : token,
            resetTokenExpires : {$gt: Date.now()}
        });
        if(user){ // If user is found
            user.resetPasswordHandler(password,confirmPassword); // We reset the password using the defined method in user schema
            await user.save(); // We save the user details
            res.status(200).json({
                status: "Success",
            });
        }else{
            throw new Error("Reset Link Invalid");
        }

    }catch(err){
        console.log(err.message);
        res.status(200).json({
            status: "Error Occurred",
        });
    }
}
module.exports.signup = signup;
module.exports.login = login;
module.exports.protectRoute = protectRoute;
module.exports.isAuthorized = isAuthorized;
module.exports.isUserLoggedIn = isUserLoggedIn;
module.exports.signout = signout;
module.exports.forgotPassword = forgotPassword;
module.exports.resetPassword = resetPassword;