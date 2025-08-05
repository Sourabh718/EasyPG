const express=require('express');
const userRouter=express.Router();
const rootDir=require('../utils/pathUtils');
// const { getHomes } = require('../controllers/homes');

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
// userRouter.post('/home-booking/payment/:homeId/card-details', userController.postCardDetails)
module.exports=userRouter;