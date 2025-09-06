require("dotenv").config();
const Home = require("../models/homes");
const fs = require('fs')
const rootDir = require('../utils/pathUtils');
const path = require('path');
const Contact = require("../models/contact");

exports.getHostList = (req,res,next)=>{
    Home.find().then(registeredHome=>{
        res.render('host/homeList',{registeredHome, pageTitle:'Host Home List', isLoggedIn: req.isLoggedIn, user:req.session.user, currentPath: req.originalUrl }); 
    });
};
exports.getAddHome=(req,res,next)=>{
    res.render('host/addHome',{pageTitle: 'Add Home',editing: false,isLoggedIn: req.isLoggedIn, user:req.session.user, currentPath: req.originalUrl});
};

exports.postAddHome = (req, res, next) => {
  const { houseName, price, location, rating, photoUrl, description } =
    req.body;
  const home = new Home({
    houseName,
    price,
    location,  
    rating,
    photoUrl,
    description, 
  });
  home.save().then(() => {
    console.log("Home Saved successfully");
  });
  res.redirect("/host/home-list");
};

exports.getEditHome = (req, res, next) => {
  const homeId = req.params.homeId;
  const editing = req.query.editing === 'true';

  Home.findById(homeId).then((home) => {
    if (!home) { 
      console.log("Home not found for editing.");
      return res.redirect("/host/home-list");
    }

    // console.log(homeId, editing, home);
     res.render('host/addHome',{pageTitle: 'Edit Home', 
      editing, home, 
      isLoggedIn: req.isLoggedIn, 
      user:req.session.user,
      currentPath: req.originalUrl
     });
  });
};

exports.postEditHome = async (req, res, next) => {
  try{
  const { id, houseName, price, location, rating} = req.body;
  let photoUrl = req.body.oldPhotoUrl;
  const oldPhotoUrl = path.join(rootDir, photoUrl);
  if (req.file) {
    fs.unlink(oldPhotoUrl, err=>{
      if (err)  
      console.log('Error while deleting old photo:', err);
    })
    photoUrl = req.file.path; 
  }
  await Home.findByIdAndUpdate(id, {
      houseName,
      price,
      location,
      rating,
      photoUrl
    });

    console.log('Home updated');
    res.redirect('/host/home-list');
}
  catch(err){
            console.log("Error updating home:", err);
            res.redirect("/host/home-list");
        };
};

exports.postDelete = async (req,res,next)=>{
  try{
    const homeId = req.params.homeId;
    const home = await Home.findById(homeId);
  
    if (home.photoUrl) {
      const filePath = path.join(rootDir, home.photoUrl);
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.warn("Photo file missing or already deleted:", err.message);
      }
    }
    await Home.findByIdAndDelete(homeId)
    //  res.redirect('/host/home-list')
    
    res.json({ success: true });
  }
  catch(err){
    console.error('Error in Delete:', err);
    next(err);
  }
}; 
exports.goTo404 = (req,res,next)=>{
    res.status(404).render('404',{
      pageTitle:'Page Not Found',
      isLoggedIn: req.isLoggedIn, 
      user:req.session.user, 
      currentPath: req.originalUrl
    });
};

exports.getRequest = async (req,res,next)=>{
  try{ 
    const request = await Contact.find();
    res.render('host/request',{
      pageTitle:'Requests',
      isLoggedIn: req.isLoggedIn, 
      user:req.session.user, 
      currentPath: req.originalUrl,
      request:request
    });
  }
  catch(err){
    console.log('Error fetching requests:', err);
    res.redirect('/host/home-list');
  }
}

exports.postRequestDelete = async (req, res, next) => {
 const requestId = req.params.id;
 console.log('Request ID to delete:', requestId);
  try {
    await Contact.findByIdAndDelete(requestId);
    res.redirect('/host/request');
  }catch (err) {
    console.log('Error deleting request:', err);
    res.redirect('/host/request');
  }
}
const nodemailer = require('nodemailer');
exports.postRequestRespond = async (req, res, next) => {
  const requestId = req.params.id;
  const responseMessage = req.body.response;
  console.log('Request ID to respond:', requestId);
  console.log('Response Message:', responseMessage);
  try {
    const request = await Contact.findById(requestId);
    if(!responseMessage){
      console.log('Response message is empty.');
      return res.redirect('/host/request');
    }
    const transpoter = nodemailer.createTransport({
      service:"gmail",
      auth:{
        user: process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
      }
    });
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: request.email, 
      subject: 'Response to Your Request',
      text: responseMessage,
      html:`<p>${responseMessage}</p>`      
    }
    await transpoter.sendMail(mailOptions);
    console.log('Response email sent successfully.');
    try {
      await Contact.findByIdAndDelete(requestId);
      res.redirect('/host/request');
    }catch (err) {
      console.log('Error deleting request:', err);
      res.redirect('/host/request');
    }
}
catch(err){
  console.log('Error finding request:', err);
  return res.redirect('/host/request');
}
} 