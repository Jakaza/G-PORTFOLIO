const path = require("path")
const express = require('express')
const nodemailer = require("nodemailer");
const bodyParser = require('body-parser')
const app = express()
require("dotenv").config()
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, 'public')))
app.set("views", path.join(__dirname, 'server', 'views'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    const data = "Data";
    res.render('index', { data })
})

app.get('/_index', (req, res) => {
    res.render('_index')
})


app.post('/contact/sendMail', (req, res) => {
    // Send Me An Email
    // get input feild values
    const userName = req.body.username;
    const userEmail = req.body.email;
    const userSubject = req.body.subject;
    const userMessage = req.body.message;

    // Validate data
    if (!userName || !userEmail || !userSubject || !userMessage) {
        res.status(400).send({
            message: "failed"
        });
        return;
    } else if(isValidEmail(email)){
        res.status(400).send({
            message: "failed",
            error: 'invalid email address'
        });
        return;
    }
    else {
        // Save data to database or process it in some way
        sendMessage(userName, userEmail, userSubject, userMessage)
            .catch(error => {
                res.status(400).send({
                    message: "failed"
                });
            })

        res.status(200).send({
            message: "Data saved",
            name: userName,
            email: userEmail
        });
    }

})


function isValidEmail(email){
    var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

    if (!email)
    return false;

    if(email.length>254)
        return false;

    var valid = emailRegex.test(email);
    if(!valid)
        return false;

    // Further checking of some things regex can't handle
    var parts = email.split("@");
    if(parts[0].length>64)
        return false;

    var domainParts = parts[1].split(".");
    if(domainParts.some(function(part) { return part.length>63; }))
        return false;
    return true;
}




async function sendMessage(userName, userEmail, userSubject, userMessage) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.APP_USER, // email
            pass: process.env.APP_PASSWORD, // app password
        },
    });

    let info = await transporter.sendMail({
        sender: `${userEmail}`,
        from: `${userEmail}`, // sender address
        to: "goodnessjakazac@gmail.com",
        replyTo: `${userEmail}`,
        subject: `${userSubject}`, // Subject line
        text: `${userMessage}`, // plain text body
        html: `<b>${userMessage}</b>`, // html body
    });

    info = await transporter.sendMail({
        sender: "goodnessjakazac@gmail.com",
        from: "goodnessjakazac@gmail.com", // sender address
        to: `${userEmail}`,
        replyTo: 'goodnessjakazac@gmail.com',
        subject: `GOT YOUR EMAIL`, // Subject line
        text: `Hey ${userName}`, // plain text body
        html: `
        <p>Dear <b>${userName}</b></p>
        <p>This is to confirm I have received this email. I will get back to you as soon as possible.</p>
        <p>Regards,</p>
        <p>Themba G Chauke</p>
        `, // html body
    });
}

app.get('/project/list-project', (req, res) => {

})
app.get('/project/:projectID', (req, res) => {

})

app.post('/project/new-project', (req, res) => {

})

app.delete('/project/:projectID', (req, res) => {

})

app.use('/*', (req, res) => {
    res.render('404')
})


app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))