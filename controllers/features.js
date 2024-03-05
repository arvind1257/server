import  Jwt  from "jsonwebtoken"
import Amount from "../modules/amount.js"
import User from "../modules/auth.js"
import crypto from "crypto"

const algorithm = 'aes-256-cbc'; //Using AES encryption
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

export function encrypt(text) {
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { key: key, iv: iv.toString('hex'), encode: encrypted.toString('hex') };
}

export function decrypt(text) {
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
        const ex = await User.findOne({_id:id});
        if(mode!=="income"){
            if(type==="CASH"){
                const amt = parseInt(decrypt(ex.cash))-parseInt(amount);
                await User.updateOne({_id:id},{cash:encrypt(amt.toString())})
            }
            else{
                const amt = parseInt(decrypt(ex.acc))-parseInt(amount);
                await User.updateOne({_id:id},{acc:encrypt(amt.toString())})
            }
        }
        else{
            if(type==="CASH"){
                const amt = parseInt(decrypt(ex.cash))+parseInt(amount);
                await User.updateOne({_id:id},{cash:encrypt(amt.toString())})
            }
            else{
                const amt = parseInt(decrypt(ex.acc))+parseInt(amount);
                await User.updateOne({_id:id},{acc:encrypt(amt.toString())})
            }
        }
        const encodeNote = encrypt(note)
        const encodeAmount = encrypt(amount)
        await Amount.create({id:id,note:encodeNote,amount:encodeAmount,type:type,date:date,mode:mode})
        const ex1 = await User.findOne({_id:id});
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
    }catch(err){
        console.log(err)
    }
}

export const Display = async (req,res) => {
    const {id} = req.body;
    const fetchDate = new Date();
    fetchDate.setHours(0,0,0,0);
    fetchDate.setTime(fetchDate.getTime()-7776000000); 
    try{
        const ex = await Amount.find({id:id,date:{$gte:fetchDate}}).sort({date:-1});
        var ex1 = [];
        ex.map((items) => {
            ex1.push({_id:items._id,id:items.id,note:decrypt(items.note),amount:decrypt(items.amount),type:items.type,date:items.date,mode:items.mode})
        })
        res.status(200).json(ex1)
    }catch(err){
        console.log(err)
    }
}

export const Modify = async(req,res) => {
    const {_id,id,note,amount,type,date,mode} = req.body;
    try{
        const item = await Amount.findOne({_id:_id});
        const ex = await User.findOne({_id:id});
        var cash = parseInt(decrypt(ex.cash));
        var acc = parseInt(decrypt(ex.acc));
        if(item.mode==="income"){
            if(item.type==="CASH") cash = cash - parseInt(decrypt(item.amount));
            else acc = acc - parseInt(decrypt(item.amount));
        }
        else{
            if(item.type==="CASH") cash = cash + parseInt(decrypt(item.amount));
            else acc = acc + parseInt(decrypt(item.amount));
        }
        if(mode==="income"){
            if(type==="CASH"){
                const amt = parseInt(cash)+parseInt(amount);
                await User.updateOne({_id:id},{cash:encrypt(amt.toString()),acc:encrypt(acc.toString())})
            }
            else{
                const amt = parseInt(acc)+parseInt(amount);
                await User.updateOne({_id:id},{acc:encrypt(amt.toString()),cash:encrypt(cash.toString())})
            }
        }
        else{
            if(type==="CASH"){
                const amt = parseInt(cash)-parseInt(amount);
                await User.updateOne({_id:id},{cash:encrypt(amt.toString()),acc:encrypt(acc.toString())})
            }
            else{
                const amt = parseInt(acc)-parseInt(amount);
                await User.updateOne({_id:id},{acc:encrypt(amt.toString()),cash:encrypt(cash.toString())})
            }
        }

        await Amount.updateOne({_id:_id},{id:id,note:encrypt(note),amount:encrypt(amount),type:type,date:date,mode:mode})
        const ex1 = await User.findOne({_id:id});
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
     catch(err){
         console.log(err+" controllers")
     }
}
export const Delete = async(req,res) => {
    const {id} = req.body;
    try{
        const item = await Amount.findOne({_id:id});
        const ex = await User.findOne({_id:item.id});
        console.log(item);
        console.log(ex);
        if(item.mode!=="income"){
            if(item.type==="CASH"){
                const amt = parseInt(decrypt(ex.cash))+parseInt(decrypt(item.amount));
                console.log(amt);
                await User.updateOne({_id:ex._id},{cash:encrypt(amt.toString())});
            }
            else{
                const amt = parseInt(decrypt(ex.acc))+parseInt(decrypt(item.amount));
                console.log(amt);
                await User.updateOne({_id:ex._id},{acc:encrypt(amt.toString())});
            }
        }
        else{
            if(item.type==="CASH"){
                const amt = parseInt(decrypt(ex.cash))-parseInt(decrypt(item.amount));
                console.log(amt);
                await User.updateOne({_id:ex._id},{cash:encrypt(amt.toString())});
            }
            else{
                const amt = parseInt(decrypt(ex.acc))-parseInt(decrypt(item.amount));
                console.log(amt);
                await User.updateOne({_id:ex._id},{acc:encrypt(amt.toString())});
            }
        }
        await Amount.deleteOne({_id:id})
        const ex1 = await User.findOne({_id:item.id});
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
     catch(err){
         console.log(err+" controllers")
     }
}

export const Setting = async(req,res) => {
    const {id,fname, lname, gender, email, cashType, cash, acc } = req.body;
    try{
        await User.updateOne({_id:id},{fname:fname,lname:lname,gender:gender,cashType:cashType,cash:encrypt(cash),acc:encrypt(acc)})
        var ex = await User.findOne({_id:id})
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