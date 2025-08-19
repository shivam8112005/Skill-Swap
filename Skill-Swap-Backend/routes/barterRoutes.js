import express from 'express';
import verifyToken from '../middlewares/verifyToken.js';
import BarterRequest from '../models/barterRequest.js';
import SkillPost from '../models/skillPost.js';


const router = express.Router();

router.get('/getBarter', async (req, res) => {
    try {
        const barter = await SkillPost.find({status:'pending'})
        if (barter) {
            return res.status(200).json({status: 200, barter: barter})
        }
        else {
            return res.status(404).json({status: 404, barter: []})
        }
    } catch (error) {
        console.log(error)        
    }
})

router.post('/request', verifyToken, async (req, res) => {
    const { receiverId, senderSkillPostId, receiverSkillPostId, newSkillPost } = req.body;
    try {
        let finalSenderSkillPostId = senderSkillPostId;
        if (!senderSkillPostId && newSkillPost) {
            const {    
            type,
            skillDescription,
            requiredSkills,
            providedSkills,
            barterDateTime } = newSkillPost;

            if (!title || !description || !category) {
                return res.status(400).json({
                    message: 'Title, description, and category are required for creating a skill post.'
                });
            }
            const newSkillPost = new SkillPost({
                userId: req.user._id,
                type,
                skillDescription,
                requiredSkills,
                providedSkills,
                barterDateTime
            });
            const savedSkillPost = await newSkillPost.save();
            finalSenderSkillPostId = savedSkillPost._id;
        }
        if (!finalSenderSkillPostId) {
            return res.status(400).json({
                message: 'Either provide an existing skill post ID or skill post details to create a new one.'
            });
        }
        const existing = await BarterRequest.findOne({
            sender: req.user._id? req.user._is:req.user.id,
            receiver: receiverId,
            senderSkillPost: finalSenderSkillPostId,
            receiverSkillPost: receiverSkillPostId,
            status: 'pending'
        });

        if (existing) {
            return res.status(409).json({
                message: 'You have already sent a request to this user for this barter.'
            });
        }
        const newReq = new BarterRequest({
            sender: req.user._id? req.user._id:req.user.id,
            receiver: receiverId,
            senderSkillPost: finalSenderSkillPostId,
            receiverSkillPost: receiverSkillPostId,
            acceptedAt:null,
        });

        await newReq.save();
        return res.status(200).json({
            message: 'Barter request sent successfully.',
            senderSkillPostId: finalSenderSkillPostId,
            wasSkillPostCreated: !senderSkillPostId
        });

    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: 'Internal server error' });
    }
});


router.post('/respond-barter', verifyToken, async (req, res) => {
    const { barterRequestId, response } = req.body;
    if (!['accepted', 'rejected'].includes(response)) {
        return res.status(400).json({ message: 'Invalid response' });
    }
    try {
        const request = await BarterRequest.findById(barterRequestId);
        if (!request) {
            return res.status(404).json({ message: 'Barter request not found' });
        }
        if (request.receiver.toString() !== req.user._id.toString())
            return res.status(403).json({ message: 'You are not authorized to respond to this request.' });
        request.status = response;
        await request.save();
        return res.status(200).json({ message: `Barter request ${response} successfully.` });

    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/my-requests', verifyToken, async (req, res) => {
    try {
        const sent = await BarterRequest.find({ sender: req.user.id? req.user.id: req.user._id })
            .populate('receiver', 'name email').populate('sender', 'name email')
            .populate('senderSkillPost')
            .populate('receiverSkillPost');
        const requests = await BarterRequest.find({ receiver: req.user.id? req.user.id: req.user._id}).populate('receiver', 'name email').populate('senderSkillPost').populate('receiverSkillPost').populate('sender', 'name email');
        // console.log("received: ",requests);
        // console.log("Id: ", req.user.id);
        
        return res.status(200).json({ requests, sent });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
// router.get('/active-barter', verifyToken, async (req, res) => {
//     try {
//         const requests = await BarterRequest.find({
//             $or: [
//                 { sender: req.user._id, status: 'accepted' },
//                 { receiver: req.user._id, status: 'accepted' }
//             ]
//         })
//             .populate('sender', 'name email')
//             .populate('receiver', 'name email')
//             .populate('senderSkillPost')
//             .populate('receiverSkillPost');

//         return res.status(200).json({ requests });
//     } catch (e) {
//         console.log(e);
//         return res.status(500).json({ message: 'Internal server error' });
//     }
// });


router.put('/request/:id', async (req, res) => {
//   const { id } = req.params;
//   const { status } = req.body;

//   try {
//     const request = await BarterRequest.findByIdAndUpdate(
//       id,
//       { status },
//       { new: true }
//     );

//     if (!request) {
//       return res.status(404).json({ message: "Request not found" });
//     }

//     res.json(request);
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }


const { id } = req.params;
  const { status } = req.body;

  try {
    const request = await BarterRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = status;
    if (status === 'accepted') {
      request.acceptedAt = new Date();
       await SkillPost.findByIdAndUpdate(request.senderSkillPost, { status: 'accepted' });
      await SkillPost.findByIdAndUpdate(request.receiverSkillPost, { status: 'accepted' });
    }

    await request.save();

    res.json(request);
  } catch (error) {
    console.error("Error updating request:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get('/active',verifyToken, async (req, res) => {
  try {
//     const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000); // 3 days in milliseconds

//   const activeBarters = await BarterRequest.find({
//   status: "accepted",
//   $or: [
//     { sender: req.user.id ? req.user.id:req.user._id },
//     { receiver: req.user.id ? req.user.id:req.user._id }
//   ]
// })
//   .populate("senderSkillPost")
//   .populate("receiverSkillPost")
//   .populate("sender")
//   .populate("receiver");

const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

const activeBarters = await BarterRequest.find({
  status: "accepted",
  createdAt: { $gte: threeDaysAgo },
  $or: [
    { sender: req.user.id ? req.user.id : req.user._id },
    { receiver: req.user.id ? req.user.id : req.user._id }
  ]
})
  .populate("senderSkillPost")
  .populate("receiverSkillPost")
  .populate("sender")
  .populate("receiver");
console.log("activebarters: ",activeBarters);

   return res.json(activeBarters);
  } catch (error) {
    console.error("Error fetching active barters:", error);
   return res.status(500).json({ message: "Server error" });
  }
});
//quick match, negotiate, and cancel barter request

export default router;