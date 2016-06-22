/**
 * Created by Timotheus on 12.06.2016.
 */

// Load required packages
var mongoose = require('mongoose');

// Define our movie schema
var Post   = new mongoose.Schema({
    text: {type: String, required: true},
    type: {type: String, required: true},
    media: String,
    date: {type: Date, default: Date.now, required: true},
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comments: [{type: mongoose.Schema.Types.ObjectId, ref:'Post'}],
    rating: Number,
    votes: Number

});

// Export the Mongoose model
module.exports = mongoose.model('Post', Post);