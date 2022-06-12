//contact.js
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
require("dotenv").config();
const GOOGLE_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

//create oauth client and retrieve new refresh token
const oAuth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID_MAIL, process.env.GOOGLE_CLIENT_SECRET_MAIL, process.env.GOOGLE_REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN});

async function sendMail(firstName, lastName, email, company, phone, msg, type) {
    // send email to ben hyder when contact form is filled out
    try{
        // get oauth access token
        const accessToken = await oAuth2Client.getAccessToken();
        // init transporter for google account via oauth
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "contact@bhamr.com",
                clientId: process.env.GOOGLE_CLIENT_ID_MAIL,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET_MAIL,
                accessToken: accessToken,
                refreshToken: GOOGLE_REFRESH_TOKEN
            }
        })
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
        transporter.sendMail(mailOptions);
    } catch(error) {
        return error;
    }
}

module.exports = {sendMail};