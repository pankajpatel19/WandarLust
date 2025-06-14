const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;

const listing = new Schema({
  title: String,
  description: String,
  image: {
    url: String,
    filename: String,
  },
  phone: Number,
  cost: Number,
  location: String,
  country: String,
  review: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  category: {
    type: String,
    enum: [
      "Rooms",
      "City",
      "Mountain",
      "Castle",
      "Pools",
      "Camping",
      "Farms",
      "Beach",
    ],
  },
});

const Listing = mongoose.model("Listing", listing);
module.exports = Listing;
