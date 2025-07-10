const express=require("express");
const router=express.Router();
const User=require("../Models/user.js");
const wrapAsync=require("../Utils/WrapAsync.js");
const {saveRedirectUrl}=require("../middlewere.js");
const passport=require("passport");
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});
router.post("/signup",
    wrapAsync(async(req,res)=>{
    try{
    let{username,email,password}=req.body;
     const newUser=new User({username,email});
    const registeruser=await User.register(newUser,password);
    console.log(registeruser);
    req.login(registeruser,(err)=>{
        if(err){
            return next(err);
        }
         req.flash("success","user registed sucessful");
     res.redirect("/listings");
    });
 

    } catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    };  
}));
router.get("/login",(req,res)=>{
    res.render("users/login.ejs");

});
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "Welcome to Wanderlust, you are logged in!");
    const redirectUrl = res.locals.redirectUrl || "/listings";
    delete req.session.redirectUrl; // ✅ Clear after using
    res.redirect(redirectUrl);
  }
);
router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("sucess","yoa are logged out");
        res.redirect("/listings");
    });
});
module.exports=router;