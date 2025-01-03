const express =require("express");
const app= express();
const mongoose=require("mongoose");
const Listing =require("./Models/listing.js");
const Mongo_URL="mongodb://127.0.0.1:27017/wanderlust";
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

app.get("/",(req,res)=>{
    res.send("working");
});
//index route
app.get("/listings", async(req,res)=>{
  const allListings= await Listing.find({});
        console.log(allListings);
        res.render("listings/index.ejs",{allListings});
    });
    app.get("listings/:id"),async(req,res)=>{
        let{id}=req.params;
       const listing=await Listing.findById(id);
       res.render("show.ejs",{listing});
      
    };
    
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
//});
app.listen(8080,()=>{
    console.log("server is listing port number 8080");
});