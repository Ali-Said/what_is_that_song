/**
 * Created by Tim0theus on 01.06.2016.
 */
'use strict';

angular.module('myApp.profile')

    .constant('profileState', {
        name: 'profile',
        options: {
            url: ''


        }
    })
    .controller('ProfileCtrl', function($scope, Profile) {

        $scope.profile = Profile.query();

    });
