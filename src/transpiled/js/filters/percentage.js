'use strict';

angular.module('app').filter('percentage', function ($filter) {
  return function (input, decimals) {
    return $filter('number')(input * 100, decimals) + '%';
  };
});
//# sourceMappingURL=percentage.js.map