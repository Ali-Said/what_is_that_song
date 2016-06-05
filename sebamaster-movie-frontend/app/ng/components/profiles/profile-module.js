angular.module('myApp.profiles', ['ngResource', 'ui.router'])

    .config(function ($stateProvider,   $urlRouterProvider, profileDetailsState, profileListState) {
        $stateProvider

            .state('profiles', {

                abstract: true,
                parent: 'root',

                url: '/profile'

            })


            // Using a '.' within a state name declares a child within a parent.
            // So you have a new state 'list' within the parent 'movies' state.
            .state(profileListState.name, profileListState.options)

            .state(profileDetailsState.name, profileDetailsState.options);

    });





