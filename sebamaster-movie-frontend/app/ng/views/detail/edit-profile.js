/**
 * Created by Екатерина on 29.06.2016.
 */
angular.module('myApp.profiles')
    .controller("edit", function ($scope, currUser, $mdDialog) {

        $scope.username = '';
        $scope.name = '';
        $scope.birthday = '';


        $scope.cancel = cancel;
        $scope.save = save;
        $scope.updateProfile = updateProfile;

        ///////

        function showSimpleToast(txt) {
            $mdToast.show(
                $mdToast.simple()
                    .textContent(txt)
                    .position('bottom right')
                    .hideDelay(3000)
            );
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


        function cancel() {
            $mdDialog.cancel();
        }

        function save() {
            if ($scope.username != '', $scope.name != '', $scope.birthday != '') {
                $scope.$parent.profile.username.push($scope.username);
                $scope.$parent.profile.name.push($scope.name);
                $scope.$parent.profile.birthday.push($scope.birthday);
                $scope.$parent.updateProfile(true);
            }
        }

    });