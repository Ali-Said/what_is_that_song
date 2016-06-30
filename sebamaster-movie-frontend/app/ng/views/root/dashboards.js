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
    .controller('DashboardsCtrl', function($scope, $q, $filter, $state, Profile, Post, currUser, $mdMedia, $mdDialog) {
        $scope.profiles = Profile.query();
        Post.query(function(sucess) {
            $scope.posts = $filter('filter')(sucess, {type: 'request'}, true);
        });

        $scope.gotoProfile = gotoProfile;
        $scope.gotoPost = gotoPost;
        $scope.search = search;
        $scope.loggedIn = currUser.loggedIn();
        $scope.customFullscreen = false;

        $scope.$watch(function(){
            $scope.loggedIn =  currUser.loggedIn();
        });


        function gotoProfile(username) {
            $state.go('profiles.detail', {username: username});
        }

        function gotoPost(postId) {
            $state.go('posts.detail', {postId: postId});
        }

        var tracks;
        $scope.$on('stream-tracks', function(event, args) {
            tracks = args;
        })


        $scope.recordingDialog = function(ev) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
            $mdDialog.show({
                controller: "RecordingCtrl",
                templateUrl: 'views/root/video-record.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: useFullScreen
            })
                .then(function(answer) {
                }, function() {
                    tracks.forEach( function(track)
                    {
                        track.stop();
                    });

                });
            $scope.$watch(function() {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function(wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        };



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
    })
    .controller('RecordingCtrl', function($rootScope, $scope, $q, $state, $timeout, Upload, Profile, Post, currUser, $mdDialog) {

        $scope.startRecording = startRecording;
        $scope.stopRecording = stopRecording;

        $scope.saveRecording = saveRecording;
        $scope.cancelRecording = cancelRecording;

        $scope.Vars = {
            recording : false,
            camera : false,
            ready : false
        };

        var constraints = {
            audio: true,
            video: true
        };

        var media;
        var tracks;
        var mainstream = null;
        var url = window.URL || window.webkitURL;
        var video;

        $timeout(function() {
            video = document.getElementById('video_stream');

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
                    video.controls="";
                    video.muted= true;
                    video.src = url ? url.createObjectURL(stream) : stream;
                    video.focus();
                    video.play();
                    tracks = stream.getTracks();
                    $rootScope.$broadcast('stream-tracks', tracks);
                    mainstream = stream;
                    $timeout(function() {
                        $scope.Vars.camera= true;
                    });

                })
                .catch(function (error) {
                    alert("Error:" + JSON.stringify(error));
                });
        })

        function startRecording(){
            if(mainstream) {
                var stream = mainstream;
                media = RecordRTC(stream, {
                    type: 'video'
                });

                media.startRecording();
                $timeout(function() {
                    $scope.Vars.recording = true;
                    $scope.Vars.ready = false;
                });
                video.src = url ? url.createObjectURL(stream) : stream;
                video.focus();
                video.play();
            }
        }
        function stopRecording() {
            media.stopRecording(function () {
                var recordedBlob = media.getBlob();
                video.src = url ? url.createObjectURL(recordedBlob) : recordedBlob;
                video.controls="controls";
                video.muted= false;
                $timeout(function() {
                    $scope.Vars.recording = false;
                    $scope.Vars.ready = true;
                })

            });
        };

        function saveRecording() {
            tracks.forEach( function(track)
            {
                track.stop();
            });
            $timeout(function() {
                $scope.Vars.camera= false;
                $scope.Vars.recording = false;
                $scope.Vars.ready = true;
            });
            var file = {
                name: 'currentBlob.webm',
                type: 'video/webm',
                contents: media.getBlob()
            };
            $mdDialog.hide();
            postFiles('video', file);

        };

        function cancelRecording() {
            tracks.forEach( function(track)
            {
                track.stop();
            });
            $timeout(function() {
                $scope.Vars.camera= false;
                $scope.Vars.recording = false;
                $scope.Vars.ready = false;
            });
            $mdDialog.hide();
        };

        function postFiles(type, blob) {
            Upload.upload({
                url: 'http://localhost:3000/api/media',
                file: blob
            }).success(function (f) {
                //redirect to post with video
                $scope.post = new Post();
                $scope.post.text = "Enter text here";
                $scope.post.type = "request";
                $scope.post.date = new Date();
                $scope.post.user = currUser.getUser();
                $scope.post.rating = 3;
                $scope.post.media = f;
                $scope.post.$save(function (success) {
                    $state.go('posts.detail', {postId: success._id});
                });
            });
        }
    });
