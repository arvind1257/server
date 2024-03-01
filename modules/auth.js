import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    fname :{type:String, required:true},
    lname :{type:String, required:true},
    gender :{type:String, required:true},
    email :{type:String, required:true},
    password :{type:String, required:true},
    userType :{type:String, default:"Free user"},
    joinedOn :{type:String, default:Date.now}, 
    cashType :{type:String, default:"₹"},
    cash :{
        key:{type:Buffer,required:true},
        iv :{type:String,required:true},
        encode :{type:String,required:true}
    },
    acc :{
        key:{type:Buffer,required:true},
        iv :{type:String,required:true},
        encode :{type:String,required:true}
    },
    message: [
        {
            mess:{type:String},
            postedOn:{type:Date,default:new Date()}
        }
    ],
})

export default mongoose.model("User",userSchema)