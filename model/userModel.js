const mongoose = require("mongoose"); // Requiring mongoose package installed by NPM
const secrets = require("../config/secrets"); // Requiring secrets file which stores confidential data

const crypto = require("crypto"); // NodeJS module for cryptography and security

mongoose // Connecting to MongoDB database
    .connect(secrets.DB_LINK,{
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology : true
    })
    .then(function(db){ // If connected, the promise evaluates to true
        console.log("User Database Connected.");
    })
    .catch(function(err){ // If not connected, the promise evaluates to false and we throw an err
        console.log(err);
    });

const userSchema = new mongoose.Schema({ // Creating a new User Schema 
    name: {
        type: String, // Data Type
        maxlength: [40,"Name Cannot Be More Than 40 Charactes"], // Specifies max length, if not satisfied throws given err message
        required: [true,"Provide Name"] // It is required necessarily
    },
    email: {
        type: String, // Data Type
        maxlength: [150,"Email Cannot Be More Than More Than 150 Characters"],
        required: [true,"Provide Email"]
    },
    password: {
        type: String,
        maxlength: [30,"Password Should Be Less Than 30 Characters"],
        minlength: [7,"Password Should Be More Than 7 Characters"],
        required: [true,"Provide Password"],
        select: false // This ensures that password key is not included when a document is being extracted using find for security reasons
    },
    confirmPassword: {
        type: String,
        maxlength: [30,"Password Should Be Less Than 30 Characters"],
        minlength: [7,"Password Should Be More Than 7 Characters"],
        validate : { // Custom validator which ensures that both password and confirm password fields match each other
            validator: function(){
                return this.confirmPassword == this.password;
            },
            message: "Confirm Password Does Not Match" // If match is wrong, we throw this error message
        }
    },
    city: {
        type: String,
        maxlength: 40,
        required: true
    },
    state: {
        type: String,
        maxlength: 40,
        required: true
    },
    address: {
        type: String,
        maxlength: [1000,"Address Cannot Be More Than More Than 150 Characters"],
        required: [true,"Provide Address"]
    },
    role: {
        type: String,
        enum: ["admin","user","restaurant owner","delivery boy"],
        default: "user"
    },
    resetToken: String, // resetToken used for forgot password functionality
    resetTokenExpires: Date // date datatype to check if token has expired
});

userSchema.pre("save", function () { // Type of a middleware before executing save that sets the confirm password field to undefined and removes the confirm password key from the document
    this.confirmPassword = undefined; // Hooks in mongoDB
});

userSchema.methods.createResetToken = function(){ // Adding a member function to the user schema which can be called for each instance of user model
                                                  // This will be used to create a reset token which will be required to implement forgot password
    const resetToken = crypto.randomBytes(32).toString("hex"); // Crypto is used to create a random id 
    this.resetToken = resetToken;
    this.resetTokenExpires = Date.now() + 1000*10*60;
    return resetToken;
}

userSchema.methods.resetPasswordHandler = function(password,confirmPassword){ // Adding another member function to user schema which resets the password of a user
    this.password = password;
    this.confirmPassword = confirmPassword;
    this.resetToken = undefined;
    this.resetTokenExpires = undefined;
}

const userModel = mongoose.model("userModel", userSchema); // Creates user model which acts as a blueprint to create instances of users

module.exports = userModel; // Exporting usermodel for use in user controller