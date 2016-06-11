angular.module('myApp.profiles', ['ngResource', 'ui.router'])

    .config(function ($stateProvider, $urlRouterProvider, profileDetailsState) {
        $stateProvider

            .state('profiles', {

                abstract: true,
                parent: 'root',

                url: '/profile'

            })

            .state(profileDetailsState.name, profileDetailsState.options);

    });





