const AddFoodModel = require('../models/AddFoodModel');
const OrderModel=require('../models/OrderModel')
const User=require("../models/User")
const CartModel=require("../models/CartModel")

exports.orders=async(req,res)=>{
    try{
        const{user_id,order_type,table_number,items,payment_method}=req.body;
        const user=await User.findById(user_id);
        if(!user)
        {
            return res.status(404).json({message:"User not found"});
        }
        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            const food = await AddFoodModel.findById(item.food_id);
            if (!food) return res.status(404).json({ message: `Food item not found: ${item.food_id}` });

            totalAmount += food.price * item.quantity;
            orderItems.push({ food_id: food._id, quantity: item.quantity });
        }

        const cart = await CartModel.findOne({ userId:user_id });
        

        const newOrder = new OrderModel({
            user_id,
            cart_id: cart.cartId,
            order_type,
            table_number: order_type === "Dine-in" ? table_number : null,
            items: orderItems,
            total_amount: totalAmount,
            payment_method:payment_method
        });
        
        await newOrder.save();
        const io = req.app.get("socketio");
        io.emit("new_order", newOrder)
        res.status(201).json({ success: true, message: "Order placed successfully", order: newOrder });
    }
    catch (error) { 
        console.error(error);
        res.status(500).json({ message: "Failed to place order" });
    }
};

exports.getorders=async(req,res)=>{
    try{
        const orders=await OrderModel.find({user_id:req.params.user_id})
        .populate({path:"items.food_id",select:"foodname price vornv foodtype filename"})

        if(!orders.length)
            return res.status(404).json({message:"No orders found in this user"});
        res.status(201).json({orders})
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({message:"Failed to fetch orders"});
    }
}