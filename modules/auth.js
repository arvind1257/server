import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    fname :{type:String, required:true},
    lname :{type:String, required:true},
    gender :{type:String, required:true},
    email :{type:String, required:true},
    password :{type:String, required:true},
    userType :{type:String, default:"Free user"},
    joinedOn :{type:String, default:Date.now}, 
    cashType :{type:String, default:"₹"}
})

export default mongoose.model("User",userSchema)