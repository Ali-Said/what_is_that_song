/**
 * Created by Tim0theus on 01.06.2016.
 */
'use strict';

angular.module('myApp.profiles')

    .constant('profileDetailsState', {
        name: 'profiles.detail',
        options: {
            url: '/{username}',

            views: {
                "content@root": {
                    templateUrl: 'views/detail/profile-detail.html',
                    controller: 'ProfileDetailCtrl'
                }
            },

            ncyBreadcrumb: {
                // a bit ugly (and not stable), but ncybreadcrumbs doesn't support direct access
                // to a view controller yet if there are multiple views
                label: "Profile: {{profile.username || $$childHead.profile.username}}",
                parent: "root"
            }


        }
    })
    .controller('ProfileDetailCtrl', function($scope, $stateParams, currUser, Profile) {

        $scope.profile = Profile.get({username: $stateParams.username});

        $scope.mayEdit = currUser.loggedIn() && currUser.getUser()._id == $scope.profile._id;
        $scope.updateProfile = updateProfile;
        $scope.cancelEditingProfile = function(){ showSimpleToast("Editing cancelled"); }

        $scope.profile.$promise.then(function(){
            $scope.mayDelete = $scope.profile._id && $scope.profile._id == currUser.getUser()._id;
        });

        $scope.$watch(function(){
            return currUser.loggedIn();
        }, function(loggedIn){
            if (!loggedIn) {
                $scope.mayDelete = false;
                $scope.mayEdit = false;
            } else {
                $scope.mayEdit = currUser.getUser()._id == $scope.profile._id;
                $scope.mayDelete = $scope.profile._id == currUser.getUser()._id;
            }
        });

        ////////////////////


        function updateProfile(changed) {

            if (!changed) {
                showSimpleToast("no change");
                return;
            }

            $scope.profile.$update().then(function(updated){
                $scope.profile = updated;
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
