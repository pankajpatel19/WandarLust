const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapasync = require("../utils/wrapasync.js");
const Reviewcontroller = require("../controller/review.js");

const {
  validatereview,
  isLogedIn,
  isReviewAuthor,
} = require("../middleware.js");

//review route post
router.post(
  "/",
  isLogedIn,
  validatereview,
  wrapasync(Reviewcontroller.CreateReview)
);

//review delete route
router.delete(
  "/:reviewId",
  isLogedIn,
  isReviewAuthor,
  wrapasync(Reviewcontroller.DestroyReview)
);

module.exports = router;
