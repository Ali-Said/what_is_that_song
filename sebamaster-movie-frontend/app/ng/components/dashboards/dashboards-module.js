angular.module('myApp.dashboards', ['ngResource', 'ui.router'])

.config(function ($stateProvider,   $urlRouterProvider, dashboardsState) {
    $stateProvider

        .state('dashboards', {

            // With abstract set to true, that means this state can not be explicitly activated.
            // It can only be implicitly activated by activating one of its children.
            abstract: true,
            parent: 'root',

            url: ''

        })


        // Using a '.' within a state name declares a child within a parent.
        // So you have a new state 'list' within the parent 'dashboards' state.
        .state(dashboardsState.name, dashboardsState.options)

});





