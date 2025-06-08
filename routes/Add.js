const express=require('express')
const router=express.Router()
const Accommodation = require("../Models/Accomodations");

router.post('/items',async(req,res)=>{
    console.log(req.body)
    let obj={}
    obj.name=req.body.name;
    obj.type=req.body.type;
    obj.description=req.body.description;
    obj.price=req.body.price;
    obj.location={address:req.body.address,city:req.body.city,state:req.body.state}
    obj.images=req.body.images
    obj.amenities=req.body.amenities
    console.log(obj)
   
    
    try {
        const newData=new Accommodation(obj);
    const savedData=await newData.save();
    console.log("data saved")
    } catch (error) {
        
    }
})
module.exports=router