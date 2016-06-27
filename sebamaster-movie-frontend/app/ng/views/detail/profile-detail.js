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


     .controller('ProfileDetailCtrl', function($rootScope, $scope, $state, $breadcrumb, $stateParams, currUser, Profile, $mdMedia, $mdToast, $mdDialog) {
        $scope.profile = Profile.get({username: $stateParams.username}, function(success){
            if(angular.equals({}, success)) {
                $state.go("dashboards.home");
                return;
            }
        }, function(error) {
            $state.go("dashboards.home");
            return;
        },
        $scope.save = function (answer, answerForm){
            if(answerForm.$valid){
                alert("Your status is saved");
            }}
        );




        $scope.mayEdit = currUser.loggedIn() && currUser.getUser()._id == $scope.profile._id;
        $scope.updateProfile = updateProfile;
        $scope.uploadPictureDialog = uploadPictureDialog;
        $scope.cancelEditingProfile = function(){ showSimpleToast("Editing cancelled"); }

        $scope.profile.$promise.then(function(){
            $scope.mayDelete = $scope.profile._id && $scope.profile._id == currUser.getUser()._id;
        });

        $scope.$watch(function(){
            return currUser.loggedIn();
        }, function(loggedIn){
            if (!loggedIn) {
                $scope.mayDelete = false;
                $scope.mayEdit = false;
            } else {
                $scope.mayEdit = currUser.getUser()._id == $scope.profile._id;
                $scope.mayDelete = $scope.profile._id == currUser.getUser()._id;
            }
        });

        $scope.$on('picture-changed', function(event, args) {
            $scope.profile.picture = args.picture;
            updateProfile(true);
        });

        ////////////////////

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
                $rootScope.$broadcast('profileUpdated', $scope.profile);
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