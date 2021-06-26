const express = require("express"); // To require express framework 
const path = require("path");

// These are Routers created for different routes
// which act like mini apps. All requests of that route will be redirected to a different Router/ MiniApp
// This redirection will be done by the aid of app.use() middleware
const userRouter = require("./router/userRouter"); 
const planRouter = require("./router/planRouter");
const viewRouter = require("./router/viewRouter");

const cookieParser=require("cookie-parser");

const app = express(); //  Creates a new application which uses express

app.use(express.static("./public"));

app.use(cookieParser());

app.use(express.json()); // Inbuilt Middleware to add json data from http packet to req.body 

app.set("view engine","pug"); // Setting the view engine of the app to pug
app.set("views",path.join(__dirname,"view")); // __dirname = current directory, meaning that the current directory folder 'views' will provide the views

app.use("/api/plans",planRouter); 
// All req related to plans are redirected to planRouter mini app
app.use("/api/users",userRouter);
app.use("/",viewRouter);

app.listen(3000,function(){ //  Starts the server to execute at PORT 3000 
    console.log("Server Has Started At Port 3000");
});