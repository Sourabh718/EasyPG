const { validationResult } = require("express-validator");
const Contact = require("../models/contact");
const Home = require("../models/homes");
const User = require("../models/user")
const bcrypt  = require("bcryptjs");
const path = require('path');
const rootDir = path.dirname(require.main.filename);

exports.getHomes = async (req, res, next) => {
  try {
    const registeredHomes = await Home.find().populate();
     let favouriteHomeIds = [];

    if (req.session.user) {
      const user = await User.findById(req.session.user._id).populate('favourites');
      favouriteHomeIds = user.favourites || [];
    }
    res.render('store/homePage', {
      registeredHomes,
      pageTitle: 'Home List',
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
      favouriteHomes:favouriteHomeIds,
      currentPath:req.originalUrl
    });
  } catch (err) {
    console.error('Error in getHomes:', err);
    next(err);
  }
}; 

exports.getbooking = async (req,res,next) => {
  try{
  const userId = req.session.user._id;
  const user = await User.findById(userId).populate('booking.home');
  console.log('user booking',user)

  res.render("store/booking", {
      pageTitle: "My Booking",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
      currentPath: req.originalUrl,
      bookings:user.booking
    });
  }catch(err){
    console.log('booking',err)
  }
}

exports.getHomeDetails = (req, res, next) => {
  try {
    const homeId = req.params.homeId;
    console.log("Home ID:", homeId);
    Home.findById(homeId).then((home) => {
      console.log("Photo URL in Home Details:", home.photoUrl);
      if (!home) {
        console.log("Home not found");
        res.redirect("/user/homes");
      } else {
         res.render('store/homeDetails',{home,pageTitle:'Home Detail', isLoggedIn: req.isLoggedIn, user:req.session.user, currentPath: req.originalUrl});
      }
    });
  } catch (error) {    
    console.log('error in home details',err)
    res.redirect( "/user/home-list")
  }
};

// favourites
exports.getFavourites = async (req, res, next) => {
  try{
  const userId = req.session.user._id;
  const user = await User.findById(userId).populate('favourites')
  res.render("store/watchlist", {
      favouriteHomes: user.favourites,
      pageTitle: "My Favourites",
      currentPage: "favourites",
      isLoggedIn: req.isLoggedIn,
      user:req.session.user,
      currentPath: req.originalUrl
      });
    }catch{
      console.log('error in favourites',err)
      res.redirect( "/user/watchlist")
    }
};

exports.postAddToFavourites = async (req,res,next)=>{
  try{
    const favouriteId = req.body.favouriteId;
    const userId = req.session.user._id;
    const user = await User.findById(userId);
    if(!user.favourites.includes(favouriteId)){
      user.favourites.push(favouriteId);
      await user.save();
    }
    res.json({ success: true });
  }catch(err){
    console.log('error in favourites',err)
    res.redirect( "/user/watchlist")
  }
} 

exports.postRemoveFromFavourites = async (req, res, next) => {
  try{
  const userId = req.session.user._id;
  const user = await User.findById(userId)
  const favouriteId = req.params.homeId;
  user.favourites = user.favourites.filter(fav => fav != favouriteId)
  await user.save()
  res.json({ success: true });
  }catch(err){
    console.log('error in deleting favourites',err)
    res.redirect( "/user/watchlist")
  }
};

exports.getPayment = (req, res, next) => {
  try{
    const homeId = req.params.homeId;
    console.log("Payment Home ID:", homeId);
    Home.findById(homeId).then((home) => {
      if (!home) {
        console.log("Home not found for payment");
        return res.redirect("/user/home-list");
      }
      else {
      res.render("store/payment", {
        home: home,
        pageTitle: "Payment",
        isLoggedIn: req.isLoggedIn,
        user: req.session.user,
        currentPath: req.originalUrl
      });
    }
    });
  }catch(err){
    console.log('error in payment',err)
    res.redirect( "/user/home-list")
  }
}

exports.getCardDetails = (req, res, next) => {
  try{
    const homeId = req.params.homeId;
    console.log("Card Details Home ID:", homeId);
    Home.findById(homeId).then((home) => {
      if (!home) {
        console.log("Home not found for card details");
        return res.redirect("/user/home-list");
      }
      res.render("store/card-details", {
        home: home,
        pageTitle: "Card Details",
        isLoggedIn: req.isLoggedIn,
        user: req.session.user,
        currentPath: req.originalUrl
      });
    });
  }catch (error) {    
    console.log('error during card details',err)
    res.redirect( "/user/home-list")
  }
};
exports.postCardDetails = async (req, res, next) => {
  try{
    const homeId = req.params.homeId;
    const userId = req.session.user._id;
    const user = await User.findById(userId)
    const isBooked = user.booking.some(booking => booking.home.toString() === homeId)
    if(!isBooked){
      const stayFrom = new Date();
      let stayTo = new Date();
      stayTo.setDate(stayFrom.getDate() + 30);
      user.booking.push({
        home: homeId,
        stayFrom,
        stayTo
     });
     await user.save();
    }
    res.redirect('/user/home-list')
  }catch(err){
    console.log('post booking error',err)
    res.redirect('/user/home-list');
  }
}

exports.getAbout = (req,res,next)=>{
  try {  
    res.render('store/aboutUs',{
    isLoggedIn:req.isLoggedIn,
    user:req.session.user,
    pageTitle:'About Us',
    currentPath:req.originalUrl
  });
  } catch (error) {   
    console.log('error in about us',err)
  }
}
exports.getContact = (req,res,next) => {
  try{
  res.render('store/contact-us',{
    isLoggedIn:req.isLoggedIn,
    user:req.session.user,
    pageTitle:'Contact Us',
    currentPath:req.originalUrl,
    successMessage: false
  });
  }catch (error) {    
    console.log('error in contact',err)
  }
}
exports.postContact = (req, res, next) => {
  const { email, message } = req.body;
  const contact = new Contact({ email, message });
  contact.save()
    .then(() => {
      console.log('Contact message saved');
      res.render('store/contact-us', {
        isLoggedIn: req.isLoggedIn,
        user: req.session.user,
        pageTitle: 'Contact Us',
        currentPath: req.originalUrl,
        successMessage: true
      });
    })
    .catch(err => {
      console.log('Error saving contact message:', err);
      res.status(500).send('Something went wrong, please try again later.');
    });
};

exports.getProfile = (req, res, next) => {
  try{
    res.render('store/my-profile', {
      isLoggedIn: req.isLoggedIn,
      user: req.session.user || null,
      pageTitle: 'My Profile',
      currentPath: req.originalUrl,
      errors: [],
    });
  }catch (error) {    
    console.log('error in profile page',err)
    res.redirect( "/user/home-list")
  }
};

exports.updateProfile =async (req, res, next) => {
  const errors = validationResult(req);
  console.log("Validation Errors:", errors.array(), errors.array().length);
  console.log("Is Empty:", errors.isEmpty());
  console.log("Mapped Errors:", errors.array().map(err => err.msg));
  console.log("Is not Empty:", !errors.isEmpty());
  if(!errors.isEmpty()){
    return res.status(422).render('store/my-profile',{
      pageTitle:'My Profile',
      isLoggedIn:req.isLoggedIn,
      user:req.session.user,
      currentPath:req.originalUrl,
      errors:errors.array().map(err=>err.msg),
    })
  }
  try {
    const {username, mobileNo, email} = req.body;
    const user = await User.findById(req.session.user._id);
    user.username = username || user.username;
    user.email = email || user.email;
    user.mobileNo = mobileNo || user.mobileNo;
    await user.save(); 
    req.session.user = user.toObject();
    await req.session.save();
    res.redirect('/user/my-profile')
  } catch (error) {
    console.log('error',error)
    
    res.redirect('/user/my-profile')
  } 
}

exports.postDeleteAccount = async (req, res, next) =>{
  try{
    const userId = req.session.user._id;
    const password = req.body.password;
    const user = await User.findById(userId);
     if (!user) {
      return res.status(404).send("User not found");
    }
    // const isMatch = await user.comparePassword(password);
    const isMatch =await bcrypt.compare(password, user.password);
    if(!isMatch){
      return res.status(422).render('store/my-profile',{
        pageTitle:'My Profile',
        isLoggedIn:req.isLoggedIn,
        user:req.session.user,
        currentPath:req.originalUrl,
        errors: ["Incorrect password. Account not deleted."]
      });
    }
    await User.findByIdAndDelete(userId);
    console.log('user account deleted');
    req.session.destroy((err)=>{
      console.log('inside destroy session');
      if(err){
        console.log('error in destroying session',err);
        return res.redirect('/user/my-profile');
      }
      else
        console.log('session destroyed');
      res.redirect('/');
    });    
  } 
  catch(err){
    console.log("error in deleting account",err);
    res.redirect('/user/my-profile');
  }
}