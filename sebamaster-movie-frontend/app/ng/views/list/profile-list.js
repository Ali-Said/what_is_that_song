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
                    templateUrl: 'views/list/profiles-list.html',
                    controller: 'ProfileListCtrl',
                }/*,
                'outside@root': {
                    templateUrl: 'views/list/profiles-list-buttons.html',
                    controller: 'profileListButtonCtrl'
                }*/
            },

            ncyBreadcrumb: {
                label: "Profiles"
            }

        }

    })
    .controller('ProfileListCtrl', function($scope, Profile) {
        $scope.profiles = Profile.query();



    })

    .controller('movieListButtonCtrl', function($scope, $mdMedia, $mdDialog, $mdToast, currUser){

        $scope.authed = false;

        $scope.$watch(function(){
            return currUser.loggedIn();
        }, function(loggedIn){
            $scope.authed = loggedIn;
        });
        

        function showSimpleToast(txt){
            $mdToast.show(
                $mdToast.simple()
                    .textContent(txt)
                    .position('bottom right')
                    .hideDelay(3000)

            );
        }
    });