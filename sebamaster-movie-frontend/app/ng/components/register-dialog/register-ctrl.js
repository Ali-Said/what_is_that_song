angular.module('myApp')
    .controller("register", function ($scope, currUser, $mdDialog) {
        $scope.email = '';
        $scope.username = '';
        $scope.pwd = '';
        $scope.pwdConfirm
        $scope.birthday = '';
        $scope.errorText = '';

        $scope.register = register;
        $scope.cancel = cancel;

        function register() {
            currUser.register($scope.email, $scope.username, $scope.pwd).then(function () {
                $mdDialog.hide();
            }, function (response) {
                //debugger;
                if (response.status == 400 || response.status == 401) {
                    $scope.errorText = "An unknown error occured. please try again later.";
                }
                else if (response.status == 500) {
                    if (response.data.errmsg.contains("username")) {
                        $scope.errorText = "Username already taken!";
                    }
                    else {
                        $scope.errorText = "E-Mail already exists!";
                    }
                }
            });
        }

        function cancel() {
            $mdDialog.cancel();
        }
    });
