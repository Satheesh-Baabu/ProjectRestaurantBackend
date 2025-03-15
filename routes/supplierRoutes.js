const express=require('express')
const {supplierUpdates,getOrders}=require('../controllers/supplierController')
const router=express.Router();

router.put("/supplier-updates/:id",supplierUpdates)
router.get("/supplier-orders",getOrders)

module.exports=router;