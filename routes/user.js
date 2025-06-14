const express = require("express");
const router = express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const usercontroller = require("../controller/user.js");

router
  .route("/signup")
  .get(usercontroller.renderSignup)
  .post(usercontroller.SignUpUser);

router
  .route("/login")
  .get(usercontroller.renderLogin)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    usercontroller.LoginUser
  );

router.get("/logout", usercontroller.LogOut);

module.exports = router;
