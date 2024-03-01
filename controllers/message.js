import  Jwt  from "jsonwebtoken"
import User from "../modules/auth.js"
import {decrypt} from "../controllers/features.js"

export const Post = async(req,res) => {
    const {id,mess} = req.body
    try{
        await User.findByIdAndUpdate(id,{$addToSet:{"message":[{"mess":mess}]}});
        const ex1 = await User.findOne({_id:id})
        var ex11 = {};
        ex11._id = ex1._id;
        ex11.fname = ex1.fname;
        ex11.lname = ex1.lname;
        ex11.gender = ex1.gender;
        ex11.email = ex1.gender;
        ex11.password = ex1.password;
        ex11.userType = ex1.userType;
        ex11.cashType = ex1.cashType;
        ex11.joinedOn = ex1.joinedOn;
        ex11.cash = decrypt(ex1.cash);
        ex11.acc = decrypt(ex1.acc);
        ex11.message = ex1.message;
        const token = Jwt.sign({ email:ex11.email,id:ex11._id},"test",{expiresIn:"1h"})
        res.status(200).json({result:ex11,token,message:"Details Added Successfully"})
    }   
    catch(err)
    {
        console.log(err+"controllers")
    }
}

export const Delete = async(req,res) => {
    const {_id,id} = req.body
    console.log({_id,id})
    try{
        await User.updateOne({_id:_id},{$pull:{"message":{"_id":id}}})
        const ex1 = await User.findOne({_id:_id})
        var ex11 = {};
        ex11._id = ex1._id;
        ex11.fname = ex1.fname;
        ex11.lname = ex1.lname;
        ex11.gender = ex1.gender;
        ex11.email = ex1.gender;
        ex11.password = ex1.password;
        ex11.userType = ex1.userType;
        ex11.cashType = ex1.cashType;
        ex11.joinedOn = ex1.joinedOn;
        ex11.cash = decrypt(ex1.cash);
        ex11.acc = decrypt(ex1.acc);
        ex11.message = ex1.message;
        const token = Jwt.sign({ email:ex11.email,id:ex11._id},"test",{expiresIn:"1h"})
        res.status(200).json({result:ex11,token,message:"Details Added Successfully"})
    }   
    catch(err)
    {
        console.log(err+"controllers")
    }
}
