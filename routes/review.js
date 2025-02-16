const express = require("express");
const router = express.Router({mergeParams : true});
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const{validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const Listing = require("../models/listing.js");
const reviewController = require("../controllers/reviews.js"); 


//review post route

router.post("/", isLoggedIn, validateReview , wrapAsync(reviewController.createReview));

//review delete route 
router.delete("/:reviewid", isLoggedIn, isReviewAuthor , wrapAsync(reviewController.destroyReview));


module.exports = router;