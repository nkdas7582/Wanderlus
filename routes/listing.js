const express =require("express");
const router =express.Router();
const Listing =require("../Models/listing.js");
const wrapAsync=require("../Utils/WrapAsync.js");
const ExpressError=require("../Utils/expressError.js");
const {listingSchema}=require("../schema.js");
//listing validation method
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
router.get("/", async(req,res)=>{
  const allListings= await Listing.find({});
        //console.log(allListings);
        res.locals.successMsg = req.flash("success");
        res.render("listings/index.ejs",{allListings});
    });

  //new route
  router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");                                                         
})
//show route
router.get("/:id",async(req,res)=>{
        let{id}=req.params;
       const listing=await Listing.findById(id).populate("reviews");//findById is a method
       res.render("listings/show.ejs",{listing});
      
    });
 //create route
 router.post("/",validateListing,
     wrapAsync(async (req, res, next) => {
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        req.flash("success","new listings created!")
    res.redirect("/listings");

}));

//Edit route
router.get("/:id/edit",async(req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});

  //update route
  router.put("/:id", validateListing,wrapAsync(async(req,res)=>{
    let{id}=req.params; //extract id
   await Listing.findByIdAndUpdate(id,{...req.body.listing});
   res.redirect(`/listings/${id}`);
})
);

//delete route
router.delete("/:id",async(req,res)=>{
    let{id}=req.params; //extract id
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings")
});
module.exports=router;