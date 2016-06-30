var Config = require('../config/config.js');
var User = require('./userSchema');
var jwt = require('jwt-simple');

module.exports.login = function(req, res){

    if(!req.body.email){
        res.status(400).send('email required');
        return;
    }
    if(!req.body.password){
        res.status(400).send('password required');
        return;
    }

    var user = User.findOne({email: req.body.email}, function(err, user){
        if (err) {
            res.status(500).send(err);
            return
        }
        if (!user) {
            res.status(401).send('Invalid Credentials');
            return;
        }
        user.comparePassword(req.body.password, function(err, isMatch) {
            if(!isMatch || err){
                res.status(401).send('Invalid Credentials');
            } else {
                res.status(200).json({token: createToken(user), user:user});
            }
        });
    });

};

module.exports.signup = function(req, res){
    if(!req.body.email){
        res.status(400).send('email required');
        return;
    }
    if(!req.body.password){
        res.status(400).send('password required');
        return;
    }

    var user = new User();

    user.email = req.body.email;
    user.username = req.body.username;
    user.password = req.body.password;
    user.birthday = req.body.birthday;

    user.save(function(err) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        res.status(201).json({token: createToken(user)});
    });
};

module.exports.unregister = function(req, res) {
    req.user.remove().then(function (user) {
        res.sendStatus(200);
    }, function(err){
        res.status(500).send(err);
    });
};

module.exports.getProfiles = function(req, res) {
    User.find(function(err, profiles) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.json(profiles);
    });
};

module.exports.getProfile = function(req, res) {
    User.findOne({username: req.params.username}, function (err, profile) {
        if (err) {
            res.status(500).send(err)
            return;
        }
        ;

        res.json(profile);
    });
};

module.exports.putProfile = function(req, res) {
    // Use the Beer model to find a specific beer
    User.findOneAndUpdate(
        {username: req.params.username},
        req.body,
        {
            //pass the new object to cb function
            new: true,
            //run validations
            runValidators: true
        }, function (err, profile) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.json(profile);
        });

};

module.exports.getUser = function(req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err) {
            res.status(500).send(err)
            return;
        }

        res.json(user);
    });
};

module.exports.putUser = function(req, res) {
    User.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            //pass the new object to cb function
            new: true,
            //run validations
            runValidators: true
        }, function (err, user) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.json(user);
        });
}

var path = require('path');
var fs = require('fs');

module.exports.getPicture = function(req, res) {
    //console.log(req.param('id'));
    var f='defaultlogo.png';
    fs.readdir(path.resolve('uploads'), function (err, files) { // '/' denotes the root folder
        if (err) throw err;
                
        for(var i=0; i<files.length;i++){
            if (req.params.filename == files[i])
                f = files[i];
        }
        res.sendFile(path.resolve('uploads/'+f));;
    });

};

function createToken(user) {
    var tokenPayload = {
        user: {
            _id: user._id,
            email: user.email,
            username: user.username
        }
    };
    return jwt.encode(tokenPayload,Config.auth.jwtSecret);
};