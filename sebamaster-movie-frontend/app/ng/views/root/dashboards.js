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
                },
                'outside@root': {
                    templateUrl: 'views/root/dashboards-buttons.html',
                    controller: 'DashboardsButtonCtrl'
                }
            },

            ncyBreadcrumb: {
                label: "Home"
            }

        }

    })
    .controller('DashboardsCtrl', function($scope, $state, Profile, Post) {
        $scope.profiles = Profile.query();
        $scope.posts = Post.query();

        $scope.gotoProfile = gotoProfile;



        function gotoProfile(username) {
            $state.go('profiles.detail', {username: username});
        }


    })

    .controller('DashboardsButtonCtrl', function($scope, $mdMedia, $mdDialog, $mdToast, currUser){

        $scope.authed = false;
        
        $scope.$watch(function(){
            return currUser.loggedIn();
        }, function(loggedIn){
            $scope.authed = loggedIn;
        });

        ////////////////////////////////////

        function showSimpleToast(txt){
            $mdToast.show(
                $mdToast.simple()
                    .textContent(txt)
                    .position('bottom right')
                    .hideDelay(3000)

            );
        }
    });