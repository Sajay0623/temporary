const express = require("express")
const jwt = require("jsonwebtoken")
const noterouter = express.Router()
const {NoteModel} = require("../model/note.model")

noterouter.get("/" , async (req,res) =>{

    let {min, max , device , device1 ,device2} = req.query
    console.log(device1, device2);
     
   
    const token = req.headers.authorization.split(" ")[1]
    let decoded = jwt.verify(token , "masai")
    if(decoded){
 
         if (min && max){
            let note = await NoteModel.find({$and: [{no_of_comments: {$lte :max}}, {no_of_comments :{$gte: min}}]})
            res.status(200).send(note)
         }else if (device){
            let note = await NoteModel.find( {device : device})
            res.status(200).send(note)
         }else if(device1 && device2){
            let note = await NoteModel.find( {$or: [{device : device1 }, {device : device2 }] } )  
            res.status(200).send(note)
         }
         else{
            let note = await NoteModel.find({userID: decoded.userID})
        res.status(200).send(note)
         }
 
         

        
    }else {
        res.status(400).send({msg:"No post from this user"})
    }
})

noterouter.post("/add" , async (req, res) =>{
    let body = req.body
    try{
     let note = new NoteModel(body)
     await note.save()
     res.status(200).send({msg:"Post has been done"})
    }catch(err){
  res.status(400).send({msg:err.message})
    }
})

noterouter.delete("/delete/:id" , async (req, res) =>{
    
 const token = req.headers.authorization.split(" ")[1]
 const decoded = jwt.verify(token, "masai")
 const noteID = req.params.id
 const reqID = decoded.userID
 const note = await NoteModel.findOne({_id: noteID})
 const userID_in_note = note.userID

 try{

    if(reqID ===   userID_in_note){
        await NoteModel.findByIdAndDelete({_id:noteID})
        res.status(200).send({msg:"post has been deleted"})
    }else{
        res.status(400).send({msg:"Not authorised"})
    }

 }catch(err){
    res.status(400).send({msg:err.message})
 }

})


noterouter.patch("/update/:id" , async (req, res) =>{
    
    const token = req.headers.authorization.split(" ")[1]
    const decoded = jwt.verify(token, "masai")
    const noteID = req.params.id
    const reqID = decoded.userID
    const note = await NoteModel.findOne({_id: noteID})
    const userID_in_note = note.userID
    const newData = req.body
   
    try{
   
       if(reqID ===   userID_in_note){
           await NoteModel.findByIdAndUpdate({_id:noteID}, newData)
           res.status(200).send({msg:"post has been updated"})
       }else{
           res.status(400).send({msg:"Not authorised"})
       }
   
    }catch(err){
       res.status(400).send({msg:err.message})
    }
   
   })


module.exports = {noterouter}