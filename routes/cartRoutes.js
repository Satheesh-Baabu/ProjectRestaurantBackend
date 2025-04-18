const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");


router.get("/:userId", cartController.getCart);
router.post("/add", cartController.addToCart);
router.put("/update", cartController.updateQuantity);
router.post("/remove", cartController.removeFromCart);
router.delete("/clear/:userId", cartController.clearCart);

module.exports = router;
