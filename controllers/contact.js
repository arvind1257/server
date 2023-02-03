import  Jwt  from "jsonwebtoken"
import bcrypt from "bcryptjs"
import Feedback from "../modules/feedback.js"

export const Post = async(req,res) => {
    const {id,name,mess} = req.body
    try{
        const ex = await Feedback.find()
        const messno = ex.length+1
        await Feedback.create({id:id,name:name,mess:mess,messno:parseInt(messno)})
        res.status(200).json("Details Added Successfully")

    }   
    catch(err)
    {
        console.log(err+"controllers")
    }
}

export const Display = async (req,res) => {
    try{
        const ex = await Feedback.find().sort({messno:-1});
        res.status(200).json(ex)
    }catch(err){
        console.log(err)
    }
}