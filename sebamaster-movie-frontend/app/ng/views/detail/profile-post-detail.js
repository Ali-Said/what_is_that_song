'use strict';

angular.module('myApp.profiles')

    .constant('profilePostsDetailsState', {
        name: 'profiles.posts',
        options: {
            url: '/:username/posts',

            views: {
                "content@root": {
                    templateUrl: 'views/detail/profile-posts-detail.html',
                    controller: 'ProfilePostsDetailCtrl'
                }
            },
            ncyBreadcrumb: {
                label: "Posts",
                parent: "profiles.detail"
            }


        }
    })


    .controller('ProfilePostsDetailCtrl', function($rootScope, $scope, $state, $filter, $breadcrumb, $stateParams, currUser, Post, Profile, $mdMedia, $mdToast, $mdDialog) {

        $scope.type = 'request';

        Profile.get({username: $stateParams.username}, function(success){
            if(angular.equals({}, success)) {
                $state.go("dashboards.home");
                return;
            }
            $scope.profile = success;

            initializeValues();

        }, function(error) {
            $state.go("dashboards.home");
            return;
        });


        ////////////////////

        function initializeValues() {
            $scope.mayEdit = currUser.loggedIn() && currUser.getUser()._id == $scope.profile._id;

            Post.query(function(success) {
                $scope.posts = $filter('filter')(success, {user: $scope.profile._id}, true);
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