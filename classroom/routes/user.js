const express =require ("express");
const router =express.Router();
router.get("/:id",(req,res)=>{
    res.send("et for ussers");
});
module.exports = router;