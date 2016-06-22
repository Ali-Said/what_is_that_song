var Config = require('./config/config.js');

var mongoose = require('mongoose');
mongoose.connect([Config.db.host, '/', Config.db.name].join(''),{
    //eventually it's a good idea to make this secure
    user: Config.db.user,
    pass: Config.db.pass
});

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var passport = require('passport');
var jwtConfig = require('./passport/jwtConfig');

app.use(passport.initialize());
jwtConfig(passport);


var userRoutes = require("./user/userRoutes");
var trackRoutes = require("./track/trackRoutes");
var postRoutes = require("./post/postRoutes");
var mediaRoutes = require("./media/mediaRoutes");

app.use('/api', trackRoutes(passport));
app.use('/api', postRoutes(passport));
app.use('/api', mediaRoutes(passport));
app.use('/', userRoutes(passport));


module.exports = app;