//index.js
const express = require("express");
const contact = require("./routes/contact");
const port = process.env.PORT || 4000;
const app = express();
const router = express.Router();

router.post('/contact', (req, res, next) => {
    // send req body values to email
    // firstName, lastName, email, company, phone, msg, type
    contact.sendMail(
        req.body.firstName,
        req.body.lastName,
        req.body.email,
        req.body.company,
        req.body.phone,
        req.body.msg,
        req.body.type
    ).then(
        (result) => console.log('Email sent . . . ', result)
    ).catch(
        (error) => console.log('Error mailing . . .', error.message)
    );
})

// error handling - 404
app.use((req, res, next) =>  {
    var err = new Error('404 ERROR: Page not found');
    err.status = 404;
    next(err);
})

app.listen(port, () => console.log(`Server running on port ${port}`));