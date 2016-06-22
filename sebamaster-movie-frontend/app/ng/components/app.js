'use strict';
// Declare app level module which depends on views, and components
angular.module('myApp', ['ui.router', 'myApp.dashboards', 'myApp.profiles', 'myApp.posts', 'templates', 'ncy-angular-breadcrumb', 'ui.tinymce', 'ngMaterial', 'ngMessages', 'ngFileUpload'])

    .config(function($stateProvider, $urlRouterProvider, $locationProvider, $mdIconProvider, $resourceProvider, $httpProvider, $breadcrumbProvider, $mdThemingProvider) {


        var black = {
            '50': '#000000',
            '100': '#00000f',
            '200': '#0000ff',
            '300': '#000fff',
            '400': '#00ffff',
            '500': '#000000',
            '600': '#ffffff',
            '700': '#fffff0',
            '800': '#ffff00',
            '900': '#fff000',
            'A100': '#ff0000',
            'A200': '#f00000',
            'A400': '#000000',
            'A700': '#000000',
            'contrastDefaultColor': 'light'
        };

        $mdThemingProvider.definePalette('black',black);

        $mdThemingProvider.theme('whatsong')
            .primaryPalette('black');
        $mdThemingProvider.setDefaultTheme('whatsong');

        // For any unmatched url, redirect to /dashboards
        $urlRouterProvider.otherwise("/home");

        $locationProvider.html5Mode({enabled: true, requireBase: false}).hashPrefix('!');


        $stateProvider
            .state('root', {

                abstract: true,
                templateUrl: "views/root/root.html",
                ncyBreadcrumb: {
                    label: "Home"
                }
            });

        $mdIconProvider
            .iconSet('content', 'libs/material-design-icons/sprites/svg-sprite/svg-sprite-content.svg')
            .iconSet('action', 'libs/material-design-icons/sprites/svg-sprite/svg-sprite-action.svg')
            .iconSet('editor', 'libs/material-design-icons/sprites/svg-sprite/svg-sprite-editor.svg')
            .iconSet('navigation', 'libs/material-design-icons/sprites/svg-sprite/svg-sprite-navigation.svg')
            .iconSet('image', 'libs/material-design-icons/sprites/svg-sprite/svg-sprite-image.svg');

        //this overrides the defaults actiosn for all $resources
        angular.extend($resourceProvider.defaults.actions, {

            update: {
                method: "PUT"
            }

        });

        $httpProvider.interceptors.push('reqErrInterceptor');
        //auth interceptor
        $httpProvider.interceptors.push('authInterceptor');

        $breadcrumbProvider.setOptions({
            templateUrl:"components/breadcrumbs/breadcrumbs.html"
        });

    });
