const express = require("express")
const app = express()
app.use(express.json())
const {connection} = require("./db")
const {useerrouter} = require("./routes/user")
const {noterouter} = require("./routes/note")
const {auth} = require("./middleware/auth")
app.use("/users" , useerrouter)
app.use("/posts" , auth , noterouter )
app.listen(8080 , async () =>{
    try{    
        await connection
  console.log("connected to db");
        console.log("port is running on 8080");

    }catch(e){
        console.log(e);
    }
})