const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");

const sessionOptions = {
    secret : "myseacretcode",
    resave : false , 
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 3 *24*60*60*100,
        maxAge : 1000*60*60*24*3,
        httpOnly : true 
    },
};
//use before routes
app.use(session(sessionOptions));
app.use(flash());
app.use((req,res,next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
   
    next();
})

//routes
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");


main().then(() => {
    console.log("connection successfully to DB");
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


app.use("/listings" , listings);
app.use("/listings/:id/reviews" , reviews);


app.get("/", (req, res) => {
    res.cookie("great" , 'HELLOW');
    res.send("hi i am root");
});

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    let { statuscode = 500, message = " something went wrong" } = err;
    res.status(statuscode).render("listings/error.ejs", { message });
});



app.listen(8080, () => {
    console.log("app is listening at port 8080");
});
