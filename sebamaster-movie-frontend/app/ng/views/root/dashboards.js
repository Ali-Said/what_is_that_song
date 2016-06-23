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
    .controller('DashboardsCtrl', function($scope, $filter, $state, Upload,Profile, Post) {
        $scope.profiles = Profile.query();
        Post.query(function(sucess) {
            $scope.posts = $filter('filter')(sucess, {type: 'request'}, true);
        });

        $scope.gotoProfile = gotoProfile;
        $scope.gotoPost = gotoPost;
        $scope.search = search;
        $scope.startRecording = startRecording;
        $scope.stopRecording = stopRecording;
        $scope.recording = false;


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

        var mediaRecorder = null;
        function startRecording() {
            $scope.recording = true;
            navigator.getUserMedia = navigator.getUserMedia
            || navigator.webkitGetUserMedia
            || navigator.mozGetUserMedia;

            if ( !! navigator.getUserMedia) {
                navigator.getUserMedia(
                    constraints
                    , function (stream) {
                        mediaRecorder = new MediaRecorder(stream);
                        mediaRecorder.start();

                        var url = window.URL || window.webkitURL;
                        video = document.createElement('video');
                        video.src = url ? url.createObjectURL(stream) : stream;
                        video.play();

                        var chunks = [];

                        mediaRecorder.ondataavailable = function(e) {
                            chunks.push(e.data);
                        }

                        mediaRecorder.onstop = function(){
                            $scope.recording = false;
                            stream.stop();
                            video.remove();

                            var blob = new Blob(chunks, {type: "video/webm"});
                            chunks = [];

                            postFiles('video', blob);
                        }


                }, function (error) {
                    alert(JSON.stringify(error));
                });
            }
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
        
        


        function stopRecording() {

            mediaRecorder.stop();

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