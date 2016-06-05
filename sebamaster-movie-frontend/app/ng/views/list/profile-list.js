/**
 * Created by Tim0theus on 05.06.2016.
 */

'use strict';

angular.module('myApp.profiles')

    .constant('profileListState', {
        name: 'profiles.list',
        options: {

            url: '',

            views: {
                'content@root': {
                    templateUrl: 'views/list/profile-list.html',
                    controller: 'ProfileListCtrl',
                },
                'outside@root': {
                    templateUrl: 'views/list/profiles-list-buttons.html',
                    controller: 'profileListButtonCtrl'
                }
            }

        }

    })
    .controller('ProfileListCtrl', function($scope, Profile) {
        $scope.profiles = Profile.query();
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