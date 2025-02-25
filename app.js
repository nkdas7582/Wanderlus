const express =require("express");
const app= express();
const mongoose=require("mongoose");
const Listing =require("./Models/listing.js");
const ExpressError=require("./Utils/expressError.js");
const methodOverride =require("method-override");
const listingSchema=require("./schema.js")
const wrapAsync=require("./Utils/WrapAsync.js");
const Mongo_URL="mongodb://127.0.0.1:27017/wanderlust";
const ejsMate=require("ejs-mate");
const path =require("path");
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

app.get("/",(req,res)=>{
    res.send("working");
});
const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();

    } 
};
//index route
app.get("/listings", async(req,res)=>{
  const allListings= await Listing.find({});
        console.log(allListings);
        res.render("listings/index.ejs",{allListings});
    });

  //new route
  app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");                                                         
})
//show route
 app.get("/listings/:id",async(req,res)=>{
        let{id}=req.params;
       const listing=await Listing.findById(id);//findById is a method
       res.render("listings/show.ejs",{listing});
      
    });
 //create route
 app.post("/listings",validateListing,
     wrapAsync(async (req, res, next) => {
   
        const newListing = new Listing(req.body.listing);
        await newListing.save();
    res.redirect("/listings");

}));



//Edit route
app.get("/listings/:id/edit",async(req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});

  //update route
app.put("/listings/:id", validateListing,wrapAsync(async(req,res)=>{
    let{id}=req.params; //extract id
   await Listing.findByIdAndUpdate(id,{...req.body.listing});
   res.redirect(`/listings/${id}`);
})
);

//delete route
app.delete("/listings/:id",async(req,res)=>{
    let{id}=req.params; //extract id
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
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
