const express = require("express")
const { UserModel } = require("../model/user.model")
 const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const useerrouter = express.Router()

useerrouter.post("/register", async (req, res) =>{
    const {name ,email ,gender ,password ,age ,city ,is_married} = req.body
 
     const check = await UserModel.findOne({email})
     
      if(check){
        res.status(400).send({msg:"User is already register"})
      }else{
         
         
        try{
           
            bcrypt.hash(password, 5 , async (err , hash) =>{
                const user = new UserModel({name ,email ,gender ,password:hash ,age ,city ,is_married})
                await user.save()
                res.send({msg: "Registration has been done"})
            } ) 
    
        }catch(e){
            res.status()
        }
         

      }

  
} )


useerrouter.post("/login", async (req, res) =>{
   const {email, password} = req.body
   try{
           const user = await UserModel.findOne({email})
           if(user){
             bcrypt.compare(password, user.password , (err, result) =>{
                if(result){
                    res.send({msg:"Login has been done" , "token" : jwt.sign({userID:user._id}, "masai")})
                }else{
                    res.status(400).send({msg:"Login Failed"})
                }
             })
           } 
   }catch(err){
    res.status(400).send({msg:err.message})
   }
} )

module.exports = {useerrouter}

