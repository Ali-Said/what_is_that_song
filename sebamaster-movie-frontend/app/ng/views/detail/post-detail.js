/**
 * Created by Timotheus on 13.06.2016.
 */
'use strict';

angular.module('myApp.posts')

    .constant('postDetailsState', {
        name: 'posts.detail',
        options: {
            url: '/:postId',

            views: {
                "content@root": {
                    templateUrl: 'views/detail/post-detail.html',
                    controller: 'PostDetailCtrl'
                }
            },
            ncyBreadcrumb: {
                label: "Request",
                parent: "dashboards.home"
            }


        }
    })
    .controller('PostDetailCtrl', function($rootScope, $scope, $state, $breadcrumb, $stateParams, currUser, Post, $mdMedia, $mdToast, $mdDialog) {
        $scope.post = Post.get({postId: $stateParams.postId}, function(success){
            if(angular.equals({}, success)) {
                $state.go("dashboards.home");
                return;
            }
        }, function(error) {
            $state.go("dashboards.home");
            return;
        });

        $scope.mayEdit = currUser.loggedIn() && currUser.getUser()._id == $scope.post._id;
        $scope.cancelEditingProfile = function(){ showSimpleToast("Editing cancelled"); };

        $scope.post.$promise.then(function(){
            $scope.mayDelete = $scope.post._id && $scope.post._id == currUser.getUser()._id;
        });

        $scope.$watch(function(){
            return currUser.loggedIn();
        }, function(loggedIn){
            if (!loggedIn) {
                $scope.mayDelete = false;
                $scope.mayEdit = false;
            } else {
                $scope.mayEdit = currUser.getUser()._id == $scope.post._id;
                $scope.mayDelete = $scope.post._id == currUser.getUser()._id;
            }
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

    })
    .controller('TinyMceController', function($scope, $stateParams, Post) {

        $scope.post = Post.get({postId: $stateParams.postId}, function(success){
            if(angular.equals({}, success)) {
                $state.go("dashboards.home");
                return;
            }
            $scope.tinymceModel = $scope.post.text;
        }, function(error) {
            $state.go("dashboards.home");
            return;
        });
        $scope.edit = edit;
        $scope.cancel = cancel;
        $scope.save = save;
        $scope.tinymceOptions = {
            plugins: 'link image code',
            toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code'
        };
        $scope.editing = false;

        function edit() {
            $scope.editing = true;
        }

        function cancel() {
            $scope.tinymceModel = $scope.post.text;
            $scope.editing = false;
        };

        function save() {
            $scope.tinymceModel = 'Time: ' + (new Date());
        };
    });