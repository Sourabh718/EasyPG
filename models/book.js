const mongoose=require('mongoose');
const bookingSchema=mongoose.Schema({
    homeId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Home', 
        required:true,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User', 
        required:true,
    },
    bookingDate:{
        type:Date,
        required:true,
        default:Date.now
    },
    stayFrom:{  
        type:Date,
        required:true,
    },
    stayTo:{
        type:Date,
        required:true,
    }
});
module.exports=mongoose.model('Booking',bookingSchema);     