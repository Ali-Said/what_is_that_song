var Track = require('./trackSchema');

exports.postTrack = function(req, res) {
    var track = new Track(req.body);
    //do not allow user to fake identity. The user who post the track must be the same user that is logged in
    if (!req.user.equals(track.user)) {
        res.sendStatus(401);
    }

    track.save(function(err, m) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        res.status(201).json(m);
    });
};

// Create endpoint /api/tracks for GET
exports.getTracks = function(req, res) {
    Track.find(function(err, tracks) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.json(tracks);
    });
};


// Create endpoint /api/tracks/:track_id for GET
exports.getTrack = function(req, res) {
    // Use the Beer model to find a specific beer
    Track.findById(req.params.track_id, function(err, track) {
        if (err) {
            res.status(500).send(err)
            return;
        };

        res.json(track);
    });
};

// Create endpoint /api/dashboards/:movie_id for PUT
exports.rateTrack = function(req, res) {
    // Use the Beer model to find a specific beer
    Track.findByIdAndUpdate(
        req.params.track_id,
        {$set: {rating: reg.params.rating}},
        {
            //pass the new object to cb function
            new: true,
            //run validations
            runValidators: true
        }, function (err, track) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.json(track);
    });

};

// Create endpoint /api/dashboards/:movie_id for DELETE
exports.deleteTrack = function(req, res) {
    // Use the Beer model to find a specific beer and remove it
    Track.findById(req.params.track_id, function(err, m) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        //authorize
        if (m.user && req.user.equals(m.user)) {
            m.remove();
            res.sendStatus(200);
        } else {
            res.sendStatus(401);
        }
    });
};