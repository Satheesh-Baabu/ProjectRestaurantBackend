const router=require('express').Router();
const {paymentOrder,verifyPayment}=require('../controllers/paymentController');

router.post("/payment",paymentOrder)
router.post('/payment/verify',verifyPayment)

module.exports=router;