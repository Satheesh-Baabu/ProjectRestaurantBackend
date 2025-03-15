const Cart = require("../models/CartModel");

exports.getCart = async (req, res) => {
  try {
    if (!req.params.userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const cart = await Cart.findOne({ userId: req.params.userId }).populate("items.foodId");

    if (!cart || cart.items.length === 0) {
      return res.json({ userId: req.params.userId, items: [], total_amount:0,message: "Your cart is empty" }); // ✅ Always return consistent response
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error fetching cart data" });
  }
};

const calculateTotalAmount = async (cart) => {
  await cart.populate("items.foodId"); // Populate food details to get prices
  return cart.items.reduce((sum, item) => sum + item.foodId.price * item.quantity, 0);
};

// Add or Update Cart Item
exports.addToCart = async (req, res) => {
  const { userId, foodId, quantity,total_amount } = req.body;
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [{ foodId, quantity }] });
    } else {
      const itemIndex = cart.items.findIndex((item) => item.foodId.toString() === foodId);
      if (itemIndex >= 0) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ foodId, quantity });
      }
    }
    cart.total_amount = await calculateTotalAmount(cart);
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error adding item to cart" });
  }
};

// Update Item Quantity
exports.updateQuantity = async (req, res) => {
  const { userId, foodId, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ userId });
    if (cart) {
      const item = cart.items.find((item) => item.foodId.toString() === foodId);
      if (item) {
        item.quantity = quantity;
        cart.total_amount = await calculateTotalAmount(cart);
        await cart.save();
      }
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error updating cart quantity" });
  }
};

// Remove Item from Cart
exports.removeFromCart = async (req, res) => {
  const { userId, foodId } = req.body;
  try {
    let cart = await Cart.findOne({ userId });
    if (cart) {
      cart.items = cart.items.filter((item) => item.foodId.toString() !== foodId);
      cart.total_amount = await calculateTotalAmount(cart);
      await cart.save();
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error removing item from cart" });
  }
};

// Clear Cart on Order Completion
exports.clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.params.userId });
    res.json({ message: "Cart cleared after order placement" });
  } catch (error) {
    res.status(500).json({ error: "Error clearing cart" });
  }
};

// // Clear Cart for a User
// exports.clearCart = async (req, res) => {
//   const { userId } = req.body;
//   try {
//     if (!userId) {
//       return res.status(400).json({ error: "User ID is required" });
//     }

//     const cart = await Cart.findOne({ userId });
//     if (!cart) {
//       return res.status(404).json({ message: "Cart not found" });
//     }

//     cart.items = []; // Clear all items
//     await cart.save();

//     res.json({ message: "Cart cleared successfully" });
//   } catch (error) {
//     res.status(500).json({ error: "Error clearing cart" });
//   }
// };
