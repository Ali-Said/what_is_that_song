/**
 * Created by Timotheus on 12.06.2016.
 */

// Load required packages
var mongoose = require('mongoose');

// Define our movie schema
var Post   = new mongoose.Schema({
    text: String,
    media: String,
    date: {type: Date, default: Date.now},
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [{type: mongoose.Schema.Types.ObjectId,
                ref: 'Post'}],
    rating: Number

});

// Export the Mongoose model
module.exports = mongoose.model('Post', Post);