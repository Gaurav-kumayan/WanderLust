const express = require("express");
const router = express.Router({mergeParams : true});


const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const{validateReview} = require("../middleware.js");
const Listing = require("../models/listing.js");



//review post route

router.post("/", validateReview , wrapAsync(async (req, res) => {

    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    req.flash("success" , "New Review Created");
    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
}));

//review delete route 
router.delete("/:reviewid", wrapAsync(async (req, res) => {
    let { id, reviewid } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
    await Review.findByIdAndDelete(reviewid);
    req.flash("success" , "Review Deleted");

    res.redirect(`/listings/${id}`);

}));


module.exports = router;