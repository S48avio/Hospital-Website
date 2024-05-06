const mongoose = require('mongoose');
const connect = mongoose.connect('mongodb+srv://sab.net/');
connect.then(()=>{
    console.log("Database connection established");
})
.catch(()=>{
    console.log("Database connection is not established");
})


//create schema
const LoginSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },

})
//collection Part

const collection = new mongoose.model('users',LoginSchema);
console.log(collection);

module.exports= collection;


//mongodb+srv://saviosunny48:2TJsNwpNwqJX2aG3@cluster0.0zmwv1l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
