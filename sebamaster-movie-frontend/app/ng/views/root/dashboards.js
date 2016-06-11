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
    .controller('DashboardsCtrl', function($scope, Profile) {
        $scope.profiles = [{username: 'blubb'}];
        $scope.profile = Profile.query(function(success){
            $scope.profiles = success;
            if(angular.equals({}, success)) {
                $state.go("dashboards");
                return;
            }
        }, function(error) {
            $state.go("dashboards");
            return;
        });


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