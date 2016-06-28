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
    .controller('DashboardsCtrl', function($scope, $q, $filter, $state, Upload, Profile, Post, currUser) {
        $scope.profiles = Profile.query();
        Post.query(function(sucess) {
            $scope.posts = $filter('filter')(sucess, {type: 'request'}, true);
        });

        $scope.gotoProfile = gotoProfile;
        $scope.gotoPost = gotoPost;
        $scope.search = search;
        $scope.openCamera = openCamera;
        $scope.startRecording = startRecording;
        $scope.stopRecording = stopRecording;

        $scope.saveRecording = saveRecording;
        $scope.cancelRecording = cancelRecording;
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

        function openCamera() {

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
                    /*
                    media = RecordRTC(stream, {
                        type: 'video'
                    });

                    media.startRecording();
                    if (!$scope.$$phase){
                        $scope.$apply(function() {$scope.Vars.recording = true;});
                    }
                    else
                    {
                        $scope.Vars.recording = true;
                    }
                    tracks = stream.getTracks();
                    */
                     var url = window.URL || window.webkitURL;
                     video = document.getElementById('video_stream');
                     document.getElementById('video_container').style="";
                     video.style="position:inherit;z-index:0;transform:inherit;-webkit-transform:inherit;top:0%;left:0%;";
                     video.src = url ? url.createObjectURL(stream) : stream;
                     video.focus();
                     video.play();
                })
                .catch(function (error) {
                    alert("Error:" + JSON.stringify(error));
                });


        }
        function startRecording(){
            navigator.mediaDevices
                .getUserMedia (constraints)
                .then(function(stream) {
                    media = RecordRTC(stream, {
                        type: 'video'
                    });

                    media.startRecording();
                    if (!$scope.$$phase){
                        $scope.$apply(function() {$scope.Vars.recording = true;});
                    }
                    else
                    {
                        $scope.Vars.recording = true;
                    }
                    tracks = stream.getTracks();
                    var url = window.URL || window.webkitURL;
                    video = document.getElementById('video_stream');
                    document.getElementById('video_container').style="";
                    video.style="position:inherit;z-index:0;transform:inherit;-webkit-transform:inherit;top:0%;left:0%;";
                    video.src = url ? url.createObjectURL(stream) : stream;
                    video.focus();
                    video.play();
                })
                .catch(function (error) {
                    alert("Error:" + JSON.stringify(error));
                });
        }
        function stopRecording() {
            media.stopRecording(function () {
                var recordedBlob = media.getBlob();
                //postFiles('video', recordedBlob);
                video = document.getElementById('video_stream');
                video.src = window.URL.createObjectURL(recordedBlob);
                video.controls="controls";
                //$scope.Vars.recording = false;
            });
            tracks.forEach( function(track)
            {
                track.stop();
            });
        };

        function saveRecording() {
            var file = {
                name: 'currentBlob.webm',
                type: 'video/webm',
                contents: media.getBlob()
            };
            postFiles('video', file);
            $scope.Vars.recording = false;
        };

        function cancelRecording() {
            var vid = document.getElementById('video_stream');
            vid.parentNode.removeChild(vid);
            vid.parentNode.parentNode.removeChild(vid.parentNode);
            $scope.Vars.recording = false;
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
                $scope.post.votes = 0;
                $scope.post.media = f;
                $scope.post.$save(function (success) {
                    $state.go('posts.detail', {postId: success._id});
                });
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
    });