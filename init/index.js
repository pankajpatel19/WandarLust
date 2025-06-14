const mongoose = require("mongoose");
const Listing = require("../model/main.js");
const initdata = require("./record.js");

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
}
main()
  .then((res) => {
    console.log("connection sucessfully");
  })
  .catch((err) => {
    console.log(err);
  });

const initdb = async () => {
  await Listing.deleteMany({});
  initdata.data = initdata.data.map((obj) => ({
    ...obj,
    owner: "6844024b9eb59a4b3d4fa44f",
  }));
  await Listing.insertMany(initdata.data);
};

initdb();
