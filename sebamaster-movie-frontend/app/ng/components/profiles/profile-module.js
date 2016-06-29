angular.module('myApp.profiles', ['ngResource', 'ui.router'])

    .config(function ($stateProvider, $urlRouterProvider, profileDetailsState, profileSongsDetailsState) {
        $stateProvider

            .state('profiles', {

                abstract: true,
                parent: 'root',

                url: '/profile'

            })

            .state(profileDetailsState.name, profileDetailsState.options)
            .state(profileSongsDetailsState.name, profileSongsDetailsState.options);

    });





