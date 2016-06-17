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
            $scope.mayEdit = currUser.loggedIn() && currUser.getUser()._id == $scope.post.user._id;

            if(angular.equals({}, success)) {
                $state.go("dashboards.home");
                return;
            }
        }, function(error) {
            $state.go("dashboards.home");
            return;
        });

        $scope.cancelEditingProfile = function(){ showSimpleToast("Editing cancelled"); };
        $scope.edit = edit;
        $scope.editing = false;


        $scope.post.$promise.then(function(){
            $scope.mayDelete = $scope.post.user._id && $scope.post.user._id == currUser.getUser()._id;
        });



        var tabs = [ {title : 'oldest', search: 'date', reverse: true}, {title: 'votes', search: 'votes', reverse: true}];
        $scope.selected = {};
        $scope.tabs = tabs;
        $scope.select = {selectedIndex: 1};

        $scope.$watch('select.selectedIndex', function(current, old){
            $scope.selected = tabs[current];
        });




        $scope.$watch(function(){
            return currUser.loggedIn();
        }, function(loggedIn){
            if (!loggedIn) {
                $scope.mayDelete = false;
                $scope.mayEdit = false;
            } else if($scope.post.user) {
                $scope.mayEdit = currUser.getUser()._id == $scope.post.user._id;
                $scope.mayDelete = $scope.post.user._id == currUser.getUser()._id;
            }
        });

        $scope.$on('logged-in', function(event, args) {
            $scope.mayEdit = currUser.getUser()._id == $scope.post.user._id;
            $scope.mayDelete = $scope.post.user._id == currUser.getUser()._id;
        });


        ////////////////////

        function edit() {
            $scope.editing = true;
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
    .controller('RequestController', function($scope) {

        $scope.cancel = cancel;
        $scope.save = save;
        $scope.tinymceOptions = {
            plugins: 'link image code',
            toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code'
        };


        function cancel() {
            $scope.request = $scope.post.text;
            $scope.$parent.editing = false;
        };

        function save() {
            $scope.request = 'Time: ' + (new Date());
        };
    })
    .controller('CommentsController', function($scope) {


        $scope.cancel = cancel;
        $scope.save = save;
        $scope.tinymceOptions = {
            plugins: 'link image code',
            toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code'
        };

        function cancel() {
            $scope.newComment = $scope.post.text;
        };

        function save() {
            $scope.newComment = 'Time: ' + (new Date());
        };
    });