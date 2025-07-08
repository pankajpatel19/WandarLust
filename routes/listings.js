const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/wrapasync.js");
const { validate, isLogedIn, isowner } = require("../middleware.js");
const Listingroutes = require("../controller/listings.js");

//multer for file-upload
const multer = require("multer");
const { listing } = require("../joi.js");
const { storage } = require("../CloudConfig.js");
const Listing = require("../model/main.js");
const upload = multer({ storage });

//using router.route nethod
//index route
//create list route
router
  .route("/")
  .get(wrapasync(Listingroutes.index))
  .post(
    isLogedIn,
    upload.single("listing[image]"),
    validate,
    wrapasync(Listingroutes.CreateListing)
  );

//create new route
router.get("/new", isLogedIn, Listingroutes.renderNewListings);
//Search
router.get("/search", async (req, res) => {
  let query = req.query.q;
  console.log(query);

  if (!query) {
    res.redirect("/listings");
  }

  const listing = await Listing.find({
    $or: [
      { title: { $regex: query, $options: "i" } },
      { location: { $regex: query, $options: "i" } },
      { category: { $regex: query, $options: "i" } },
    ],
  });

  console.log(listing);
  if (listing.length === 0) {
    req.flash("error", "the place to search you are trying is not found");
    res.redirect("/listings");
  } else {
    res.render("listings/search.ejs", { listing, query });
  }
});
//icon
router.get("/category/:category", async (req, res) => {
  let { category } = req.params;
  let listings = await Listing.find({ category });
  console.log(listings);
  res.render("listings/category", { listings, category });
});
//listing show route
//update route
//delete route
router
  .route("/:id")
  .get(wrapasync(Listingroutes.showListings))
  .put(
    isLogedIn,
    isowner,
    upload.single("listing[image]"),
    validate,
    wrapasync(Listingroutes.EditListings)
  )
  .delete(isLogedIn, isowner, wrapasync(Listingroutes.Destroy));

//edit listings
router.get(
  "/:id/edit",
  isLogedIn,
  isowner,
  wrapasync(Listingroutes.RenderEditListing)
);

module.exports = router;
