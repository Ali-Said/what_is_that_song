'use strict';

angular.module('myApp.dashboards')

    .constant('dashboardsState', {
        name: 'dashboards.home',
        options: {

            url: '/home',

            views: {
                'content@root': {
                    templateUrl: 'views/root/dashboards.html',
                    controller: 'DashboardsCtrl',
                }
            },

            ncyBreadcrumb: {
                label: "Home"
            }

        }

    })
    .controller('DashboardsCtrl', function($scope, $q, $filter, $state, Upload, Profile, Post) {
        $scope.profiles = Profile.query();
        Post.query(function(sucess) {
            $scope.posts = $filter('filter')(sucess, {type: 'request'}, true);
        });

        $scope.gotoProfile = gotoProfile;
        $scope.gotoPost = gotoPost;
        $scope.search = search;
        $scope.startRecording = startRecording;
        $scope.stopRecording = stopRecording;
        $scope.Vars = {
            recording : false
        };


        function gotoProfile(username) {
            $state.go('profiles.detail', {username: username});
        }

        function gotoPost(postId) {
            $state.go('posts.detail', {postId: postId});
        }



        var video;

        var constraints = {
            audio: true,
            video: true
        };

        var media;
        var tracks;
        function startRecording() {

            var promisifiedOldGUM = function(constraints) {
                // First get ahold of getUserMedia, if present
                var getUserMedia = (navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia);

                // Some browsers just don't implement it - return a rejected promise with an error
                // to keep a consistent interface
                if(!getUserMedia) {
                    return $q.reject(new Error('getUserMedia is not implemented in this browser'));
                }

                // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
                return new $q(function(resolve, reject) {
                    getUserMedia.call(navigator, constraints, resolve, reject);
                });

            }

            // Older browsers might not implement mediaDevices at all, so we set an empty object first
            if(navigator.mediaDevices === undefined) {
                navigator.mediaDevices = {};
            }

            // Some browsers partially implement mediaDevices. We can't just assign an object
            // with getUserMedia as it would overwrite existing properties.
            // Here, we will just add the getUserMedia property if it's missing.
            if(navigator.mediaDevices.getUserMedia === undefined) {
                navigator.mediaDevices.getUserMedia = promisifiedOldGUM;
            }


            navigator.mediaDevices
                .getUserMedia (constraints)
                .then(function(stream) {
                    media = RecordRTC(stream, {
                        type: 'video'
                    });


                    media.startRecording();

                    $scope.$apply(function() {$scope.Vars.recording = true;});
                    tracks = stream.getTracks();

                    /*var url = window.URL || window.webkitURL;
                     video = document.createElement('video');
                     video.src = url ? url.createObjectURL(stream) : stream;
                     video.play();*/
                })
                .catch(function (error) {
                    alert("Error:" + JSON.stringify(error));
                });


        }


        function search() {

            var name = document.getElementById("searchForm").elements["searchItem"].value;
            var pattern = name.toLowerCase();
            var targetId = "";

            var divs = document.getElementsByClassName("md-3-line");
            for (var i = 0; i < divs.length; i++) {
                var para = divs[i].getElementsByTagName("p");
                var index = para[0].innerText.toLowerCase().indexOf(pattern);
                if (index != -1) {
                    targetId = divs[i].parentNode.id;
                    document.getElementById(targetId).scrollIntoView();
                    break;
                }
            }
        }




        function stopRecording() {

            media.stopRecording(function () {

                var recordedBlob = media.getBlob();
                postFiles('video', recordedBlob);
                $scope.Vars.recording = false;
            });
            tracks.forEach( function(track)
            {
                track.stop();
            });
        };


        var fileName;

        function postFiles(type, blob) {
            fileName = getRandomString();
            var files = { };

            if (type == 'audio'){
                files.audio = {
                    name: fileName + ('.wav'),
                    type: 'audio/wav',
                    contents: blob
                };
            }
            else {
                files.video = {
                    name: fileName + '.webm',
                    type: 'video/webm',
                    contents: blob
                };
            }



            Upload.upload({
                url: 'http://localhost:3000/api/media',
                file: files.audio || files.video
            }).success(function () {
                window.alert('uploaded to server');
            });

        }



        function getRandomString() {
            if (window.crypto) {
                var a = window.crypto.getRandomValues(new Uint32Array(3)),
                    token = '';
                for (var i = 0, l = a.length; i < l; i++) token += a[i].toString(36);
                return token;
            } else {
                return (Math.random() * new Date().getTime()).toString(36).replace( /\./g , '');
            }
        }

    });