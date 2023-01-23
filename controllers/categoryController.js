const Category = require('../models/categoryModel');
const multer = require('multer');
const fs=require('fs')

const myfun1 = (req,res) =>{
	console.log("myfun 1 is working");
	res.send("My fun 1 is working");
}

const myfun = (req,res) =>{
	myfun1(req,res);
	res.send("My fun is working");
}

const getAllCategories = async(req,res) =>{
	try{
		const categories = await Category.find();
		if(!categories) return res.status(400).json({msg:"No Category Found"});
		return res.status(200).json({
			categories
		});
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
uploadImage = upload.single('file');

const createCategory = async(req,res) =>{
	try{
		//console.log("received from frontend",req.body.file);
		
		const {title,body} = req.body;
		console.log("received from form",req.body,title,req.body.body);
		const category = new Category({
			title,body,
			image:req.file.path
		});
		await category.save();
		return res.status(200).json({
			category
		})
	}catch(err){
		res.status(500).json({
        error:"manual error message [SERVER ERROR]",
        errormsg:err.message
      });
	}
}

const getSingleCategory = async (req,res) =>{
	try{
		const category = await Category.findById(req.params.id);
		if(!category) return res.status(400).json({msg:"Category Not found"});
		return res.status(200).json({
			category
		})
	}catch(err){
		res.status(500).json({
        error:"manual error message [SERVER ERROR]",
        errormsg:err.message
      });
	}
}

const deleteSingleCategory = async (req,res) =>{
	try{
		const category = await Category.findByIdAndDelete(req.params.id);
		if(!category) return res.status(400).json({msg:"Category Not found"});
			return res.status(200).json({
			msg:"Category Delete successfully"
		})
	}catch(err){
		res.status(500).json({
        error:"manual error message [SERVER ERROR]",
        errormsg:err.message
      });
	}
}

module.exports = {myfun,getAllCategories,createCategory,uploadImage,getSingleCategory,deleteSingleCategory};