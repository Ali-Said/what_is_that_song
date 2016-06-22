/**
 * Created by Tim0theus on 22.06.2016.
 */

module.exports = mediaRoutes;

function mediaRoutes(passport) {

    var mediaController = require('./mediaController');
    var router = require('express').Router();

    router.route('/photo')
        .post(mediaController.postPhoto);

    router.route('/media')
        .post(mediaController.postMedia);

    return router;

}