angular.module('myApp.profiles', ['ngResource', 'ui.router'])

    .config(function ($stateProvider, $urlRouterProvider, profileDetailsState, profileListState) {
        $stateProvider

            .state('profiles', {

                abstract: true,
                parent: 'root',

                url: '/profile'

            })


            .state(profileListState.name, profileListState.options)

            .state(profileDetailsState.name, profileDetailsState.options);

    });





