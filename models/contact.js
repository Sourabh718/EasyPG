const mongoose = require("mongoose");
const contactSchema = mongoose.Schema({
    email: {
    type: String,
    required: [true, 'Email is required'],
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'] // optional regex validation
    },
    message:{
        type:String,
        required:[true,'Message is required']
    },  
});
module.exports = mongoose.model('Contact', contactSchema);