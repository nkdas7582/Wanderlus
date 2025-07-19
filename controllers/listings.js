const Listing =require("../Models/listing.js");
const mbxgeocoding =require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken =process.env.MAP_TOKEN;
const geocodingClint=mbxgeocoding({ accessToken: mapToken });

module.exports.index=async(req,res)=>{
  const allListings= await Listing.find({});
        //console.log(allListings);
        res.render("listings/index.ejs",{allListings});
}
module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");                                                    
};
module.exports.showListing=async(req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
   .populate("owner");

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
}
//Edit 
module.exports.createListing = async (req, res, next) => {
  try {
    let response = await geocodingClint.forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    }).send();

    let url = req.file?.path;
    let filename = req.file?.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = response.body.features[0].geometry;

    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");

  } catch (err) {
    next(err); // ✅ Only call this if there was an error
  }
};

 module.exports.EditListing=async(req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id);
    console.log(listing);
    let originalimageurl=listing.image.url;
   let originalimageUrl= originalimageurl.replace("/upload/h_300,w_250,e_blur:300")
    res.render("listings/edit.ejs",{listing,originalimageUrl});
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;

  // Update basic listing fields
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  // ✅ Re-geocode the updated location to get new coordinates
  const geoData = await geocodingClint.forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
  }).send();

  listing.geometry = geoData.body.features[0].geometry;

  // ✅ Handle image if uploaded
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
  }

  await listing.save();

  req.flash("success", "Listing updated!");
  return res.redirect(`/listings/${id}`);

};

//delete
module.exports.deleteListing=async(req,res)=>{
    let{id}=req.params; //extract id
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","listing deleted!");
    res.redirect("/listings");
};