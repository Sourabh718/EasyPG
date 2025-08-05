const Home = require("../models/homes");
const fs = require('fs')
const rootDir = require('../utils/pathUtils');
const path = require('path');

exports.getHostList = (req,res,next)=>{
    Home.fetchAll().then(registeredHome=>{
        res.render('host/homeList',{registeredHome, pageTitle:'Host Home List', isLoggedIn: req.isLoggedIn, user:req.session.user}); 
    });
};
exports.getAddHome=(req,res,next)=>{
    res.render('host/addHome',{pageTitle: 'Add Home',editing: false,isLoggedIn: req.isLoggedIn, user:req.session.user});
};
exports.postAddHome = (req,res,next)=>{
  const {houseName, price, location, rating} = req.body;
  const photoUrl= req.file ? req.file.path : '';
  const home = new Home(houseName, price, location, rating, photoUrl);
  console.log(req.file)
    home.save().then(()=>{
        console.log('home saved');
    });
    res.redirect('/host/home-list');
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
      user:req.session.user});
  });
};

exports.postEditHome = (req, res, next) => {
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
  const home = new Home(houseName, price, location, rating, photoUrl, id);

  home.save().then(result => {
    // console.log('Home updated ', result);
    // console.log('req.file:',req.file,'req.file.path',req.file.path,'req.body',req.body)
    res.redirect("/host/home-list"); 
  })
  .catch(err => {
            console.log("Error updating home:", err);
            res.redirect("/host/home-list");
        });
};

exports.postDelete = (req,res,next)=>{
    const homeId = req.params.homeId;
    Home.deleteById(homeId).then(() =>{
        res.redirect('/host/home-list');
    });
}; 
exports.goTo404 = (req,res,next)=>{
    res.status(404).render('404',{pageTitle:'Page Not Found',isLoggedIn: req.isLoggedIn, user:req.session.user});
};