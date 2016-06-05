angular.module('myApp.profiles')
    .controller('UserController', ['$scope', 'Upload', function ($scope, Upload, currUser) {
        $scope.$watch('files', function () {
            $scope.upload($scope.files);
        });
        $scope.upload = function (file) {
            if (file) {
            //window.alert('we got a ' + currUser.getUser()._id)
            $scope.file = file;
            Upload.upload({
                url: 'http://localhost:3000/api/photo',//?id='+currUser.getUser()._id,
                file: file
            }).success(function (data, status, headers, config) {
                window.alert('wohooo')
            });
        }
    }
    }]);