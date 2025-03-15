const AddFoodModel = require('../models/AddFoodModel');

exports.addFood = async (req, res) => {
    try {
        const { foodname,vornv, foodtype, price} = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "File upload is required" });
        }

        const filename = req.file.filename;

        const newFood = new AddFoodModel({
            foodname,
            vornv,
            foodtype,
            price,
            filename,
        });

        await newFood.save();
        res.status(201).json({ message: 'Food added successfully', food: newFood });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add food' });
    }
};

exports.getFoodList = async (req, res) => {
    try {
        const foods = await AddFoodModel.find();
        res.json(foods);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch results" });
    }
};

exports.updateFood = async (req, res) => {
    try {
        const { id } = req.params;
        const { active } = req.body;

        const updateFood = await AddFoodModel.findByIdAndUpdate(
            id, { active }, { new: true }
        );

        if (!updateFood) {
            return res.status(404).json({ message: "Food not found" });
        }

        res.json({ message: "Food updated successfully", food: updateFood });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update food" });
    }
};

exports.deleteFood=async(req,res)=>{
    try{
        const {id}=req.params;
        await AddFoodModel.findOneAndDelete(id);
        res.json({ message: "Food deleted Successfully" });
    }
    catch(error)
    {
        console.log(error);
        res.status(500).json({error:"Error in food deletion"});
    }    
}
