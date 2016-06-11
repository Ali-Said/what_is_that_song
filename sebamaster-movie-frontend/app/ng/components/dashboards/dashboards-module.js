angular.module('myApp.dashboards', ['ngResource', 'ui.router'])

.config(function ($stateProvider,   $urlRouterProvider, dashboardDetailsState, dashboardListState) {
    $stateProvider

        .state('dashboards', {

            // With abstract set to true, that means this state can not be explicitly activated.
            // It can only be implicitly activated by activating one of its children.
            abstract: false,
            parent: 'root',

            url: '/home',

            views: {
                "content@root": {
                    templateUrl: 'views/list/dashboard-list.html',
                    controller: 'DashboardListCtrl'
                }
            },

        })


        // Using a '.' within a state name declares a child within a parent.
        // So you have a new state 'list' within the parent 'dashboards' state.
        .state(dashboardListState.name, dashboardListState.options)

        .state(dashboardDetailsState.name, dashboardDetailsState.options);

});





