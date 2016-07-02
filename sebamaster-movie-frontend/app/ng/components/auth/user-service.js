(function(){

    angular.module('myApp')
        .service('currUser', currUserService);

    function currUserService(BASEURL, $http, auth) {

        this.register = register;
        this.login = login;
        this.loggedIn = auth.isAuthed;
        this.logout = auth.deleteToken;
        this.getUser = getUser;


        ////////////////

        function register(email, user, pass) {
            return $http.post(BASEURL + '/signup', {
                email: email,
                username: user,
                password: pass
            });
        }

        function login(email, pass) {
            return $http.post(BASEURL + '/login', {
                email: email,
                password: pass
            });
        }

        function getUser() {
            var token = auth.getToken();
            return token? auth.parseJwt(token).user : {};
        }
    }

})();
