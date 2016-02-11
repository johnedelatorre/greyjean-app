'use strict';

angular.module('app').directive('flickity', function ($timeout) {
  return {
    restrict: 'A',
    link: function link(scope, element, attrs) {
      var isInitialized = false;
      scope.$watch(function () {
        return element[0].childNodes.length;
      }, function (newValue, oldValue) {
        if (newValue !== oldValue && !isInitialized) {
          $(element).flickity(scope.$eval(attrs.flickity));
          isInitialized = true;
        }
      });
    }
  };
});
//# sourceMappingURL=flickity.js.map