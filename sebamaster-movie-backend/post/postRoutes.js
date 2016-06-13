/**
 * Created by Timotheus on 12.06.2016.
 */

module.exports = postRoutes;


function postRoutes(passport) {

    var postController = require('./postController');
    var router = require('express').Router();
    var unless = require('express-unless');

    var mw = passport.authenticate('jwt', {session: false});
    mw.unless = unless;

    //middleware
    router.use(mw.unless({method: ['GET', 'OPTIONS']}));

    router.route('/posts')
        .get(postController.getPosts);

    router.route('/posts/:post_id')
        .post(postController.postPost)
        .get(postController.getPost)
        .put(postController.putPost)
        .delete(postController.deletePost);

    return router;
}
