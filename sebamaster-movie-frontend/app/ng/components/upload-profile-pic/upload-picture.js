angular.module('myApp.profiles')
    .controller('UserController', function ($rootScope, $scope, Upload, $mdDialog) {

        $scope.$watch('rejectedFiles', function () {
            if ($scope.rejectedFiles) {
                window.alert("File too big! Max: 2MB");
            }
        });

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
                }).$promise(function () {
                    $mdDialog.hide();
                    $rootScope.$broadcast('picture-changed', { picture: $scope.file.name });
                },
                function(error) {
                    window.alert("File too big");
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