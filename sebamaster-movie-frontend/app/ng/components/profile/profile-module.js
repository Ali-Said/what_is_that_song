/**
 * Created by Tim0theus on 30.05.2016.
 */
angular.module('myApp.profile', ['ngResource', 'ui.router'])

    .config(function ($stateProvider,   $urlRouterProvider, profileState) {
        $stateProvider

            .state('root.profile', {

                // With abstract set to true, that means this state can not be explicitly activated.
                // It can only be implicitly activated by activating one of its children.
                abstract: false,
                parent: 'root',

                // This abstract state will prepend '/profile' onto the urls of all its children.
                url: '/profile',

                // since we have views we do not need to define a template here

                // Use `resolve` to resolve any asynchronous controller dependencies
                // *before* the controller is instantiated. In this case, since contacts
                // returns a promise, the controller will wait until contacts.all() is
                // resolved before instantiation. Non-promise return values are considered
                // to be resolved immediately.
                //resolve: {
                //    movies: ['contacts',
                //        function( contacts){
                //            return contacts.all();
                //        }]
                //},

                views: {
                    "content@root": {
                        templateUrl: 'views/profile/profile.html',
                    }
                },
                ncyBreadcrumb: {
                    label: "Profile",
                }

            })


            // Using a '.' within a state name declares a child within a parent.
            // So you have a new state 'list' within the parent 'movies' state.

            .state(profileState.name, profileState.options);

    });
