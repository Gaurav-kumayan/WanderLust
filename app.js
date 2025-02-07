const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema}= require("./schema.js");

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

app.get("/", (req, res) => {
    res.send("hi i am root");
});

const validateListing = (req , res,  next) =>{
    let {error} =  listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
     throw new ExpressError(400 , errMsg);
    }else{
       next(); 
    }
};
// add route 

app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});


// show route

app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });

}));

// create route

app.post("/listings", validateListing , wrapAsync(async (req, res) => {
  
    const newlisting = new Listing(req.body.listing);
    await newlisting.save();

    res.redirect("/listings");
}));

//edit route 

app.get("/listings/:id/edit", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));
 //update route
app.put("/listings/:id",validateListing ,  wrapAsync(async (req, res) => {
    
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);

}));



// delete route 
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

// index route
app.get("/listings", wrapAsync( async (req, res, next) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

// app.get("/testListing", async (req, res) => {

//         let sample = new Listing({
//             title: "home",
//             description : "helep",
//                  price : 2323, 
//         });
//          await sample.save();
//         console.log("done");
//         res.send("successfully saved");

// });

app.all("*" , (req, res , next ) =>{
 next(new ExpressError(404 , "Page Not Found"));
});

app.use((err, req, res, next) => {
      let{statuscode = 500 , message = " something went wrong" }= err ;
      res.status(statuscode).render("listings/error.ejs" , {message});
    //   res.status(statuscode).send(message);
    
});

app.listen(8080, () => {
    console.log("app is listening at port 8080");
});
