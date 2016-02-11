'use strict';

angular.module('app').filter('toCapital', function () {
  return function (input, all) {
    return !!input ? input.replace(/([^\W_]+[^\s-]*) */g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }) : '';
  };
});
//# sourceMappingURL=toCapital.js.map