import mongoose from "mongoose";

const feedbackSchema = mongoose.Schema({
    messno :{type:Number, required:true},
    id :{type:String, required:true},
    name :{type:String, required:true},
    mess :{type:String, required:true},
    postDate :{type:Date, default:Date.now},
    starCount : { type:Number, default:0 }
})


export default mongoose.model("Feedback",feedbackSchema)