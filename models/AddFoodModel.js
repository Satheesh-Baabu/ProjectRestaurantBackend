const mongoose=require('mongoose')

const AddFoodSchema = new mongoose.Schema({
  foodname: { type: String, required: true },
  vornv:{type:String,required:true},
  foodtype: { type: String, required: true },
  price: { type: Number, required: true },
  filename: { type: String, required: true },
  active:{type:Number,default:1}
});


const AddFoodModel = mongoose.model("FoodList", AddFoodSchema);

module.exports = AddFoodModel;
