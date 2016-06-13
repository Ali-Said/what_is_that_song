angular.module('myApp.profiles')
    .controller('UserController', function ($rootScope, $scope, Upload, $mdDialog) {

        $scope.upload = function (file) {
            if (file) {
                $scope.file = file;
            }
        }

        $scope.save = function() {
            if ($scope.picFile) {
                Upload.upload({
                    url: 'http://localhost:3000/api/photo',
                    file: $scope.picFile
                }).success(function () {
                    $mdDialog.hide();
                    $rootScope.$broadcast('picture-changed', { picture: $scope.picFile.name });
                });
            }
            else {
                
                //window.alert("File too big! Max: 2MB");
                return;
            }
        }

        $scope.cancel = function() {
            $mdDialog.cancel();
        };
    });