const express=require('express');
const hostRouter=express.Router();
const path=require('path')
const rootDir=require('../utils/pathUtils');
const hostController = require('../controllers/hostController');

hostRouter.get("/add-home", hostController.getAddHome);
hostRouter.post("/add-home",hostController.postAddHome);
hostRouter.get('/home-list',hostController.getHostList);
hostRouter.get("/edit-home/:homeId",hostController.getEditHome);
hostRouter.post("/edit-home",hostController.postEditHome);
hostRouter.post("/delete-home/:homeId", hostController.postDelete)

exports.hostRouter=hostRouter;