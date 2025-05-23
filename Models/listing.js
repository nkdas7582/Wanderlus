const mongoose=require("mongoose");
const Review=require("./review.js")
const Schema=mongoose.Schema;

const listingSchema= new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        filename:String,
    },
    image: {
       type:String,
        url:{
            filename: String,
            required:true,
            default: "https://www.123rf.com/photo_131093090_tortoiseshell-cat-nestled-in-prairie.html",
            set: (v) =>
                v === ""? "https://www.123rf.com/photo_131093090_tortoiseshell-cat-nestled-in-prairie.html":v,
           },
    },
    price:Number,
    location:String,
    country:String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review",
       
    },
],
});
listingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}});
}});
const Listing= mongoose.model("Listing",listingSchema);
module.exports=Listing;
