const express = require("express");
const router = express.Router({mergeParams : true});
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const{validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const Listing = require("../models/listing.js");



//review post route

router.post("/", isLoggedIn, validateReview , wrapAsync(async (req, res) => {

    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
   
    await newReview.save();
    await listing.save();
    req.flash("success" , "New Review Created");
    res.redirect(`/listings/${listing._id}`);
}));

//review delete route 
router.delete("/:reviewid", isLoggedIn, isReviewAuthor , wrapAsync(async (req, res) => {
    let { id, reviewid } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
    await Review.findByIdAndDelete(reviewid);
    req.flash("success" , "Review Deleted");

    res.redirect(`/listings/${id}`);

}));


module.exports = router;