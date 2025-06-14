const ExpressError = require("./utils/ExpressError.js");
const { listing } = require("./joi.js");
const { reviewSchema } = require("./joi.js");
const Listing = require("./model/main.js");
const Review = require("./model/review.js");

module.exports.isLogedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you have to login first");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isowner = async (req, res, next) => {
  let { id } = req.params;
  let newListing = await Listing.findById(id);
  if (!newListing.owner.equals(res.locals.curruser._id)) {
    req.flash("error", "you are not owner broo");
    res.redirect(`/listings/${id}`);
  }
  next();
};

//create a function for validation for listings
module.exports.validate = (req, res, next) => {
  let { error } = listing.validate(req.body);
  console.log(error);
  if (error) {
    let err = error.details.map((el) => el.message).join(",");
    throw new ExpressError(404, err);
  } else {
    next();
  }
};

//create a function for validation for review
module.exports.validatereview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let err = error.details.map((el) => el.message).join(",");
    throw new ExpressError(404, err);
  } else {
    next();
  }
};

//review author check
module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let newReview = await Review.findById(reviewId);
  console.log(newReview);
  if (!newReview.author.equals(res.locals.curruser._id)) {
    req.flash("error", "dusro ka review delete nahi hota bhaii yahaan!... ");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
