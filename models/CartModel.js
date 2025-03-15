const mongoose = require("mongoose");
const CounterModel = require("./CounterModel");

const CartSchema = new mongoose.Schema({
  cartId: { type: Number, unique: true }, // Auto-incremented cart ID
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      foodId: { type: mongoose.Schema.Types.ObjectId, ref: "FoodList", required: true },
      quantity: { type: Number, required: true, default: 1 },
    },
  ],
  total_amount: { type: Number, required: true, default: 0 },
});

// Middleware to auto-increment cartId before saving
CartSchema.pre("save", async function (next) {
  if (!this.cartId) {
    try {
      const counter = await CounterModel.findOneAndUpdate(
        { name: "cartId" }, 
        { $inc: { value: 1 } }, 
        { new: true, upsert: true }
      );
      this.cartId = counter.value;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

const CartModel = mongoose.model("Cart", CartSchema);
module.exports = CartModel;
