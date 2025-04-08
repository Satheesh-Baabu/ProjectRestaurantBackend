const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    cart_id:{type:Number,required:true},
    order_type: { type: String, enum: ["Dine-in", "Takeaway", "Delivery"], required: true },
    table_number: Number,
    items: [{
        food_id: { type: mongoose.Schema.Types.ObjectId, ref: "FoodList", required: true }, 
        quantity: { type: Number, required: true },
    }],
    total_amount: { type: Number, required: true }, 

    // Payment details
    payment_method: { type: String, enum: ["Online", "Cash"], default: "Cash" },
    payment_status: { type: String, enum: ["Pending", "Paid"], default: "Pending" },
    razorpay_order_id: { type: String,default:"NA" },  
    razorpay_payment_id: { type: String,default:"NA"}, 

    order_status: { type: String, enum: ["Pending", "Cooking", "Cooked", "Served"], default: "Pending" },

    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

OrderSchema.pre("save", function (next) {
    this.updated_at = Date.now();
    next();
});

const OrderModel = mongoose.model("Orders", OrderSchema);
module.exports = OrderModel;
