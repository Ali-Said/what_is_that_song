/**
 * Created by Tim0theus on 22.06.2016.
 */

var multer = require('multer');

module.exports.postPhoto = function(req,res){
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
    upload(req,res,function(err) {
        if(err) {
            console.log(err);
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
};

module.exports.postMedia = function(req, res) {
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
    upload2(req,res,function(err) {
        if(err) {
            console.log(err);
            return res.end("Error uploading file.");
        };
        res.end(req.files[0].filename);
    });
};

var path = require('path');
var fs = require('fs');

module.exports.getMedia = function(req, res) {
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