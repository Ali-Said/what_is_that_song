module.exports = userRoutes;

function userRoutes(passport) {

    var userController = require('./userController');
    var router = require('express').Router();


    router.post('/login', userController.login);
    router.post('/signup', userController.signup);
    router.post('/unregister', passport.authenticate('jwt', {session: false}),userController.unregister);

    router.route('/profile')
        .get(userController.getProfiles);
    router.route('/profile/pic/:filename')
        .get(userController.getPicture);

    router.route('/profile/:username')
        .get(userController.getProfile)
        .put(userController.putProfile);
    
    router.route('/user/:id')
        .get(userController.getUser)
        .put(userController.putUser);

    return router;

}