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
