const secrets = require("../config/secrets");
const nodemailer = require("nodemailer"); // Requires Nodemailer package installed by NPM

async function emailHepler(options){ // Email helper function for sending emails
                                     // Options will include the email of the reciever, subject, content together in one object
    try{
        const transport = nodemailer.createTransport({ // Creating a transport for nodemailer where we pass details of the email to be sent
            service: "gmail",
            host: "smtp.gmail.com",
            secure: true,
            auth: {
              user: "vijrahul5@gmail.com", // Who send the email
              pass: secrets.APP_PASSWORD // Password for person who sends the email
            }
        });

        const emailOptions = {
            from : "vijrahul5@gmail.com",
            to : options.to, // Reciever
            subject : options.subject, // Subject of email
            text: options.text // Text of the email
        };

        await transport.sendMail(emailOptions); // Sending the email
    }catch(err){
        console.log(err.message);
    }
}

module.exports = emailHepler;