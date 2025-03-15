const express = require('express');
const { addFood, getFoodList, updateFood,deleteFood } = require('../controllers/foodController');
const multer = require('../middleware/multer');

const router = express.Router();

router.post('/addfood', multer.single('file'), addFood);
router.get('/foodlist', getFoodList);
router.put('/foodlist/:id', updateFood);
router.delete('/foodlist/:id',deleteFood);

module.exports = router;
