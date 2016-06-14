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
var movieRoutes = require("./movie/movieRoutes");
var trackRoutes = require("./track/trackRoutes");
var postRoutes = require("./post/postRoutes");
var multer = require('multer');

app.use('/api', movieRoutes(passport));
app.use('/api', trackRoutes(passport));
app.use('/api', postRoutes(passport));
app.use('/', userRoutes(passport));

var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        console.log(file.originalname);
        callback(null, file.originalname);
    }
});
var upload = multer({ storage : storage}).any();

app.post('/api/photo',function(req,res){
    upload(req,res,function(err) {
        if(err) {
            console.log(err);
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
});


var storage2 =   multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        var d = new Date();
        var l = d.getDay();
        var h = (d.getHours());
        var m = (d.getMinutes());
        var s = (d.getSeconds());
        var name = file.originalname + l + "_"+ h + "_" + m + "_" + s +".webm";
        callback(null, name);
    }
});
var upload2 = multer({ storage : storage2}).any();
app.post('/api/video',function(req,res){
    upload2(req,res,function(err) {
        if(err) {
            console.log(err);
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
});

module.exports = app;