angular.module('myApp')
    .controller("login", function ($rootScope, $scope, currUser, $mdDialog) {
        $scope.email = '';
        $scope.pwd = '';
        $scope.errorText = '';

        $scope.login = login;
        $scope.cancel = cancel;

        function login() {
            currUser.login($scope.email, $scope.password).then(function () {
                $rootScope.$broadcast('logged-in');
                $mdDialog.hide();
            }, function (response) {
                if (response.status == 400 || response.status == 401) {
                    $scope.errorText = "Wrong email or password.";
                } else {
                    $scope.errorText = response.toString();
                }
            });
        }

        function cancel() {
            $mdDialog.cancel();
        }
    });
