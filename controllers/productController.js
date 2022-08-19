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

        // Sort
        var sort = ""
        if(req.query.sort == "Newest First") {sort = true}
        if(req.query.sort == "Oldest First" || req.query.sort == "" || req.query.sort == undefined) {sort = false}

        // Get All Products
        var getProducts = await model.getProducts(req.query.search_bar, sort);

        // Get context (Created Product)
        const context = req.cookies["context"];
        var popup = "false";
        if (context != undefined) {
            popup = context;            
            res.clearCookie("context", { httpOnly: true });
        }

        const admin = firebaseModel.adminConnection();

        if (req.query.back == undefined && req.query.forward == undefined) {
            const sessionCookie = req.cookies.session || "";
            admin.verifySessionCookie(sessionCookie, true)
                .then((userData) => {

                    res.render(path.join(__dirname + "/../src/views/products/index.pug"), {
                        "route": "products",
                        "products": getProducts,
                        "nextPage": getProducts[1].hasNextPage,
                        "previousPage": getProducts[1].hasPreviousPage,
                        "showNotify": `${popup}`,
                        "CSRF": req.csrfToken(),
                        "username": req.cookies.username,
                        "searchQuery": req.query.search_bar,
                        "sort": req.query.sort,
                        "npage": getProducts[1].endCursor,
                        "bpage": getProducts[1].startCursor
                    });
                })
                .catch((error) => {
                    res.redirect("/login");
                });
        }

        if (req.query.back != undefined) {

            var getBeforeProducts = await model.getBeforeProducts(req.query.search_bar, sort, req.query.back);

            res.render(path.join(__dirname + "/../src/views/products/index.pug"), {
                "route": "products",
                "products": getBeforeProducts,
                "nextPage": getBeforeProducts[1].hasNextPage,
                "previousPage": getBeforeProducts[1].hasPreviousPage,
                "username": req.cookies.username,
                "searchQuery": req.query.search_bar,
                "CSRF": req.csrfToken(),
                "sort": req.query.sort,
                "bpage": getBeforeProducts[1].startCursor,
                "npage": getBeforeProducts[1].endCursor,
            });
        }
        
        if (req.query.forward != undefined) {

            var getAfterProducts = await model.getAfterProducts(req.query.search_bar, sort, req.query.forward);

            res.render(path.join(__dirname + "/../src/views/products/index.pug"), {
                "route": "products",
                "products": getAfterProducts,
                "nextPage": getAfterProducts[1].hasNextPage,
                "previousPage": getAfterProducts[1].hasPreviousPage,
                "username": req.cookies.username,
                "searchQuery": req.query.search_bar,
                "CSRF": req.csrfToken(),
                "sort": req.query.sort,
                "npage": getAfterProducts[1].endCursor,
                "bpage": getAfterProducts[1].startCursor,
            });
        }
    },

    create: async (req, res) => {
        const createProduct = await model.createProduct(req.body);
        res.cookie("context", createProduct, { httpOnly: true });
        res.redirect('/dashboard/products');
    },
}