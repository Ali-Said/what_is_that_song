'use strict';

angular.module('myApp.dashboards')

    .constant('dashboardListState', {
        name: 'dashboard.list',
        options: {

            url: '/',

            views: {
                'content@root': {
                    templateUrl: 'views/list/dashboard-list.html',
                    controller: 'DashboardListCtrl',
                },
                'outside@root': {
                    templateUrl: 'views/list/dashboard-list-buttons.html',
                    controller: 'DashboardListButtonCtrl'
                }
            },

            ncyBreadcrumb: {
                label: "Home"
            }

        }

    })
    .controller('DashboardListCtrl', function($scope) {



    })

    .controller('DashboardListButtonCtrl', function($scope, $mdMedia, $mdDialog, $mdToast, currUser){

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