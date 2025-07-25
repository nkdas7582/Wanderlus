const User=require("../Models/user.js");
const passport=require("passport");
const {saveRedirectUrl}=require("../middlewere.js");
//signup
module.exports.renderSignupForm =(req,res)=>{
    res.render("users/signup.ejs",{ hideFooter: true })
};

module.exports.signup=async(req,res)=>{
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
};
module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs",{ hideFooter: true });

};

module.exports.Login=
async(req, res) => {
    req.flash("success", "Welcome to Wanderlust, you are logged in!");
    const redirectUrl = res.locals.redirectUrl || "/listings";
    delete req.session.redirectUrl; // ✅ Clear after using
    res.redirect(redirectUrl);
  };


  module.exports.Logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("sucess","yoa are logged out");
        res.redirect("/listings");
    });
};