/**
 * Created by Tim0theus on 05.06.2016.
 */

'use strict';

angular.module('myApp.profiles')

    .factory('Profile', function( $resource) {
        return $resource('http://localhost:3000/profile/:username', {username:'@username'});

    })
    .factory('User', function($resource) {
        return $resource('http://localhost:3000/user/:id', {id:'@_id'});
    });