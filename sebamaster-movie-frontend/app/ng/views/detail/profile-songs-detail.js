'use strict';

angular.module('myApp.profiles')

    .constant('profileSongsDetailsState', {
        name: 'profiles.songs',
        options: {
            url: '/:username/songs',

            views: {
                "content@root": {
                    templateUrl: 'views/detail/profile-songs-detail.html',
                    controller: 'ProfileSongsDetailCtrl'
                }
            },
            ncyBreadcrumb: {
                label: "Songs",
                parent: "profiles.detail"
            }


        }
    })


    .controller('ProfileSongsDetailCtrl', function($rootScope, $scope, $state, $filter, $breadcrumb, $stateParams, currUser, Track, Profile, $mdMedia, $mdToast, $mdDialog) {

        Profile.get({username: $stateParams.username}, function(success){
            if(angular.equals({}, success)) {
                $state.go("dashboards.home");
                return;
            }

            $scope.profile = success;

            initializeValues();

        }, function(error) {
            $state.go("dashboards.home");
            return;
        });
        
        $scope.$on('profile-updated', function(event, args) {
            initializeValues();
        });

        

        
        $scope.getSong = getSong;


        ////////////////////

        function initializeValues() {
            $scope.mayEdit = currUser.loggedIn() && currUser.getUser()._id == $scope.profile._id;

            Track.query(function(success) {
                $scope.tracks = success;
                angular.forEach($scope.profile.songs, function(value, key) {
                    Track.get({trackId: value}, function(success) {
                        $scope.profile.songs[key] = success;
                        $scope.tracks.splice($scope.tracks.map(function(x) {return x._id}).indexOf(success._id),1);
                    });
                });

            });
        }

        function getSong(track) {
            $scope.profile.songs.push({_id: track._id});
            $scope.profile.points -= track.points;
            updateProfile(true);
        }

        function updateProfile(changed) {

            if (!changed) {
                showSimpleToast("no change");
                return;
            }

            $scope.profile.$update().then(function(success){
                $rootScope.$broadcast('profile-updated', success);
                showSimpleToast("update successfull");
            }, function(){
                showSimpleToast("error. please try again later");
            });
        }


        function showSimpleToast(txt) {
            $mdToast.show(
                $mdToast.simple()
                    .textContent(txt)
                    .position('bottom right')
                    .hideDelay(3000)
            );
        }





    });