/**
 * Created by Tim0theus on 05.06.2016.
 */

'use strict';

angular.module('myApp.dashboards')

    .factory('Profile', function( $resource) {
        return $resource('http://localhost:3000/profile/');

    });