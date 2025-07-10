const express = require("express");
const wrapAsync = require("../Utils/WrapAsync.js");
const ExpressError = require("../Utils/expressError.js");
const router = express.Router({ mergeParams: true });
const Review = require("../Models/review.js");
const Listing = require("../Models/listing.js");
const { isLoggedIn, validateReview } = require("../middlewere.js");

// POST a new review
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "New review created!");
    res.redirect(`/listings/${listing._id}`);
  })
);

// DELETE a review
router.delete(
  "/:reviewId",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted!");
    res.redirect(`/listings/${id}`);
  })
)
module.exports = router; // ✅ Export the router directly
