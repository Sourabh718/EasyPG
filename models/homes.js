const mongoose = require('mongoose');
const User = require('./user')

const homeSchema = mongoose.Schema({
  houseName: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  photoUrl: String,
  
});

homeSchema.pre('findOneAndDelete', async function(next) {
  try {
    const homeId = this.getQuery()._id;
    await User.updateMany(
      { favourites: homeId },
      { $pull: { favourites: homeId} }
    );
    await User.updateMany(
      {"booking.home": homeId },
      { $pull: { booking: { home: homeId} } }
    );
    next();
  } catch (err) {
    console.log('error agaon',err)
    next(err);
  }
});

module.exports = mongoose.model('Home', homeSchema);