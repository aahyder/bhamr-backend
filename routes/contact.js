//contact.js
const express = require("express");
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
require("dotenv").config();
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;
const router = express.Router();

//create oauth client and retrieve new refresh token
const createTransporter = async () => {
    const oauth2Client = new OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      "https://developers.google.com/oauthplayground"
    );
  
    oauth2Client.setCredentials({
      refresh_token: process.env.REFRESH_TOKEN
    });
  
    const accessToken = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          reject();
        }
        resolve(token);
      });
    });
  
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL,
        accessToken,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN
      }
    });
  
    return transporter;
  };

//routes
router.post('/contact', (req, res, next) => {
    // send req body values to email
    // firstName, lastName, email, company, phone, msg, type
    console.log('contact fired')
    console.log(process.env.GOOGLE_CLIENT_ID_MAIL+" "+process.env.GOOGLE_CLIENT_SECRET_MAIL+ " "+process.env.GOOGLE_REDIRECT_URI+" "+REFRESH_TOKEN)
    console.log(        
        req.body.firstName,
        req.body.lastName,
        req.body.email,
        req.body.company,
        req.body.phone,
        req.body.msg,
        req.body.type)
    sendMail(
        'test','test','aabhyder@gmail.com','test','test','test','test'
    ).then(
        (result) => console.log('Email sent . . . ', result)
    ).catch(
        (error) => console.log('Error mailing . . .', error.message)
    );
})

async function sendMail(firstName, lastName, email, company, phone, msg, type) {
    // send email to ben hyder when contact form is filled out
    try{
        // create transporter object
        let emailTransporter = await createTransporter()
        // set mail options
        const mailOptions = {
            from: 'contact@bhamr.com',
            to: 'bhyder@gmail.com',
            subject: `Contact Form Submission - ${firstName} ${lastName}`,
            text: '',
            html: `
                <table>
                    <tr>
                        <td><strong>First Name</strong></td>
                        <td><strong>Last Name</strong></td>
                        <td><strong>Email</strong></td>
                        <td><strong>Phone</strong></td>
                        <td><strong>Company</strong></td>
                        <td><strong>Inquiry Type</strong></td>
                    </tr>
                    <tr>
                        <td>${firstName}</td>
                        <td>${lastName}</td>
                        <td>${email}</td>
                        <td>${phone}</td>
                        <td>${company}</td>
                        <td>${type}</td>
                    </tr>
                </table>
                <br>
                <h2>Message:</h2>
                <p>${msg}</p>
            `
        }
        // send mail
        emailTransporter.sendMail(mailOptions);
    } catch(error) {
        return error;
    }
}

module.exports = router;