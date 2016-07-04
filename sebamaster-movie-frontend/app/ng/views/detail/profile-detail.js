'use strict';

angular.module('myApp.profiles')

    .constant('profileDetailsState', {
        name: 'profiles.detail',
        options: {
            url: '/:username',

            views: {
                "content@root": {
                    templateUrl: 'views/detail/profile-detail.html',
                    controller: 'ProfileDetailCtrl'
                }
            },
            ncyBreadcrumb: {
                label: "Profile: {{profile.username}}",
                parent: "dashboards.home"
            }


        }
    })


     .controller('ProfileDetailCtrl', function($rootScope, $scope, $state, $filter, $breadcrumb, $stateParams, currUser, Track, Profile, Post, $mdMedia, $mdToast, $mdDialog) {

        $scope.profile = Profile.get({username: $stateParams.username}, function(success){
            if(angular.equals({}, success)) {
                $state.go("dashboards.home");
                return;
            }

            Post.query(function(success) {
                $scope.posts = $filter('filter')(success, {user: $scope.profile._id}, true);
            })


        }, function(error) {
            $state.go("dashboards.home");
            return;
        });

         
         $scope.edit = edit;
         $scope.save = save;
         $scope.cancel = cancel;
         $scope.editing = false;
        $scope.updateProfile = updateProfile;
        $scope.uploadPictureDialog = uploadPictureDialog;
        $scope.cancelEditingProfile = function(){ showSimpleToast("Editing cancelled"); }

        $scope.profile.$promise.then(function(){
            $scope.mayDelete = $scope.profile._id && $scope.profile._id == currUser.getUser()._id;
            $scope.mayEdit = currUser.loggedIn() && currUser.getUser()._id == $scope.profile._id;
        });

        $scope.$watch(function(){
            return currUser.loggedIn();
        }, function(loggedIn){
            if (!loggedIn) {
                $scope.mayDelete = false;
                $scope.mayEdit = false;
            } else {
                $scope.mayEdit = currUser.loggedIn() && currUser.getUser()._id == $scope.profile._id;
                $scope.mayDelete = $scope.profile._id == currUser.getUser()._id;
            }
        });

        $scope.$on('picture-changed', function(event, args) {
            $scope.profile.picture = args.picture;
            updateProfile(true);
        });

        ////////////////////

         function edit() {
             $scope.tempProfile = $scope.profile;
             $scope.dt = new Date($scope.profile.birthday);
             $scope.editing = true;
         }

         function cancel() {
             $scope.cancelEditingProfile();
             $scope.editing = false;
         }

         function save() {
             $scope.profile = $scope.tempProfile;
             $scope.updateProfile(true);
             $scope.editing = false;
         }

        function uploadPictureDialog(ev) {
            var useFullScreen = ( $mdMedia('xs'));
            $mdDialog.show({
                controller: "UserController",
                templateUrl: 'components/upload-profile-pic/upload-picture.html',
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: useFullScreen,
                preserveScope:true
            })
                .then(function(answer) {
                    showSimpleToast('Profile Picture saved successfully');
                }, function() {
                    //showSimpleToast('You do not wanna save?');
                });

        }

        function updateProfile(changed) {

            if (!changed) {
                showSimpleToast("no change");
                return;
            }

            $scope.profile.$update().then(function(){
                $rootScope.$broadcast('profile-updated', $scope.profile);
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

     .controller ('FrmController', function ($scope,currUser) {
         $scope.btn_add = addComment;
         $scope.remItem = deleteComment;

        

         //////////

         function addComment() {
             if ($scope.txtcomment != '') {
                 $scope.$parent.profile.status.push($scope.txtcomment);
                 $scope.$parent.updateProfile(true);
             }
         }

         function deleteComment(index) {
             $scope.$parent.profile.status.splice(index, 1);
             $scope.$parent.updateProfile(true);
         }



    });