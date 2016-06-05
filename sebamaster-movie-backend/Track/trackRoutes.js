module.exports = trackRoutes;


function trackRoutes(passport) {

    var trackController = require('./trackController');
    var router = require('express').Router();
    var unless = require('express-unless');
    var multer = require('multer');
    var fs = require('fs');
    var mw = passport.authenticate('jwt', {session: false});
    mw.unless = unless;

    //middleware
    router.use(mw.unless({method: ['GET', 'OPTIONS']}));

    router.route('/tracks')
        .post(trackController.postTrack)
        .get(trackController.getTracks);

    router.route('/tracks/:track_id')
        .get(trackController.getTrack)
        .put(trackController.rateTrack)
        .delete(trackController.deleteTrack);

    return router;
}
