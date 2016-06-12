/**
 * Created by Timotheus on 12.06.2016.
 */

'use strict';

angular.module('myApp.posts')

    .factory('Post', function( $resource) {
        return $resource('http://localhost:3000/api/posts/:postId',  {postId: '@_id'});

    });