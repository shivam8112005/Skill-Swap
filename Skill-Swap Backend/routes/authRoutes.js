import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/register', async(req, res) => {
    const {name, email, password, skills} = req.body;
    try{
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const salt= await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser=new User({name, email, password: hashedPassword, skills});
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: "2w"
          });
        // res.status(201).json({token,message: 'User registered successfully'});
        res.status(201).json( {token, message:'Register successful', user: { id: newUser._id, name: newUser.name, email: newUser.email }});
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
router.post('/login', async(req, res)=>{
    const {email, password}=req.body;
    const userExist=await User.findOne({email});
    if(!userExist){
       return res.status(404).json({message:' user not found'});
    }
    const isMatch = await bcrypt.compare(password, userExist.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: userExist._id }, process.env.JWT_SECRET, {
        expiresIn: "2w"
      });
    res.status(200).json( {token, message:'Login successful', user: { id: userExist._id, name: userExist.name, email: userExist.email }});
})
export default router;