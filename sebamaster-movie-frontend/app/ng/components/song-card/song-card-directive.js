'use strict';

angular.module('myApp.profiles')

    .directive('mvSongCard', function() {
        return {
            restrict: 'A',
            scope: {
                song: '='
            },
            templateUrl: 'components/song-card/song-card.html'
        };
    });
