import express from 'express';
import { registerUser } from '../controllers/userController.js';
import User from '../models/userModel.js';
import verifyToken from '../middlewares/verifyToken.js';
const router = express.Router();
router.post('/register', registerUser);
router.get('/userprofile', verifyToken, async(req, res) => {
   const userId=req.user.id?req.user.id:req.user._id;
  console.log("user Id: ", userId);
  
    const user = await User.findById( userId);
    console.log(user);
    
    
    return res.status(200).json({ user: user })
})
router.put('/profileUpdate', verifyToken, async (req, res) => {
  try {
    const { skills, available, private: isPrivate } = req.body;
    const userId=req.user.id?req.user.id:req.user._id;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        skills: skills || [],
        available: available || [],
        private: isPrivate || false,
      },
      { new: true, runValidators: true }
    ).lean();

    return res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Profile update error:", err.message);
    return res.status(500).json({ message: "Failed to update profile" });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token",{
    secure: true,
    sameSite: "None",
    path: "/",     
  });
  const res1=res.status(200).json({ message: "Logged out successfully" });
  console.log(res1, " sjfbseiubfuewbj hiiiiiiiiiiiiiiiiiiii");
  
});

router.get('/profile/:id',async(req,res)=>{
  try{

    const id=req.params.id;
    const user=await User.findById(id);
     if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If user is private, don't return data (unless it’s the same logged-in user)
    if (user.private) {
      return res.status(403).json({ message: 'This user profile is private' });
    }
     return res.status(200).json(user);
  }catch(e){
    res.status(500).json({ message: 'Server error', e });
  }


})
export default router;