const express = require("express");
const wrapAsync = require("../Utils/WrapAsync.js");
const ExpressError = require("../Utils/expressError.js");
const router = express.Router({ mergeParams: true });
const Review = require("../Models/review.js");
const Listing = require("../Models/listing.js");
const { isLoggedIn, validateReview, isReviewAuthor } = require("../middlewere.js");
const ReviewController=require("../controllers/review.js");
// POST a new review
router.post("/",
  isLoggedIn,
  validateReview,
  wrapAsync(ReviewController.newReview));

// DELETE a review
router.delete("/:reviewId",
   isLoggedIn,
  isReviewAuthor,
  wrapAsync(ReviewController.deleteReview));
module.exports = router; // ✅ Export the router directly
