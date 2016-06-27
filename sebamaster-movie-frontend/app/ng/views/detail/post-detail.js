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
    .controller('PostDetailCtrl', function($rootScope, $scope, $state, $filter, $breadcrumb, $stateParams, currUser, Post, $mdMedia, $mdToast, $mdDialog) {

        $scope.cancelEditingProfile = function(){ showSimpleToast("Editing cancelled"); };
        $scope.updatePost = updatePost;
        $scope.rated = rated;
        $scope.edit = edit;
        $scope.editing = false;
        $scope.personalRating = {rating: 0};



        var tabs = [ {title : 'newest', search: 'date', reverse: true}, {title: 'votes', search: 'votes', reverse: true}];
        $scope.selected = {};
        $scope.tabs = tabs;
        $scope.select = {selectedIndex: 1};

        $scope.post = Post.get({postId: $stateParams.postId}, function(success){
            if(angular.equals({}, success)) {
                $state.go("dashboards.home");
                return;
            }

            initValues(success);


        }, function(error) {
            $state.go("dashboards.home");
            return;
        });

        $scope.$watch('select.selectedIndex', function(current, old){
            $scope.selected = tabs[current];
        });

        function rated(rating) {
            $scope.personalRating.rating = rating;
            if (!$scope.personalRating.user) {
                $scope.personalRating.user = currUser.getUser()._id;
                $scope.post.voters.push($scope.personalRating);
            }

            $scope.post.rating = average($scope.post.voters);

            updatePost(true);

            function average(data) {
                var sum = 0;
                for (var i = 0; i < data.length; i++)
                {
                    sum += parseInt(data[i].rating, 10); //don't forget to add the base }

                    var avg = sum / data.length;

                    return avg;
                }
            };

        };

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

        $scope.$on('changed-comment', function(event, args) {
            Post.get({postId: $stateParams.postId}, function(success) {
                initValues(success);
                $scope.post.comments = success.comments;
            });
        });


        ////////////////////

        function initValues(success) {
            $scope.mayEdit = currUser.loggedIn() && currUser.getUser()._id == $scope.post.user._id;
            $scope.mayDelete = $scope.post.user._id && $scope.post.user._id == currUser.getUser()._id;

            var result = $filter('filter')(success.voters, {user: currUser.getUser()._id}, true);
            result && result.length > 0 ? $scope.personalRating = result[0] : $scope.personalRating = {rating: 0};
        }

        function edit() {
            $scope.request = $scope.post.text;
            $scope.editing = true;
        }

        function updatePost(changed) {

            if (!changed) {
                showSimpleToast("no change");
                return;
            }

            $scope.post.$update().then(function(success){
                initValues(success);
                $rootScope.$broadcast('postUpdated', success);
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
    .controller('AnswerListController', function($rootScope, $scope, $filter, currUser, Post) {

        $scope.mayEdit = false;
        $scope.vote = {};
        $scope.voteData = null;
        $scope.vote.voted = false;
        $scope.votedUp = false;
        $scope.voedDown = false;

        if ($scope.comment._id)
            $scope.comment = Post.get({postId: $scope.comment._id}, function(success) {
                $scope.mayEdit = currUser.loggedIn() && currUser.getUser()._id == success.user._id;
                $scope.voteData = $filter('filter')($scope.comment.voters, {user: currUser.getUser()._id}, true);
                $scope.voteData && $scope.voteData.length > 0 ? $scope.voteData = $scope.voteData[0] : $scope.voteData = null;
                if ($scope.voteData) {
                    $scope.vote.voted = $scope.voteData.user ? true : false;
                    $scope.votedUp = $scope.vote.voted && $scope.voteData.up;
                    $scope.votedDown = $scope.vote.voted && !$scope.voteData.up;
                }
            });


        $scope.voteUp = voteUp;
        $scope.voteDown = voteDown;
        $scope.updateVoteData = updateVoteData;
        $scope.editing = false;
        $scope.edit = edit;
        $scope.cancel = cancel;
        $scope.save = save;
        $scope.tinymceOptions = {
            plugins: 'link image code',
            toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code',
            forced_root_block: ''
        };


        function voteUp() {
            if ($scope.votedUp) {
                $scope.comment.votes--;
                $scope.voted = false;
            }
            else if ($scope.votedDown) {
                $scope.comment.votes += 2;
            }
            else {
                $scope.comment.votes++;
                $scope.voted = true;
            }
            $scope.votedDown = false;
            $scope.votedUp = !$scope.votedUp;

            updateVoteData();
        }

        function voteDown() {
            if ($scope.votedDown) {
                $scope.comment.votes++;
                $scope.voted = false;
            }
            else if ($scope.votedUp)
                $scope.comment.votes -= 2;
            else {
                $scope.comment.votes--;
                $scope.voted = true;
            }
            $scope.votedUp = false;
            $scope.votedDown = !$scope.votedDown;

            updateVoteData();

        }

        function updateVoteData() {
            if ($scope.voteData) {

                if ($scope.voted) {
                    $scope.voteData.up = $scope.votedUp;
                }
                else {
                    $scope.comment.voters.splice($scope.comment.voters.indexOf($scope.voteData),1);
                    $scope.voteData = null;
                }
            }
            else {
                $scope.voteData = {user: currUser.getUser()._id, up: $scope.votedUp};
                $scope.comment.voters.push($scope.voteData);
            }

            $scope.comment.$update();
            $rootScope.$broadcast('changed-comment', $scope.comment);

        }

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