const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require("crypto"); 

const categorySchema = new mongoose.Schema({
    title:{
        type:String,
        required:['true',"Please provide title for category"]
    },
    body:{
        type:String,
        required:['true',"Please provide body for category"]
    },
    image:"String",
    photos:[]

});

categorySchema.pre('save',async function(next){
    console.log("this is pre function running from category model");
    // this.password=await bcrypt.hash(this.password,12);
    next();
});


const Category = mongoose.model('Category',categorySchema);

module.exports = Category;