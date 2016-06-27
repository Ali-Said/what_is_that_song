// Load required packages
var mongoose = require('mongoose');

// Define our movie schema
var Track   = new mongoose.Schema({
    title: String,
    rating: {type: Number, default: 3 ,min: 0, max: 5,},
    artist: String,
    points: Number
});

// Export the Mongoose model
module.exports = mongoose.model('Track', Track);