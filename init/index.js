const mongoose=require("mongoose");
const initData = require("./data.js");
const Listing =require("../Models/listing.js");
const Mongo_URL="mongodb://127.0.0.1:27017/wanderlust";
main().then(()=>{
    console.log("connectd to DB")
})
    .catch((err)=>{
        console.log(err);
    });
async function main() {
    await mongoose.connect(Mongo_URL);
    
}
const initDB = async()=>{
    await Listing.deleteMany({});
   initData.data=initData.data.map((obj)=>({
        ...obj,
        owner:"68582d231f9d8d57d7a344f8",
   })
);

await Listing.insertMany(initData.data);
console.log("data was initialized");
}
initDB();