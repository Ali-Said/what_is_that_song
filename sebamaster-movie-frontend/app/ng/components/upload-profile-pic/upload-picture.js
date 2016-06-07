angular.module('myApp.profiles')
    .controller('UserController', function ($rootScope, $scope, Upload, $mdDialog) {

        $scope.upload = function (file) {
            if (file) {
                $scope.file = file;
            }
        }

        $scope.save = function() {
            if ($scope.file) {
                Upload.upload({
                    url: 'http://localhost:3000/api/photo',
                    file: $scope.file
                }).success(function () {
                    $mdDialog.hide();
                    $rootScope.$broadcast('picture-changed', { picture: $scope.file.name });
                });
            }
            else {
                $mdDialog.hide();
                return "No file";
            }
        }

        $scope.cancel = function() {
            $mdDialog.cancel();
        };
    });