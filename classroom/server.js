const express =require("express");
const app =express();
var cookieParser = require("cookie-parser");
var session = require("express-session")
app.use(cookieParser("secreatecode"));
const flash =require ("connect-flash");
const users=require("./routes/user.js");
const ejsMate=require("ejs-mate");
const path =require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.engine("ejs", ejsMate);
app.use(flash());
const sessionOptions={
    secret:"mysupersecretstring",
    resave:false,
    saveUninitialized:true,
};

app.use(session(sessionOptions));

app.get("/register", (req, res) => {
    let { name = "anonymous" } = req.query;
    req.session.name = name;

    if (name === "anonymous") {
        req.flash("error", "User not registered successfully!");
    } else {
        req.flash("success", "User registered successfully!");
    }

    res.redirect("/hello");
});

app.get("/hello", (req, res) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");

    res.render("index.ejs", { name: req.session.name });
});

// app.get("/test",(req,res)=>{
//     res.send("test successful")
// });
// app.get("/reqcount",(req,res)=>{
//    if(req.session.count){
//     req.session.count++;
//    }
//    else{
//     req.session.count=1;
//    } 
//    res.send(`your send a request ${req.session.count}times`);
// });
// app.get("/getssignedcookies",(req,res)=>{
//     res.cookie("greek","hello");
//     res.cookie("raj","dev",{signed:true});
//     res.send("send you some cookies");
// });
// app.get("/verify",(req,res)=>{
//     console.dir(req.signedCookies);
//     res.send("done!");
// });
// app.get("/",(req,res)=>{
//     console.dir(req.cookies);
//     res.send("hi am jintu");
// });
app.get("/greet",(req,res)=>{
    let {value="annonimous"}=req.cookies;
    console.log(req.cookies.value);
    //console.dir(req.cookies);
    res.send(`Hi ${value}`);
});
app.use("/users",users);
app.listen(8080,()=>{
    console.log("working fine 8080");
});
 