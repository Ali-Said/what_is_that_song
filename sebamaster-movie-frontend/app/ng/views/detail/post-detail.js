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
        $scope.updatePost = updatePost;
        $scope.edit = edit;
        $scope.editing = false;


        $scope.post.$promise.then(function(){
            $scope.mayDelete = $scope.post.user._id && $scope.post.user._id == currUser.getUser()._id;
        });



        var tabs = [ {title : 'newest', search: 'date', reverse: true}, {title: 'votes', search: 'votes', reverse: true}];
        $scope.selected = {};
        $scope.tabs = tabs;
        $scope.select = {selectedIndex: 1};

        $scope.$watch('select.selectedIndex', function(current, old){
            $scope.selected = tabs[current];
        });

        $scope.$on('comment-added', function(event, args) {
            $scope.post.comments.push(args);
            updatePost(true);
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
            $scope.request = $scope.post.text;
            $scope.editing = true;
        }

        function updatePost(changed) {

            if (!changed) {
                showSimpleToast("no change");
                return;
            }

            $scope.post.$update().then(function(){
                $rootScope.$broadcast('postUpdated', $scope.post);
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
            $scope.post.text = $scope.request;
            $scope.updatePost(true);
            $scope.$parent.editing = false;
        };
    })
    .controller('CommentController', function($rootScope, $scope, currUser, Post) {

        $scope.cancel = cancel;
        $scope.save = save;
        $scope.tinymceOptions = {
            plugins: 'link image code',
            toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code',
            forced_root_block: ''
        };
        $scope.comment = new Post();

        function cancel() {
            $scope.newComment = '';
        };

        function save() {
            $scope.comment.text = $scope.newComment;
            $scope.comment.type = "comment";
            $scope.comment.date = new Date();
            $scope.comment.user = currUser.getUser();
            $scope.comment.votes = 0;
            $scope.comment.$save(function(success) {
                $rootScope.$broadcast('comment-added', success);
            });
        };
    })
    .controller('AnswerListController', function($scope, currUser, Post) {

        $scope.mayEdit = false;

        if ($scope.comment._id)
            $scope.comment = Post.get({postId: $scope.comment._id}, function(success) {
                $scope.mayEdit = currUser.loggedIn() && currUser.getUser()._id == success.user._id;
            });



        $scope.editing = false;
        $scope.edit = edit;
        $scope.cancel = cancel;
        $scope.save = save;
        $scope.tinymceOptions = {
            plugins: 'link image code',
            toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code',
            forced_root_block: ''
        };

        function edit() {
            $scope.commentText = $scope.comment.text;
            $scope.editing = true;
        }

        function cancel() {
            $scope.commentText = $scope.comment.text;
        };

        function save(text) {
            $scope.comment.text = text;
            $scope.comment.$update();
            $scope.editing = false;
        };
    });