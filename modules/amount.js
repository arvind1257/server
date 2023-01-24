import mongoose from "mongoose";

const amountSchema = mongoose.Schema({
    id :{type:String,required:true},
    note :{
        key:{type:Buffer,required:true},
        iv :{type:String,required:true},
        encode :{type:String,required:true}
    },
    amount :{
        key:{type:Buffer,required:true},
        iv :{type:String,required:true},
        encode :{type:String,required:true}
    },
    type :{type:String,required:true},
    date :{type:Date,required:true},
    mode :{type:String,required:true},
    
})

export default mongoose.model("Amount",amountSchema)