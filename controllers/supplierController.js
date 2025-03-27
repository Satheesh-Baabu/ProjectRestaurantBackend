const OrderModel = require("../models/OrderModel");

exports.getOrders=async(req,res)=>{
    try{
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const orders = await OrderModel.find({
            created_at: { $gte: startOfDay, $lte: endOfDay },
            order_status:{$eq:"Cooked"}
        }).populate({
            path: "items.food_id",
            select: "foodname price vornv foodtype filename"
        });

        if (!orders.length) {
            return res.json({ message: "No orders found for today" });          
        }

        res.status(200).json({ orders });
    }
    catch(error)
    {
        console.log(error);
        res.status(500).json({ error: "Failed to update order" });
    }
}

exports.supplierUpdates=async(req,res)=>{
    try{
        const {id}=req.params;
        const {order_status}=req.body;
        let newStatus="";
        if(order_status==="Cooked")
            newStatus="Served"
        else {
            return res.status(400).json({ message: "Invalid status update" });
        }
        const updateOrder=await OrderModel.findByIdAndUpdate(id,{order_status:newStatus},{new:true})
        const io = req.app.get("socketio");
        io.emit("new_supplier_updates", updateOrder)
        if(!updateOrder)
            return res.status(404).json({message:"Order Not found"})
        return res.json({message:"Order Updated successfully"})
    }
    catch(error)
    {
        console.log(error);
        res.status(500).json({ error: "Failed to update order" });
    }
    
}