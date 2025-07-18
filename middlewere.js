const Listing =require("./Models/listing.js");
const Review =require("./Models/review.js");
const ExpressError =require("./Utils/expressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");
module.exports.isLoggedIn = (req, res, next) => {
 // console.log(req.path, "..", req.originalUrl);
  if (!req.isAuthenticated()) {
    req.session.redirectUrl=req.originalUrl;
    req.flash("error", "Please login first!");
    return res.redirect("/login"); // ✅ return prevents double response
  }
  next();
};
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner =async(req,res,next)=>{
let {id}=req.params;
let listing=await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currentuser._id)){
        req.flash("error","you don't have any access  ");
     return res.redirect(`/listings/${id}`);
    }
  next();
}
//listing validation method
module.exports.validateListing=async(req,res,next)=>{
    let {error}= await listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
 
    } 
};
//validate review
module.exports.validateReview = async(req, res, next) => {
    let { error } =await reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map(el => el.message).join(", ");
        return next(new ExpressError(400, errMsg));
    }
    else{
    next();
    }
};

module.exports.isReviewAuthor =async(req,res,next)=>{
  let {id,reviewId}=req.params;
  let review =await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currentuser._id)){
    req.flash ("error","you are not the owner of that review");
    return res.redirect(`/listings/${id}`);
  }
  next();
}