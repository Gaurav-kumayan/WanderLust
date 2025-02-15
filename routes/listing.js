const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn , isOwner,validateListing} = require("../middleware.js");


// index route
router.get("/", wrapAsync(async (req, res, next) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));


// new route 

router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
});


// show route

router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!")
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
    console.log(listing.owner.username);
}));

// create route

router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res) => {

    const newlisting = new Listing(req.body.Listing);
    newlisting.owner = req.user._id;
    await newlisting.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
}));

//edit route 

router.get("/:id/edit", isLoggedIn, isOwner ,wrapAsync(async (req, res) => {
    let { id } = req.params;
    console.log(id);

    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!")
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}));

//update route

router.put("/:id", isLoggedIn,  isOwner , validateListing, wrapAsync(async (req, res) => {

    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.Listing });
    req.flash("success", "Listing Edited");
    res.redirect(`/listings/${id}`);

}));


// delete route 

router.delete("/:id", isLoggedIn, isOwner ,wrapAsync(async (req, res) => {
    let { id } = req.params;
    req.flash("success", "Listing Deleted");
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));


module.exports = router;