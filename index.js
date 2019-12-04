//Dependencies installed : express , express-handlebars , express-session , connect-flash , 
// dotenv , paypal-rest-sdk , nodemon -D

const express = require("express")
const path = require("path")
const session = require("express-session")
const exphbs = require("express-handlebars")
const flash = require("connect-flash")

//INITIALIZATIONS
const app = express()
require("dotenv").config()

//SETTINGS
app.set("port" , process.env.PORT)
app.set("views" , path.join(__dirname , "views")) // where the views are
app.engine(".hbs" , exphbs({ // setting up the view engine
    defaultLayout : "main",
    layoutsDir : path.join(app.get("views") , "layouts"),
    partialsDir : path.join(app.get("views") , "partials"),
    extname : ".hbs"
}))
app.set("view engine" , "hbs")

//MIDDLEWARES
app.use(session({ // I did this because flash doesn´t work without it 
    secret : "secret",
    resave : true ,
    saveUninitialized : true
}))
app.use(flash()) // Allows to the send flash messages

//GLOBAL VARIABLES
app.use((req , res , next) => { // Types of flash messages
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    next()
})

//ROUTES
app.use(require("./routes/index"))

//SERVER
app.listen(app.get("port") , () => console.log("Server on port " + app.get("port")))
