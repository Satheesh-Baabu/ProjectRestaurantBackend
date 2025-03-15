const express=require('express');
const { orders,getorders } = require('../controllers/orderController');

const router=express.Router();

router.post('/orders',orders)
router.get("/orders/:user_id",getorders);

module.exports=router;