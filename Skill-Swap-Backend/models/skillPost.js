import mongoose from 'mongoose';

const skillPostSchema= mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type:{
        type:String,
        enum:['offer','request'],
        required:true
    },
    skillDescription:{
        type:String,
        required:true
    },
    requiredSkills:{
        type:String,
        required:true
    },
    providedSkills:{
        type:String,
        required:true
    },
     barterDateTime: {
        type: Date,
        required: true 
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    status:{
    type: String,
    enum:['pending', 'accepted'],
    default: 'pending'
    },
})
export default mongoose.model('SkillPost', skillPostSchema);