/**
 * Created by Tim0theus on 01.06.2016.
 */
'use strict';

angular.module('myApp.profiles')

    .constant('profileDetailsState', {
        name: 'profiles.detail',
        options: {
            url: '/{profileId}',

            views: {
                "content@root": {
                    templateUrl: 'views/detail/profile-detail.html',
                    controller: 'ProfileDetailCtrl'
                },
                'outside@root': {
                    templateUrl: 'views/list/profile-list-buttons.html',
                    controller: 'profileListButtonCtrl'
                }
            },

            resolve: {
                //we abuse the resolve feature for eventual redirection
                redirect: function($state, $stateParams, Profile, $timeout, $q){
                    var mid = $stateParams.profileId;
                    if (!mid) {
                        //timeout because the transition cannot happen from here
                        $timeout(function(){
                            $state.go("movies.list");
                        });
                        return $q.reject();
                    }
                }
            },
            ncyBreadcrumb: {
                // a bit ugly (and not stable), but ncybreadcrumbs doesn't support direct access
                // to a view controller yet if there are multiple views
                label: "Profile",
                parent: "root"
            }


        }
    })
    .controller('ProfileDetailCtrl', function($scope, $stateParams, currUser, Profile) {

        $scope.imageSource = 'http://localhost:3000/profile/picture',//?id='+currUser.getUser()._id;
        $scope.profile = Profile.get({profileId: $stateParams.profileId});
        //window.alert(currUser.getUser()._id);
        $scope.mayEdit = currUser.loggedIn() && currUser.getUser()._id == $scope.profile.user;
        $scope.updateProfile = updateProfile;
        $scope.cancelEditingProfile = function(){ showSimpleToast("Editing cancelled"); }

        $scope.profile.$promise.then(function(){
            $scope.mayDelete = $scope.profile.user && $scope.profile.user == currUser.getUser()._id;
        });

        $scope.$watch(function(){
            return currUser.loggedIn();
        }, function(loggedIn){
            if (!loggedIn) {
                $scope.mayDelete = false;
                $scope.mayEdit = false;
            } else {
                $scope.mayEdit = currUser.getUser()._id == $scope.profile.user;
                $scope.mayDelete = $scope.profile.user == currUser.getUser()._id;
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
