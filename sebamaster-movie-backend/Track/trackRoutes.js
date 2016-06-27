module.exports = trackRoutes;


function trackRoutes(passport) {

    var trackController = require('./trackController');
    var router = require('express').Router();
 
    router.route('/tracks')
        .post(trackController.postTrack)
        .get(trackController.getTracks);

    router.route('/tracks/:trackId')
        .get(trackController.getTrack)
        .delete(trackController.deleteTrack);

    return router;
}
