const mongoose=require("mongoose");
const Review=require("./review.js");
const { required } = require("joi");
const Schema=mongoose.Schema;

const listingSchema= new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
       type:String,
    },
    image: {
        url:String,
    filename:String,
    },
   price: {
  type: Number,
  required: true
},
    location:String,
    country:String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review",
       
    },
],
owner: {
    type:Schema.Types.ObjectId,
    ref:"User"
},
geometry:{
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
    },coordinates: {
      type: [Number],
      required: true
    }
  }

});
listingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}});
}});
const Listing= mongoose.model("Listing",listingSchema);
module.exports=Listing;