'use strict';

angular.module('myApp.dashboards')

    .constant('dashboardDetailsState', {
        name: 'dashboards.detail',
        options: {
            url: '/home',

            views: {
                "content@root": {
                    templateUrl: 'views/detail/dashboard-detail.html',
                    controller: 'dashboardDetailCtrl'
                }
            },

            resolve: {
                //we abuse the resolve feature for eventual redirection
                redirect: function($state, $stateParams, dashboard, $timeout, $q){
                    var mid = $stateParams.dashboardId;
                    if (!mid) {
                        //timeout because the transition cannot happen from here
                        $timeout(function(){
                            $state.go("dashboards.list");
                        });
                        return $q.reject();
                    }
                }
            },
            ncyBreadcrumb: {
                // a bit ugly (and not stable), but ncybreadcrumbs doesn't support direct access
                // to a view controller yet if there are multiple views
                label: "{{dashboard.title || $$childHead.$$childHead.dashboard.title || 'Title'}}",
                parent: "dashboards.list"
            }

        }
    })
    .controller('dashboardDetailCtrl', function($scope, dashboard, $mdToast, $mdDialog, $stateParams, $state, currUser) {

        $scope.dashboard = dashboard.get({dashboardId: $stateParams.dashboardId});

        $scope.mayDelete;
        $scope.mayEdit = currUser.loggedIn();
        $scope.deletedashboard = deletedashboard;
        $scope.updatedashboard = updatedashboard;
        $scope.cancelEditingdashboard = function(){ showSimpleToast("Editing cancelled"); }

        $scope.dashboard.$promise.then(function(){
            $scope.mayDelete = $scope.dashboard.user && $scope.dashboard.user == currUser.getUser()._id;
        });

        $scope.$watch(function(){
            return currUser.loggedIn();
        }, function(loggedIn){
            if (!loggedIn) {
                $scope.mayDelete = false;
                $scope.mayEdit = false;
            } else {
                $scope.mayEdit = true;
                $scope.mayDelete = $scope.dashboard.user == currUser.getUser()._id;
            }
        });

        ////////////////////


        function updatedashboard(changed) {

            if (!changed) {
                showSimpleToast("no change");
                return;
            }

            $scope.dashboard.$update().then(function(updated){
                $scope.dashboard = updated;
                showSimpleToast("update successfull");
            }, function(){
                showSimpleToast("error. please try again later");
            });
        }

        function deletedashboard(ev) {

            var confirm = $mdDialog.confirm()
                .title('Are you sure you want to delete this dashboard?')
                .targetEvent(ev)
                .ok('Yes')
                .cancel('Abort');

            var toastText;
            $mdDialog.show(confirm).then(function() {
                return $scope.dashboard.$remove().then(function() {
                    return $state.go('dashboards.list');
                }).then(function(){
                    showSimpleToast('dashboard deleted successfully');
                }, function() {
                    showSimpleToast("Error. Try again later");
                });
            }, function() {
                showSimpleToast("delete aborted");
            })
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