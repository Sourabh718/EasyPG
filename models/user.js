const { default: mongoose } = require("mongoose");
const Home = require('../models/homes');
const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:[true,'Username is required']
    },
    email:{
        type:String,
        required:[true,'Email is required'],
        unique:true
    },
    mobileNo:{
        type:String,
        required:[true,'Mobile number is required'],
        unique:true
    },
    password:{
        type:String,
        required:[true,'Password is required']
    },
    userType:{
        type:String,
        required: [true, 'User type is required']
    },
    favourites:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Home'
    }],
   booking: [{
    home: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Home',
      required: true
    },
    stayFrom: {
      type: Date,
      required: true
    },
    stayTo: {
      type: Date,
      required: true
    }
  }],
});

module.exports=mongoose.model('User', userSchema);