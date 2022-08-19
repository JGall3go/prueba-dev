const path = require("path")
var express = require('express')
var cookieParser = require('cookie-parser')

// Cookies
var app = express()
app.use(cookieParser())

// Models
const model = require("../models/productModel");
const firebaseModel = require('../models/firebaseModel');

module.exports = {

    get: async (req, res) => {
        res.render(path.join(__dirname + "/../src/views/signup/index.pug"), {"CSRF":  req.csrfToken(), "error": ""});
    },

    post: async (req, res) => {

        const userData = {
            email: req.body.email,
            password: req.body.password,
            username: req.body.username
        }

        const userSignup = await firebaseModel.signup(userData);
        
        if(userSignup == "success") {
            res.redirect("/login");
        } else {
            res.render(path.join(__dirname + "/../src/views/signup/index.pug"), {"CSRF":  req.csrfToken(), "error": userSignup});
        }       
    }
}