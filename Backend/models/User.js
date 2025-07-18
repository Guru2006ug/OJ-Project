
const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        default:null,
        required:true
    },
    lastName:{
        type:String,
        default:null,
        required:true
    },
    email:{
        type:String,
        default:null,
        required:true,
        unique:true
    },
    password:{
        type:String,
        default:null,
        required:true
    },
});

module.exports=mongoose.model('User',userSchema);