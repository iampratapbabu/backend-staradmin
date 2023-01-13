const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require("crypto"); 

const userSchema = new mongoose.Schema({
    fname:{
        type:String,
    },
    lname:{
        type:String,
    },
    gender:{
        type:String,
    },
    dob:{
        type:String,
    },
    address1:{
        type:String,
    },
    address2:{
        type:String,
    },
    phone:String,
    state:{
        type:String,
    },
    city:{
        type:String,
    },
    postcode:{
        type:String,
    },
    country:{
        type:String,
    },
    free:{
        type:Boolean,
    },
    professional:{
        type:Boolean,
    },
    photo:String,
    role:{
        type:String,
        enum:['user','developer','admin'],
        default:'admin'
  },
    email:{
        type:String,
        unique:true,
        required:[true,"Please Provide your email"]

    },
    password:{
        type:String,
        required:[true,"password is required"],
        select:false,
    },
    confirmpassword:{
        type:String,
        
        select:false,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Password Do Not Match",
    },

    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId
    }

});

userSchema.pre('save',async function(next){
    console.log("this is pre function running");
    // this.password=await bcrypt.hash(this.password,12);
    next();
});

userSchema.methods.correctPassword = async function(candidatePassword,userPassword){
  return await bcrypt.compare(candidatePassword,userPassword)
};

const User = mongoose.model('User',userSchema);

module.exports = User;