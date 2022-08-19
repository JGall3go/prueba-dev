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

    get: (req, res) => {
        res.render(path.join(__dirname + "/../src/views/login/index.pug"), {"error": "false"});
    },

    post: (req, res) => {
    
    }
}