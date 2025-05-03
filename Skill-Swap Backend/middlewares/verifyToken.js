import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const verifyToken = async (req, res, next) => {
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({message:'Unauthorized'});
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user=await User.findById(decoded.id);
        if(!user){
            return res.status(404).json({message:'User not found'});
        }
        req.user = user;
        next();
    }catch(error){
        console.error(error);
        return res.status(401).json({message:'Unauthorized'});
    }
}
export default verifyToken;