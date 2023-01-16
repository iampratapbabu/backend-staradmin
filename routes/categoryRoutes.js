const express = require('express');
const categorycontroller = require('../controllers/categoryController')

const router = express.Router();

router.route('/')
.get(categorycontroller.getAllCategories)
.post(categorycontroller.uploadImage,categorycontroller.createCategory)


module.exports = router;

