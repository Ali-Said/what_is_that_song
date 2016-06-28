/**
 * Created by Екатерина on 27.06.2016.
 */

'use strict';

angular.module('myApp.tracks')

    .factory('Track', function( $resource) {
        return $resource('http://localhost:3000/api/tracks/:trackId',  {trackId: '@_id'}, {
            update: {
                method: 'PUT'
            }
        });

    });