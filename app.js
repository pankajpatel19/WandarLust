//for env file access
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

//for connection
const express = require("express");
const app = express();
const port = 1916;

const mongoose = require("mongoose");
const method = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

//for user model
const passport = require("passport");
const Localpassport = require("passport-local");
const User = require("./model/user.js");

//routers
const listingsRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const cookieParser = require("cookie-parser");

//mogoose connection
const dburl = process.env.ATLASDB_URL;
async function main() {
  await mongoose.connect(dburl);
}
main()
  .then((res) => {
    console.log("connection sucessfully");
  })
  .catch((err) => {
    console.log(err);
  });

//set session property

const store = MongoStore.create({
  mongoUrl: dburl,
  crypto: {
    secret: process.env.secret,
  },
  touchAfter: 24 * 3600,
});

store.on("ERROR", () => {
  console.log("Error in MongoStore", err);
});

const sessionsection = {
  store,
  secret: process.env.secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httponly: true,
  },
};

//-----------------------------------------------------------

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(method("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser("secretcode"));

//for coockies
app.use(session(sessionsection));
app.use(flash());

//for user authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localpassport(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware for flash massage
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.curruser = req.user || null;
  next();
});

//routes
app.get("/", (req, res, next) => {
  res.render("/listings");
});
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

//throw express Error
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// //error handling if someone created new post
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong" } = err;
  res.status(statusCode).render("listings/error.ejs", { message });
});

app.listen(port, () => {
  console.log(`server start on ${port}`);
});

//example of sent cookie
// app.get("/cookie", (req, res) => {
//   let { name = "anonymos" } = req.cookies;
//   res.send(`cookies send ${name}`);
// });

//get signcookie value
// app.get("/verify", (req, res) => {
//   console.log(req.signedCookies);
//   res.send("cookie signed");
// });
