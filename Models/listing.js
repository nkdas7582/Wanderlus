const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const listingSchema= new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String 
    },
    image: {
        filename:String,
        url:{
            type: String,
            default: "https://www.123rf.com/photo_131093090_tortoiseshell-cat-nestled-in-prairie.html",
            set: (v) =>
                v === ""? "https://www.123rf.com/photo_131093090_tortoiseshell-cat-nestled-in-prairie.html":v,
           },
    },
    price:Number,
    location:String,
    country:String
})
const Listing= mongoose.model("Listing",listingSchema);
module.exports=Listing;