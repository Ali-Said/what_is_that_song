/**
 * Created by Timotheus on 12.06.2016.
 */

var Post = require('./PostSchema');

exports.postPost = function(req, res) {

    var post = new Post(req.body);

    //do not allow user to fake identity. The user who posted the post must be the same user that is logged in
    if (!req.user.equals(post.user)) {
        res.sendStatus(401);
    }

    post.save(function(err, m) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        res.status(201).json(m);
    });
};

// Create endpoint /api/posts for GET
exports.getPosts = function(req, res) {
    Post.find()
        .lean()
        .populate('user')
        .populate({
            path: 'comments',
            model: 'Post',
            populate: {
                path: 'user',
                model: 'User'
            }
        })
        .exec(function(err, post) {
            if (err) {
                res.status(500).send(err);
                return;
            }

            res.json(post);
        });
};


// Create endpoint /api/posts/:post_id for GET
exports.getPost = function(req, res) {
    // Use the Beer model to find a specific beer
    Post.findById(req.params.post_id)
        .lean()
        .populate('user')
        .populate({
            path: 'comments',
            model: 'Post',
            populate: {
                path: 'user',
                model: 'User'
            }
        })
        .exec(function(err, post) {
            if (err) {
                res.status(500).send(err);
                return;
            }

            res.json(post);
        });
};

// Create endpoint /api/posts/:post_id for PUT
exports.putPost = function(req, res) {
    // Use the Beer model to find a specific beer
    Post.findByIdAndUpdate(
        req.params.post_id,
        req.body,
        {
            //pass the new object to cb function
            new: true,
            //run validations
            runValidators: true
        })
        .lean()
        .populate('user')
        .populate({
            path: 'comments',
            model: 'Post',
            populate: {
                path: 'user',
                model: 'User'
            }
        })
        .exec(function(err, post) {
            if (err) {
                res.status(500).send(err);
                return;
            }

            res.json(post);
        });;

};

// Create endpoint /api/posts/:post_id for DELETE
exports.deletePost = function(req, res) {
    // Use the Beer model to find a specific beer and remove it
    Post.findById(req.params.post_id, function(err, p) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        //authorize
        if (p.user && req.user.equals(p.user)) {
            p.remove();
            res.sendStatus(200);
        } else {
            res.sendStatus(401);
        }

    });
};