const OrderModel = require("../models/OrderModel");

exports.getorders = async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const orders = await OrderModel.find({
            created_at: { $gte: startOfDay, $lte: endOfDay },
            order_status: { $nin: ["Cooked", "Served"] }
        }).populate({
            path: "items.food_id",
            select: "foodname price vornv foodtype filename"
        });

        if (!orders.length) {
            return res.json({ message: "No orders found for today" });
        }

        res.status(200).json({ orders });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to fetch orders" });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { order_status } = req.body;

        let newStatus = "";
        if (order_status === "Pending") {
            newStatus = "Cooking";
        } else if (order_status === "Cooking") {
            newStatus = "Cooked";
        } else {
            return res.status(400).json({ message: "Invalid status update" });
        }

        const updateOrder = await OrderModel.findByIdAndUpdate(id, { order_status: newStatus }, { new: true });
        const io = req.app.get("socketio");
        io.emit("new_supplier_order", updateOrder)
        
        if (!updateOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        return res.json({ message: "Order updated successfully", order: updateOrder });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to update order" });
    }
};
