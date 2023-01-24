import  Jwt  from "jsonwebtoken"
import Amount from "../modules/amount.js"
import User from "../modules/auth.js"
import crypto from "crypto"

const algorithm = 'aes-256-cbc'; //Using AES encryption
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

function encrypt(text) {
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { key: key, iv: iv.toString('hex'), encode: encrypted.toString('hex') };
}

function decrypt(text) {
    let iv2 = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.encode, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(text.key), iv2);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

export const Add = async(req,res) => {
    const {id,note,amount,type,date,mode} = req.body
    try{
        const encodeNote = encrypt(note)
        const encodeAmount = encrypt(amount)
        await Amount.create({id:id,note:encodeNote,amount:encodeAmount,type:type,date:date,mode:mode})
        res.status(200).json("Details Added Successfully")
    }   
    catch(err)
    {
        console.log(err+"controllers")
    }
}

export const Display = async (req,res) => {
    const {id} = req.body;
    try{
        const ex = await Amount.find({id:id}).sort({date:-1});
        var ex1 = [];
        ex.map((items) => {
            ex1.push({id:items.id,note:decrypt(items.note),amount:decrypt(items.amount),type:items.type,date:items.date,mode:items.mode})
        })
        res.status(200).json(ex1)
    }catch(err){
        console.log(err)
    }
}

export const Modify = () => {}
export const Delete = () => {}

export const Setting = async(req,res) => {
    const {id, name, gender, email, cashType } = req.body;
    try{
        await User.updateOne({email:email},{name:name,gender:gender,cashType:cashType})
        const ex = await User.findOne({email})
        const token = Jwt.sign({ email:ex.email,id:ex._id},"test",{expiresIn:"1h"})
        res.status(200).json({result:ex,token})
     }
     catch(err){
         console.log(err+" controllers")
     }
} 