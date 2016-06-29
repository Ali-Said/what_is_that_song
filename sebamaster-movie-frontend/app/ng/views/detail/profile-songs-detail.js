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


    .controller('ProfileSongsDetailCtrl', function($rootScope, $scope, $state, $breadcrumb, $stateParams, currUser, Track, Profile, $mdMedia, $mdToast, $mdDialog) {

        $scope.profile = Profile.get({username: $stateParams.username}, function(success){
            if(angular.equals({}, success)) {
                $state.go("dashboards.home");
                return;
            }
            
        }, function(error) {
            $state.go("dashboards.home");
            return;
        });


        $scope.tracks = Track.query();

        $scope.profile.$promise.then(function(){
            $scope.mayEdit = currUser.loggedIn() && currUser.getUser()._id == $scope.profile._id;
        });


        ////////////////////




        function showSimpleToast(txt) {
            $mdToast.show(
                $mdToast.simple()
                    .textContent(txt)
                    .position('bottom right')
                    .hideDelay(3000)
            );
        }





    });