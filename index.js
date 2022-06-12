//index.js
const express = require("express");
const contact = require("./routes/contact");
const port = process.env.PORT || 4000;
const app = express();
const contactRouter = require('./routes/contact');

// serve routes
app.use('/', contactRouter);

// error handling
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send(err.message);
});

// error handling - 404
app.use((req, res, next) =>  {
    var err = new Error('404 ERROR: Page not found');
    err.status = 404;
    next(err);
})

app.listen(port, () => console.log(`Server running on port ${port}`));