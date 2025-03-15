// const mongoose=require('mongoose')

// const OrderSchema=new mongoose.Schema({
//     user_id:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
//     order_type:{type:String,enum:["Dine-in","Takeaway","Delivery"]},
//     table_number: Number,
//     items: [{
//         food_id: { type: mongoose.Schema.Types.ObjectId, ref: "FoodList", required: true }, // Reference to FoodList
//         quantity: { type: Number, required: true },
//     }],
//     total_amount:{type:Number,required:true},
//     payment_method:{type:String,enum:["Online","Cash"],default:"Cash"},
//     payment_status:{type:String,enum:["Pending","Paid"],default:"Pending"},
//     order_status:{type:String,enum:["Pending","Cooking","Cooked","Served"],default:"Pending"},
//     created_at:{type:Date,default:Date.now},
//     updated_at:{type:Date,default:Date.now}
// });

// const OrderModel = mongoose.model("Orders", OrderSchema);

// module.exports = OrderModel;


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
    total_amount: { type: Number, required: true }, // Ensure total amount is always stored

    // Payment details
    payment_method: { type: String, enum: ["Online", "Cash"], default: "Cash" },
    payment_status: { type: String, enum: ["Pending", "Paid"], default: "Pending" },
    razorpay_order_id: { type: String,default:"NA" },  // Store Razorpay order ID
    razorpay_payment_id: { type: String,default:"NA"}, // Store Razorpay payment ID

    order_status: { type: String, enum: ["Pending", "Cooking", "Cooked", "Served"], default: "Pending" },

    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

// Middleware to update 'updated_at' before saving
OrderSchema.pre("save", function (next) {
    this.updated_at = Date.now();
    next();
});

const OrderModel = mongoose.model("Orders", OrderSchema);
module.exports = OrderModel;
