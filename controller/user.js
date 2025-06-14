const User = require("../model/user.js");

module.exports.renderSignup = (req, res) => {
  res.render("listings/user.ejs");
};

module.exports.SignUpUser = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let newuser = new User({ username, email });
    let reguser = await User.register(newuser, password);

    //passport login method
    req.login(reguser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome To WondarLust");
      res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", "user already exists");
    res.redirect("/signup");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("listings/LoginUser.ejs");
};

module.exports.LoginUser = async (req, res) => {
  req.flash("success", `Welcome To WanderLust ${req.user.username}`);
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.LogOut = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      next();
    }

    req.flash("success", "you are logout");
    res.redirect("/listings");
  });
};
