const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const registerUser = asyncHandler(async(req,res)=>{
    const {username,email,password} = req.body;
    if(!username || !email || !password){
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    const userAvailable = await User.findOne({email});
    if(userAvailable){
        res.status(400);
        res.json({ error: "User already exists. Please proceed to Login" });
        throw new Error("User already exists");
    }
    // hashing password
    const hashedPassword = await bcrypt.hash(password,10); 
    const user = await User.create({
        username,
        email,
        password : hashedPassword,
    });
    if(user){
        res.status(201).json({_id:user.id,email:user.email,username:user.username});
    }
    else{
        res.status(400);
        throw new Error("User data is not valid");
    }
    console.log(`Hi ${user}`);
    // console.log("Hashed Password",hashedPassword);
});

const loginUser = asyncHandler(async(req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
        // req.flash('error', 'All fields are mandatory');
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const user = await User.findOne({email});
    // Comapre password and hashedpassword
    if(user){
        if(await bcrypt.compare(password,user.password)){
            
            res.cookie('user_id', user.id, { 
                httpOnly: true, 
                maxAge: 15 * 60 * 1000 
            });

            const accessToken = jwt.sign({
                user:{
                    username : user.username,
                    email: user.email,
                    id:user.id,
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn:"15m"}
            );
            res.json({username:user.username,user_id:user.id});
            res.status(200).json({accessToken})
        }else{
            res.status(401);
            res.json({ error: "Password is invalid" });
            throw new Error('Password invalid');
        }
    }else{
        // req.flash('error', 'Invalid email or password');
        res.status(401);
        res.json({ error: "User doesnot exists. Please proceed to Register" });
        throw new Error("User doesnot exist");
    }
});

const currentUser = asyncHandler(async(req,res)=>{
    res.json({message : "Register the user"});
});

module.exports = {registerUser,loginUser,currentUser};