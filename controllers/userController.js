const Favourite = require("../models/favourite");
const Home = require("../models/homes");

// exports.getIndex = (req,res,next)=>{
//     Home.fetchAll().then(registeredHome=>{
//         // console.log('session value', req.session)
//         res.render('store/index',{registeredHome, pageTitle:'EasyPG', isLoggedIn: req.isLoggedIn, user:req.session.user});
//     });
// };
exports.getHomes = (req,res,next)=>{
    Home.fetchAll().then(registeredHome=>{
        res.render('store/homePage',{registeredHome, pageTitle:'Home List', isLoggedIn: req.isLoggedIn, user:req.session.user});
    });
};
exports.getbooking = (req,res,next)=>{
    res.render('store/booking',{pageTitle:'My Booking', isLoggedIn: req.isLoggedIn, user:req.session.user});
};

exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;
  console.log("Home ID:", homeId);
  Home.findById(homeId).then((home) => {
    console.log("Photo URL in Home Details:", home.photoUrl);
    if (!home) {
      console.log("Home not found");
      res.redirect("/user/homes");
    } else {
       res.render('store/homeDetails',{home,pageTitle:'Home Detail', isLoggedIn: req.isLoggedIn, user:req.session.user});
    }
  });
};

// favourites

exports.postAddToFavourites = (req,res,next)=>{
    const favouriteId = req.body.favouriteId;
    const fav = new Favourite(favouriteId);
    fav.save().then((result)=>{
        console.log('favourite item added',result)
    })
    .catch(err=>{
        console.log('favourite is not added',err)
    })
    .finally(()=>{
        res.redirect("/user/watchlist");
    })
}

exports.getFavourites = (req, res, next) => {
  Favourite.getFavourite().then(favourites => {
    favourites = favourites.map(fav => fav.id);  //this id is use from favourite constructor
    Home.fetchAll().then(registeredHomes => {
      const favouriteHomes = registeredHomes.filter((home) =>
        favourites.includes(home._id.toString())
      );
      res.render("store/watchlist", {
        favouriteHomes: favouriteHomes,
        pageTitle: "My Favourites",
        currentPage: "favourites",
        isLoggedIn: req.isLoggedIn,
        user:req.session.user
      });
    });
  });
};

exports.postRemoveFromFavourites = (req,res,next)=>{
    const favouriteId = req.params.homeId;
    console.log('favouriteId', favouriteId);
    Favourite.removeFavourites(favouriteId).then((result)=>{
        console.log('favourite item removed',result)
    })
    .catch(err=>{
        console.log('error in removing item',err)
    })
    .finally(()=>{
        res.redirect("/user/watchlist");
    })
};

exports.getPayment = (req, res, next) => {
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
      user: req.session.user
    });
  }
  });
}

exports.getCardDetails = (req, res, next) => {
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
      user: req.session.user
    });
  });
};