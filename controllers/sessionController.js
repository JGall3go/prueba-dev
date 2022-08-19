const path = require("path")
var express = require('express')
var cookieParser = require('cookie-parser')

var app = express()
app.use(cookieParser())

const firebaseModel = require('../models/firebaseModel')

module.exports = {

    post: async(req, res) => {
        
        const idToken = req.body.idToken.toString();
        const email = req.body.email.toString();
        const expiresIn = 60 * 60 * 24 * 5 * 1000; // The session expires in 5 days

        const displayName = await firebaseModel.getCurrentUser(email); // Save The Username
        res.cookie("username", displayName, { maxAge: expiresIn });

        const admin = firebaseModel.adminConnection();

        admin.createSessionCookie(idToken, { expiresIn })
            .then(
                (sessionCookie) => {
                    const options = { maxAge: expiresIn, httpOnly: true};
                    res.cookie("session", sessionCookie, options);
                    res.end(JSON.stringify({ status: "success" }));
                },
                (error) => {
                    res.status(401).send("Bad Request!");                
                }
            );
    }
} 