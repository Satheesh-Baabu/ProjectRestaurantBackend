

const Razorpay = require("razorpay");
const crypto = require("crypto");
const CartModel = require("../models/CartModel");
const OrderModel=require("../models/OrderModel")

exports.paymentOrder = async (req, res) => {
    try {
        const { userId } = req.body;
        const cart = await CartModel.findOne({ userId });
        const amount=cart.total_amount;
        const instance = new Razorpay({
            key_id: process.env.KEY_ID,
            key_secret: process.env.KEY_SECRET
        });

        const options = {
            amount:amount*100,
            currency: "INR",
            receipt: crypto.randomBytes(10).toString("hex")
        };

        instance.orders.create(options, (error, order) => {
            if (error) {
                console.error("Razorpay Order Creation Error:", error);
                return res.status(500).json({ message: "Something went wrong" });
            }
            res.status(200).json({ data: order,cart });
        });
    } catch (err) {
        console.error("Payment Order Error:", err);
        res.status(500).json({ error: "Payment Server Internal Error" });
    }
};



exports.verifyPayment = async (req, res) => {
    try {
        console.log("Received verification request:", req.body);
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId,cartId } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ message: "Missing payment details" });
        }

        // Validate Razorpay signature
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto.createHmac("sha256", process.env.KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature !== expectedSign) {
            console.error("Invalid signature received:", razorpay_signature);
            return res.status(400).json({ message: "Invalid Signature Sent" });
        }

        console.log("Signature verified successfully");

        // Find and update the existing order
        const updatedOrder = await OrderModel.findOneAndUpdate(
            {cart_id:cartId,},  // Find order by userId 2
            {
                payment_status: "Paid", 
                razorpay_order_id:razorpay_order_id,
                razorpay_payment_id: razorpay_payment_id,
                order_status: "Pending",
            },
            { new: true } // Return updated document
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found or update failed" });
        }

        // Clear the cart after successful payment
        await CartModel.findOneAndDelete({ userId });

        return res.status(200).json({ message: "Payment verified successfully", order: updatedOrder });

    } catch (error) {
        console.error("Payment Verification Error:", error);
        res.status(500).json({ error: "Payment Verification Server Error" });
    }
};
