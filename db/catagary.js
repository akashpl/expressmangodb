const mongoose = require('mongoose');

const UserData = new mongoose.Schema({
    uname:{
        type:String,
        required:true,
        unique:true
    },
    email:{type:String,required:true},
    phone:{type:String,required:true},
    age:{type:String,required:true},
    date:{type:Date,default:Date.now}
  });
  module.exports=mongoose.model("category",UserData);