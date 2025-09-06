const express=require('express');
const userRouter=express.Router();
const rootDir=require('../utils/pathUtils');
const { check } = require('express-validator');

const userController = require('../controllers/userController');

// userRouter.get("/",userController.getIndex);
userRouter.get("/home-list",userController.getHomes);
userRouter.get('/booking', userController.getbooking);
userRouter.get('/watchlist',userController.getFavourites);
userRouter.get('/home/details/:homeId',userController.getHomeDetails);
userRouter.post('/watchlist',userController.postAddToFavourites);
userRouter.post('/remove-favourite/:homeId',userController.postRemoveFromFavourites);
userRouter.get('/home-booking/payment/:homeId', userController.getPayment);
userRouter.get('/home-booking/payment/:homeId/card-details', userController.getCardDetails);
userRouter.get('/about-us',userController.getAbout);
userRouter.get('/contact-us',userController.getContact);
userRouter.post('/contact-us',userController.postContact);
userRouter.get('/my-profile',userController.getProfile);
userRouter.post('/my-profile', [
     check('username')
    .trim()
    .isLength({min:2})
    .withMessage('username should be atleast 2 character')
    .matches(/^[A-Za-z\s]+$/)
    .withMessage('name should contaion only alphabet'),

    check('email')
    .isEmail()
    .withMessage('enter a valid email')
    .normalizeEmail(),

    check('mobileNo')
    .isMobilePhone('en-IN')
    .withMessage('enter a valid mobile number'),
], userController.updateProfile);
userRouter.post('/delete-account',userController.postDeleteAccount);
userRouter.post('/home-booking/payment/:homeId/card-details', userController.postCardDetails);

module.exports=userRouter;