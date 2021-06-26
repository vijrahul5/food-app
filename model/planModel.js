const mongoose = require("mongoose"); // Requires mongoose package installed by NPM
const secrets = require("../config/secrets"); //  Secrets file where we store confidential data

// Mongoose is a promise based library

mongoose   // Used to connect to the MongoDB database. Returns a promise which evaluates to true if connected.
    .connect(
        secrets.DB_LINK, // This is the link of the remote cluster
        {useCreateIndex : true,useNewUrlParser: true, useUnifiedTopology: true}
    )
    .then(function(db){ // If promise is fulfilled, this callback function is executed
        console.log("Plan Database Connected.");
    })
    .catch(function(err){ // If promise is not fulfilled, this will catch an error and display it
        console.log(err);
    });


const planSchema = new mongoose.Schema({ // This creates a new database schema
    name: { 
        type: String, // Data Type
        required : [true,"No Name For Plan Provided"], // You have to provide it necessarily else it will throw the mentioned err message
        unique: true,
        maxlength: [40,"Name Cannot Be More Than 40 Characters"]
    },
    duration: {
        type: Number, // Data Type
        required: [true,"Provide Duration"], 
        max: 12, // Maximum 12 months
        min: 1 // Minimum 1 months
    },
    price: {
        type: Number, // Data Type
        required: true
    },
    rating: {
        type: Number // Not necessarily required
    },
    discount: {
        type: Number, // Data Type
        validate : { // Custom Validator
            validator: function(){
                return this.discount < this.price;
            },
            message: "Discount Cannot Be More Than The Price Of The Plan" //  If our validator return false, we throw this error message
        }
    },
    features: {
        type : [String], // Array of string for the features
    }

});

const planModel = mongoose.model("planModel",planSchema); // This creates a new database of name planModel for particular schema
                                                          // or refers to the already created Database

module.exports = planModel; // Exporting planModel created here to be used in plan controller
