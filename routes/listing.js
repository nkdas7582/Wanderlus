const express =require("express");
const router =express.Router();
const wrapAsync=require("../Utils/WrapAsync.js");
const ExpressError=require("../Utils/expressError.js");
const {isLoggedIn,isOwner,validateListing}=require("../middlewere.js");
const Listing =require ("../Models/listing.js");
const listingCOntroller=require("../controllers/listings.js");
const multer  = require('multer');
const storage=require("../cloudconfig.js");
const upload = multer({ storage });
//index route & create listings route
router.route("/")
.get( wrapAsync(listingCOntroller.index))
.post(
  isLoggedIn,
  upload.single("listing[image]"), // ✅ file & body are parsed here
  validateListing,                 // ✅ now req.body.listing exists
  wrapAsync(listingCOntroller.createListing)
);


       //new route
  router.get("/new",isLoggedIn,(listingCOntroller.renderNewForm));
//show listing with id & update &delete
router.route("/:id")
.get((listingCOntroller.showListing))
.put(isLoggedIn,isOwner,
   upload.single("listing[image]"),
   validateListing,
   wrapAsync(listingCOntroller.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingCOntroller.deleteListing));
//Edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingCOntroller.EditListing));

module.exports=router;