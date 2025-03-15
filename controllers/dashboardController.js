const SignInModel =require('../models/SignInModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel=require('../models/User')
const OrderModel=require('../models/OrderModel')

const secretkey = process.env.SECRET_KEY;

exports.signin=async(req,res)=>{
    
    try{
        const {username,pass}=req.body;
        // console.log(req.body)
        const hashpass=await bcrypt.hash(pass,10)
        const users=new SignInModel({
            username:username,
            password:hashpass
        })
        await users.save()
        res.status(200).json("User created successfully")
        console.log(users)
    }
    catch(err)
    {
        res.status(500).json("Error in create user")
    }
}

exports.login=async(req,res)=>{
    try{
        
        const {username,pass}=req.body;
        const user=await SignInModel.findOne({username:username})
        console.log(user)
        if(!user) 
            return res.status(401).json("No user found")

        const validatePassword= await bcrypt.compare(pass,user.password)
        console.log(validatePassword)
        if(!validatePassword)
            return res.status(401).json("Password is incorrect")
        const token=jwt.sign({username:user.username},secretkey)
        console.log(token)
        res.status(200).json({ token });
    }
    catch(err){
        res.status(500).json("Failed to Login")
    }
}

exports.dashboard=async(req,res)=>{
    res.send(`Welcome ${req.user.username}`)

}

exports.addUser = async (req, res) => {
    const { name, email, password,role} = req.body;
  
    try {
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) return res.status(400).json({ message: "Email already exists" });
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new UserModel({ name, email, password: hashedPassword,role });
      await newUser.save();
  
      res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

exports.getUsers=async(req,res)=>{
    try{
        const users = await UserModel.find();
        res.json(users);
    } 
    catch (err) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
    
}

exports.getCount=async(req,res)=>{
    try{
        const users=await UserModel.find({role:"user"});
        const userCount=users.length;
        const supplier=await UserModel.find({role:"supplier"});
        const supplierCount=supplier.length;
        const chef=await UserModel.find({role:"chef"});
        const chefCount=chef.length;

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const orders = await OrderModel.find({
            created_at: { $gte: startOfDay, $lte: endOfDay } });
        const orderCount=orders.length;
        res.json({user:userCount,supplier:supplierCount,chef:chefCount,order:orderCount});
    }
    catch(err)
    {
        res.status(500).json({error:"Failed to get count details"})
    }
}


exports.getorders=async(req,res)=>{
    try{
        const orders=await OrderModel.find()
        .populate({path:"items.food_id",select:"foodname price vornv foodtype filename"})

        if(!orders.length)
            return res.status(404).json({message:"No orders found"});
        res.status(201).json({orders})
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({message:"Failed to fetch orders"});
    }
}