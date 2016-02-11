'use strict';

/* Filters */
// need to load moment.js first to use this filter.
angular.module('app')
  .filter('fromNow', function() {
    return function(date) {
      return moment(date).fromNow();
    }
  });
