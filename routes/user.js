const express=require("express");
const router=express.Router();
const wrapAsync=require("../Utils/WrapAsync.js");
const USerControllers=require("../controllers/user.js");
const passport = require("passport");
const {saveRedirectUrl}=require("../middlewere.js");

router.route("/signup")
.get(USerControllers.renderSignupForm)
.post(
    wrapAsync (USerControllers.signup));

router.route("/login")
.get(USerControllers.renderLoginForm)
.post(saveRedirectUrl,
  passport.authenticate("local",{
    failureRedirect:"/login",

    failureFlash:"invalid username or pasword",
  }),
  USerControllers.Login);
  
router.get("/logout",USerControllers.Logout);
module.exports=router;