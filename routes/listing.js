const express =require("express");
const router =express.Router();
const Listing =require("../Models/listing.js");
const wrapAsync=require("../Utils/WrapAsync.js");
const ExpressError=require("../Utils/expressError.js");
const {listingSchema}=require("../schema.js");
const {isLoggedIn,isOwner,validateListing}=require("../middlewere.js");


//index route
router.get("/", async(req,res)=>{
  const allListings= await Listing.find({});
        //console.log(allListings);
        res.render("listings/index.ejs",{allListings});
    });

  //new route
  router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listings/new.ejs");                                                    
});
//show route
router.get("/:id",async(req,res)=>{
        let{id}=req.params;
       const listing=await Listing.findById(id).populate("reviews").populate("owner");//findById is a method
      if(!listing){
        req.flash("error","listing not found!");
        return res.redirect("/listings");
      }
       res.render("listings/show.ejs",{listing});
        console.log(listing);
    });
  
 //create listings route
 router.post("/", isLoggedIn,validateListing,
     wrapAsync(async (req, res, next) => {
        const newListing = new Listing(req.body.listing);
        newListing.owner=req.user._id;
        await newListing.save();
        console.log(newListing)
        req.flash("success","new listings created!")
    res.redirect("/listings");
next(err);//wrap sync catch any througn the next(err)middlewere
}));

//Edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

  //update route
  router.put("/:id", isLoggedIn,isOwner,validateListing,wrapAsync(async(req,res)=>{
    let{id}=req.params; //extract id
   await Listing.findByIdAndUpdate(id,{...req.body.listing});
   req.flash("success","listing updated!")
    return res.redirect(`/listings/${id}`);
})
);


//delete route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
    let{id}=req.params; //extract id
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","listing deleted!");
    res.redirect("/listings");
}));
module.exports=router;