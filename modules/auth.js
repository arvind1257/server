import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name :{type:String, required:true},
    dob :{type:Date, required:true},
    gender :{type:String, required:true},
    email :{type:String, required:true},
    password :{type:String, required:true},
    userType :{type:String, default:"First Login"},
    joinedOn :{type:String, default:Date.now}, 
    cashType :{type:String, default:"inr"}
})

export default mongoose.model("User",userSchema)