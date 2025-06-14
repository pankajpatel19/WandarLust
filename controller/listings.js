const Listing = require("../model/main");
const mongoose = require("mongoose");

module.exports.index = async (req, res, next) => {
  const list = await Listing.find({});
  res.render("listings/index.ejs", { list });
};

module.exports.renderNewListings = (req, res, next) => {
  res.render("listings/new.ejs");
};

module.exports.showListings = async (req, res, next) => {
  let { id } = req.params;
  const show = await Listing.findById(id)
    .populate({ path: "review", populate: { path: "author" } })
    .populate("owner");
  if (!show) {
    req.flash("error", "list not found");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { show });
};

module.exports.CreateListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  let newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "new list created");
  res.redirect("/listings");
};

module.exports.RenderEditListing = async (req, res, next) => {
  let { id } = req.params;
  const list = await Listing.findById(id);
  if (!list) {
    throw new ExpressError(404, "list not found!");
  }
  let originalUrl = list.image.url;
  originalUrl = originalUrl.replace("/upload", "/upload/h_200,w_250");
  res.render("listings/edit", { list, originalUrl });
};

module.exports.EditListings = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "listing Updated");
  res.redirect(`/listings/${id}`);
};

module.exports.Destroy = async (req, res, next) => {
  let { id } = req.params;
  console.log(id);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    // Agar id valid nahi hai toh 404
    return next(new ExpressError(404, "Invalid listing id"));
  }
  const deleted = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted");

  res.redirect("/listings");
};
