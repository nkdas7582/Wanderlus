const express =require("express");
const app= express();
const mongoose=require("mongoose");
const ExpressError=require("./Utils/expressError.js");
const methodOverride =require("method-override");
const Mongo_URL="mongodb://127.0.0.1:27017/wanderlust";
const ejsMate=require("ejs-mate");
const flash =require ("connect-flash");
var session = require("express-session")
const path =require("path");
const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");
const sessionOptions={
    secret:"mysupersecretstring",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() +14*24*60*60*2000,
        maxAge:14*24*60*60*2000,
        httpOnly:true,
    }
};
app.use(session(sessionOptions));
main().then(()=>{
    console.log("connectd to DB")
})
    .catch((err)=>{
        console.log(err);
    });
async function main() {
    await mongoose.connect(Mongo_URL);
    
}

//ejs tamplte
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));
app.engine("ejs", ejsMate);
app.use(flash());
app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.get("/",(req,res)=>{
    res.send("working");
});

// app.get("/testListing",async (req,res)=>{
//    let samplelisting = new Listing({
// title:"my New villa",
// description:"By the beach",
// price:"1200",
// location:"Odisha",
// country:"India",
// });
//    await samplelisting.save();
//    console.log("sample was saved");
//    res.send("testing sucessful");
// });

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found!"))
});
app.use((err,req,res,next)=>{
    let{statuscode=500,message="something went wrong!"}=err;
    res.status(statuscode).render("listings/error.ejs",{message});
   // res.status(statuscode).send(message);
});
app.listen(8080,()=>{
    console.log("server is listing port number 8080");
});

