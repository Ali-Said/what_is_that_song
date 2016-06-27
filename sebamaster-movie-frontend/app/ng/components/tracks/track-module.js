/**
 * Created by Екатерина on 27.06.2016.
 */

angular.module('myApp.tracks', ['ngResource', 'ui.router'])

    .config(function ($stateProvider,   $urlRouterProvider) {
        $stateProvider

            .state('tracks', {

                // With abstract set to true, that means this state can not be explicitly activated.
                // It can only be implicitly activated by activating one of its children.
                abstract: true,
                parent: 'root',

                url: '/tracks'

            })

    });