import express from 'express';
import SkillPost from '../models/skillPost.js';
import verifyToken from '../middlewares/verifyToken.js';
const router = express.Router();

router.post('/skillpost',verifyToken, async(req, res)=>{
    const {
        skillName,
        type,
        description,
        requiredSkillsFromPeer,
        provideSkillsToPeer
      } = req.body;
      
      try{
        if(!skillName || !type){
            return res.status(400).json({message:'Please fill all the fields'});
        }
        if(type==='offer' && !requiredSkillsFromPeer){
            return res.status(400).json({message:'Please fill all the fields'});

        }
        if(type==='request' && !provideSkillsToPeer){
            return res.status(400).json({message:'Please fill all the fields'});

        }
        const newSkillPost = new SkillPost({
            userId: req.user._id, // Assuming you have user authentication middleware to set req.user
            skillName,
            type,
            description,
            ...(type === 'offer' && { requiredSkillsFromPeer }),
            ...(type === 'learn' && { provideSkillsToPeer })
        });
        await newSkillPost.save();
      }catch(e){
        console.log(e);
        res.status(500).json({message:'Internal server error'});
      }
})