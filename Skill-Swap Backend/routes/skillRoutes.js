import express from 'express';
import SkillPost from '../models/skillPost.js';
import verifyToken from '../middlewares/verifyToken.js';
const router = express.Router();

router.post('/skillpost',verifyToken, async(req, res)=>{
  console.log('hello from skill post route');
  
    const {
        skillName,
        type,
        skillDescription,
        requiredSkills,
        providedSkills
      } = req.body;
     
      
      try{
        if( !type){
            return res.status(400).json({message:'Please fill all the fields 1'});
        }
        if(type==='offer' && !requiredSkills){
            return res.status(400).json({message:'Please fill all the fields 2'});

        }
        if(type==='request' && !providedSkills){
            return res.status(400).json({message:'Please fill all the fields 3'});

        }
        const newSkillPost = new SkillPost({
            userId: req.user._id, 
            type,
            skillDescription,
            requiredSkills,
            providedSkills
        });
        await newSkillPost.save();
        return res.status(200).json({message:'skill posted successfully.', skill:{'skillName':skillName, 'type':type, 'skillDescription':skillDescription, 'requiredSkills':requiredSkills, 'providedSkills':providedSkills}});
      }catch(e){
        console.log(e);
        res.status(500).json({message:'Internal server error'});
      }
})
export default router;