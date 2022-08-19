// Modules
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const csrf = require("csurf");

const csrfMiddleware = csrf({ cookie: true });

// Settings
const app = express();
app.set("port", 8002);
app.set("view engine", "pug");

//Middlewares
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(csrfMiddleware);

app.all("*", (req, res, next) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    next();
});

// Routes

app.get("/", (req, res) => {
    res.redirect("/dashboard/products");
})

app.get("/dashboard", (req, res) => {
    res.redirect("/dashboard/products");
})

const loginRoute = require("../routes/login.js");
app.use("/login", loginRoute);

const signupRoute = require("../routes/signup.js");
app.use("/signup", signupRoute);

const productRoute = require("../routes/products.js");
app.use("/dashboard/products", productRoute);

const sessionLogin = require("../routes/session.js");
app.use("/sessionLogin", sessionLogin);

app.get("/sessionLogout", (req, res) => {
    res.clearCookie("session");
    res.clearCookie("username");
    res.redirect("/login");
});

app.get("*", function (req, res) {
    res.render(path.join(__dirname + "/../src/views/error/index.pug"));
})

// Port
app.listen(app.get("port"), () => {
    console.log("working");
})