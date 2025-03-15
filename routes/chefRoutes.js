const express=require('express')
const router=express.Router();
const {getorders,updateStatus} =require('../controllers/chefController')

router.get("/chef-orders",getorders);
router.put("/update-status/:id",updateStatus)

module.exports=router;