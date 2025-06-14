const Listing = require("../model/main");
const Review = require("../model/review");

module.exports.CreateReview = async (req, res) => {
  let newlist = await Listing.findById(req.params.id);
  let newrev = new Review(req.body.review);
  newrev.author = req.user._id;
  newlist.review.push(newrev);
  await newrev.save();
  await newlist.save();
  req.flash("success", "Review post succcessfully");
  res.redirect(`/listings/${newlist._id}`);
};

module.exports.DestroyReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  const listings = await Listing.findById(id);
  req.flash("success", "Review Delete ho gaya vroooo ");

  res.redirect(`/listings/${id}`);
};
