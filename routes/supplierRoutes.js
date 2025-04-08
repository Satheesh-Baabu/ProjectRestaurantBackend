const express=require('express')
const {supplierUpdates,getOrders,supplierPaymentUpdates}=require('../controllers/supplierController')
const router=express.Router();

router.put("/supplier-updates/:id",supplierUpdates)
router.get("/supplier-orders",getOrders)
router.put('/supplier-payment-updates/:id',supplierPaymentUpdates)

module.exports=router;