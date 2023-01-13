const express = require('express');
const userController = require('../controllers/userController')

const router = express.Router();

router.route('/')
    .get(userController.getAllUsers)

router.route('/login')
    .post(userController.login)

router.route('/signup')
    .post(userController.signup)

router.route('/protect')
    .get(userController.protect);

router.route('/profile/:id')
    .get(userController.getProfile)
    .patch(userController.updateProfile)
    .delete(userController.deleteUser)
    .post(userController.createUser);

router.route('/changepassword/:id')
    .patch(userController.changePassword);

router.route('/change-image/:id')
    .patch(userController.uploadImage,userController.changeImage);




module.exports = router;