'use strict';

angular.module('myApp.profiles')

    .constant('profileDetailsState', {
        name: 'profiles.detail',
        options: {
            url: '/:username',

            views: {
                "content@root": {
                    templateUrl: 'views/detail/profile-detail.html',
                    controller: 'ProfileDetailCtrl'
                },
                "outside@root": {
                    templateUrl: 'views/list/profile-list-buttons.html',
                    controller: 'profileListButtonCtrl'
                }
            },

            ncyBreadcrumb: {
                label: "Profile: {{profile.username}}",
                parent: "root"
            }


        }
    })
    .controller('ProfileDetailCtrl', function($scope, $breadcrumb, $stateParams, currUser, Profile) {
        $scope.profile = Profile.get({username: $stateParams.username});
        $breadcrumb.ncyBreadcrumbLabel =  "Profile: {{profile.username}}";
        $scope.imageSource = 'http://localhost:3000/profile/picture';
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

    })
    .controller('profileListButtonCtrl', function($scope, $mdMedia, $mdDialog, $mdToast, currUser){
        $scope.uploadTrackDialog = uploadTrackDialog;
        function uploadTrackDialog(ev) {
            var useFullScreen = ( $mdMedia('xs'));
            $mdDialog.show({
                controller: "UserController",
                templateUrl: 'components/upload-profile-pic/upload-picture.html',
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: useFullScreen,
                preserveScope:true
            })
                .then(function(answer) {

                    if (answer) {
                        showSimpleToast('Profile Picture saved successfully');
                    } else {
                        showSimpleToast('An Error occured!');
                    }
                }, function() {
                    showSimpleToast('You do not wanna save?');
                });

        }

        function showSimpleToast(txt){
            $mdToast.show(
                $mdToast.simple()
                    .textContent(txt)
                    .position('bottom right')
                    .hideDelay(3000)

            );
        }
    });