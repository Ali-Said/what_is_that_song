/**
 * Created by Timotheus on 12.06.2016.
 */
angular.module('myApp.posts', ['ngResource', 'ui.router'])

    .config(function ($stateProvider,   $urlRouterProvider) {
        $stateProvider

            .state('posts', {

                // With abstract set to true, that means this state can not be explicitly activated.
                // It can only be implicitly activated by activating one of its children.
                abstract: true,
                parent: 'root',

                url: ''

            })


    });





