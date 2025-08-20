import express from 'express';
import SkillPost from '../models/skillPost.js';
import verifyToken from '../middlewares/verifyToken.js';
const router = express.Router();

router.post('/postskill',verifyToken, async(req, res)=>{
    const {
      
        type,
        skillDescription,
        requiredSkills,
        providedSkills,
        barterDateTime
      } = req.body;
     try{
        if(!type){
            return res.status(400).json({message:'Please fill all the fields 1'});
        }
        if(type==='offer' && !requiredSkills){
            return res.status(400).json({message:'Please fill all the fields 2'});

        }
        if(type==='request' && !providedSkills){
            return res.status(400).json({message:'Please fill all the fields 3'});
        }
        const newSkillPost = new SkillPost({
            userId: req.user._id?req.user._id:req.user.id, 
            type,
            skillDescription,
            requiredSkills,
            providedSkills,
            barterDateTime,
            status: "pending",
        });
        await newSkillPost.save();
        return res.status(200).json({message:'skill posted successfully.', skill:newSkillPost});
      }catch(e){
        console.log(e);
        res.status(500).json({message:'Internal server error'});
      }
});
router.get('/allskillposts', async (req, res) => {

  const posts = await SkillPost.find({status:'pending'}).populate('userId', 'name email');
  console.log(posts);
  
  res.status(200).json(posts);
});
//protected route
router.get('/my-skillposts', verifyToken, async (req, res) => {
  try{

    const posts = await SkillPost.find({ userId: req.user.id?req.user.id:req.user._id });
    if(!posts){
    return res.status(404).json({message:"No Skill Post Found!"});
  }
  console.log("posts: ",posts);
  
 return res.status(200).json({"posts":posts});
  }catch(error){
    return res.status(500).json({message:error})
  }
  // const past = await SkillPost.find({ userId: req.user.id?req.user.id:req.user._id, status: "accepted" });
  
});

router.get('/skillpost/:id', async (req, res) => {
  try {
     const skillPost = await SkillPost.findById(req.params.id).populate('userId', 'name email');
    if (!skillPost) {
      return res.status(404).json({ message: 'Skill post not found' });
    }
    return res.status(200).json(skillPost);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.put('/editpost/:id', async (req, res) => {
  try {
    const {id} = req.params;
     const {
        type,
        skillDescription,
        requiredSkills,
        providedSkills,
        barterDateTime
      } = req.body;
     const skillPost = await SkillPost.findByIdAndUpdate(id, {type,
            skillDescription,
            requiredSkills,
            providedSkills,
            barterDateTime,})
    if (!skillPost) {
      return res.status(404).json({ message: 'Skill post not updated!' });
    }
    return res.status(200).json(skillPost);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.get('/editpost/:id', async(req, res)=>{
  try {
    const {id} = req.params;
    const post = await SkillPost.findById(id);
    if(!post){
      return res.status(404).json({ message: 'Skill post not Found!' })
    }
    return res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
})

router.delete('/deletepost/:id', verifyToken, async(req,res)=>{
  try {
    const {id} = req.params;
    const skilldeleted = await SkillPost.findByIdAndDelete(id);
    if(!skilldeleted){
      return res.status(404).json({ message: 'Skill post not updated!' });
    }
    return res.status(200).json(skilldeleted);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
})

export default router;