const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('path');
const multer = require('multer');
const fs=require('fs')


//user functions
const getAll = async (next) =>{
    const users = await User.find().select('+password +confirmpassword');
    console.log(users);
}

exports.getAllUsers = async(req,res)=>{
    try{
      const users = await User.find();
      res.status(200).json({
        total:users.length,
        users
      });
    }catch(err){
      res.status(500).json({
        "error":"manual error message",
        "error msg":err.message
      });
    }  
}

exports.signup = async(req,res)=>{
    try{
        console.log(req.body);
        const {name,email,password} = req.body;
        if(req.body.password != req.body.confirmPassword){
            res.status(400).json({errormsg:"Password do not match"});
        }else{

            // const user =  await User.create({
            //     name:req.body.name,
            //     email:req.body.email,
            //     password:req.body.password,
            // });
            user = new User({
                name,
                email,
                password
            });
            const salt = await bcrypt.genSalt(12);
            user.password = await bcrypt.hash(password,salt);
            //console.log("user created",user);
            await user.save();
    
        var token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: 86400 // expires in 24 hours
        });
    
        res.status(200).json({
            auth:true,
            token,
            user,
        });
        }


    }catch(err){
      res.status(500).json({
        error:"manual error message",
        errormsg:err.message
      });
    }  
}

exports.login = async(req,res)=>{
    try{
        console.log(req.body);
        //getAllUsers(next);
        //getMe(req,res,next);

        const user = await User.findOne({email:req.body.username}).select('+password +confirmpassword');
        console.log("user found is",user);
       
        if(!user || !(await user.correctPassword(req.body.password,user.password))){
                return res.status(403).json({
                    status:"fail",
                    message:"email or password is incorrect"
                });
        }
        var token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: 86400 // expires in 24 hours
        });
        return res.status(200).json({auth:true,token,user});

        // if(user.password == req.body.password){
        //     var token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
        //         expiresIn: 86400 // expires in 24 hours
        //     });
        //     return res.status(200).json({auth:true,token});
        // }else{
        //     return res.status(400).json({auth:false,message:"wrong credentials"});
        // }

    }catch(err){
      res.status(500).json({
        error:"manual error message",
        errormsg:err.message
      });
    }  
}

exports.protect = async(req,res)=>{
    try{
        let token = req.headers['x-access-token'];
        console.log(token);
        if(!token){
            res.status(401).json({auth:false,message:"Failed to Authenticate"});
        }
    
        jwt.verify(token, process.env.JWT_SECRET_KEY , (err, decoded) => {
            if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
    
            User.findById(decoded.id, (err, user) => {
                if (err) return res.status(500).json({auth:false,messge:"There was a problem finding the user."});
                if (!user) return res.status(404).json({auth:false,message:"No user found"});
                res.status(200).json({
                    auth:true,
                    user
                });
            });
        });
    }catch(err){
      res.status(500).json({
        error:"manual error message",
        errormsg:err.message
      });
    }  
}

exports.getProfile = async(req,res) =>{
    //res.send(req.params.id);
    try{
        const user = await User.findById(req.params.id);
        if(!user){
            res.status(404).json({
                msg:"Profile Not Found",
            });
        }else{
            res.status(200).json({
                msg:"Profile Found",
                user
            });
        }

    }catch(err){
        res.status(500).json({
            error:"This is manual error message",
            errormsg:err.message
        })
    }
}

exports.updateProfile = async(req,res) =>{
    //res.send(req.params.id);
    const user = await User.findById(req.params.id);
    const {fname,lname,dob,gender,address1,address2,state,city,country,postcode,free,professional,phone,role} = req.body;
    user.fname = fname;
    user.lname = lname;
    user.dob = dob;
    user.role=role;
    user.gender = gender;
    user.address2 = address2;
    user.address1 = address1;
    user.phone=phone;
    user.city = city;
    user.state=state;
    user.country = country;
    user.postcode = postcode;
    user.free = free;
    user.professional = professional;
    await user.save();

    res.status(200).json({
        msg:"Updated Successfully",
        user
    })
}

exports.changePassword = async(req,res)=>{
    //res.status(200).send(req.params.id);
    try{
        console.log(req.params.id)
        const user = await User.findById(req.params.id).select('+password');
        if(!user || !(await user.correctPassword(req.body.oldPassword,user.password))){
                return res.status(403).json({
                    status:"fail",
                    msg:"old Password is incorrect"
                });
        }
        if(req.body.newPassword != req.body.confirmNewPassword){
            return res.status(400).json({
                msg:"Password Not Matches"
            })
        }
        console.log("previous password",user.password);
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(req.body.newPassword,salt);
        console.log("updated password",user.password);
        await user.save();
        return res.status(200).json({
            msg:"Password Updated"
        })


    }catch(err){
        res.status(500).json({
        error:"manual error message [SERVER ERROR]",
        errormsg:err.message
      });
    }
}

//image uploading
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // directory to check if exists
    const dir = './uploads'
    // check if directory exists
    if (!fs.existsSync(dir)) {
      fs.mkdir("./uploads", function(err) {
        if (err) {
          console.log(err)
        } else {
          console.log("New directory successfully created.")
        }
      })
    }
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "_") + "_" + file.originalname
    );
  },
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if(allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
    console.log("file filter runs")
}

let upload = multer({storage:fileStorage,fileFilter:fileFilter})
exports.uploadImage = upload.single('file');

exports.changeImage = async(req,res) =>{
    try{
        console.log("received from frontend",req.file);
        const user = await User.findById(req.params.id);
        if(!user) return res.status(404).json({msg:"User Not Exist"});
        console.log("file from request",req.file)
        //upload.single('photo');
        user.photo=req.file.path;
        await user.save();
        return res.status(200).json({
            msg:"Image updated",
            photo:user.photo
        })
    }catch(err){
        res.status(500).json({
        error:"manual error message [SERVER ERROR]",
        errormsg:err.message
      });
    }
}

exports.createUser = async(req,res) =>{
    try{
        const {fname,lname,email,password} = req.body;
        const user = new User({
            fname,
            //city:fname, filling other key that is not same with req.body
            lname,
            email,
            password
        });
        user.role = "user";
        user.createdBy = req.params.id;
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(password,salt);
        //console.log("user created",user);
        await user.save();

        var token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: 86400 // expires in 24 hours
        });
    
        res.status(200).json({
            auth:true,
            token,
            user,
        });


    }catch(err){
        res.status(500).json({
        error:"manual error message [SERVER ERROR]",
        errormsg:err.message
      });
    }
}

exports.deleteUser = async (req,res)=>{
    try{
        const user = await User.findByIdAndDelete(req.params.id);
        if(!user) return res.status(404).json({msg:"user not found"});
        return res.status(200).json({
            msg:"user deleted"
        })

    }catch(err){
        res.status(500).json({
        error:"manual error message [SERVER ERROR]",
        errormsg:err.message
      });
    }
}


