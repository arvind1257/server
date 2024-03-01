import  Jwt  from "jsonwebtoken"
import bcrypt from "bcryptjs"
import User from "../modules/auth.js"
import { encrypt,decrypt } from "./features.js"

export const usertype = async(req,res) => {
    const request = req.body;
    try{
        await User.updateOne({email:request.email},{userType:"Free user"})
        const ex = await User.findOne({email:request.email})
        var ex1 = {};
        ex1._id = ex._id;
        ex1.fname = ex.fname;
        ex1.lname = ex.lname;
        ex1.gender = ex.gender;
        ex1.email = ex.gender;
        ex1.password = ex.password;
        ex1.userType = ex.userType;
        ex1.cashType = ex.cashType;
        ex1.joinedOn = ex.joinedOn;
        ex1.cash = decrypt(ex.cash);
        ex1.acc = decrypt(ex.acc);
        ex1.message = ex.message;
        const token = Jwt.sign({ email:ex.email,id:ex._id},"test",{expiresIn:"1h"})
        res.status(200).json({result:ex1,token})
    }
    catch(err){
        console.log(err+" controllers")
    }
}

export const signup = async(req,res) => {
    const {fname , lname , gender , email , password } = req.body;
    console.log("fname="+fname)
    var amt = "0";
    try{
       const ex = await User.findOne({email});
        if(ex)
        {
            return res.status(200).json({ message:"User Already Exists.",status:"Error" })
        }
        const pass = await bcrypt.hash(password,12)
        const newUser = await User.create({fname:fname , lname:lname ,gender: gender ,email: email , password:pass,cash:encrypt(amt),acc:encrypt(amt) }) 
        const token = Jwt.sign({ email:newUser.email,id:newUser._id},"test",{expiresIn:"1h"})
        res.status(200).json({message:"Thank You, You have successfully registered",status:"Success",result:newUser,token})
    } 
    catch(err){
        console.log(err+" controllers")
    }
    
}

export const login = async(req,res) => {
    const { email , password } = req.body;
    try{
       const ex = await User.findOne({email});
        if(!ex)
        {
            return res.status(200).json({ message:"User Doesn't Exists.",status:"Error"})
        }
        const isPass = await bcrypt.compare(password,ex.password)
        if(!isPass){
            return res.status(200).json({ message:"Invalid Credentials",status:"Error" })
        }
        var ex1 = {};
        ex1._id = ex._id;
        ex1.fname = ex.fname;
        ex1.lname = ex.lname;
        ex1.gender = ex.gender;
        ex1.email = ex.gender;
        ex1.password = ex.password;
        ex1.userType = ex.userType;
        ex1.cashType = ex.cashType;
        ex1.joinedOn = ex.joinedOn;
        ex1.cash = decrypt(ex.cash);
        ex1.acc = decrypt(ex.acc);
        ex1.message = ex.message;
        const token = Jwt.sign({ email:ex.email,id:ex._id},"test",{expiresIn:"1h"})
        res.status(200).json({result:ex1,token})
    }
    catch(err){
        console.log(err+" controllers")
    }
} 