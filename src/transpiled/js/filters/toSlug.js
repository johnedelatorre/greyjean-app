'use strict';

angular.module('app').filter('toSlug', function () {
  return function (input) {
    if (input) {
      return input.replace(/[-\s]+/g, '_');
    }
  };
});
//# sourceMappingURL=toSlug.js.map