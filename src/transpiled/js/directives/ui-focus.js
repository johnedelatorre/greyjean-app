'use strict';

angular.module('app').directive('uiFocus', ['$timeout', '$parse', function ($timeout, $parse) {
  return {
    link: function link(scope, element, attr) {
      var model = $parse(attr.uiFocus);
      scope.$watch(model, function (value) {
        if (value === true) {
          $timeout(function () {
            element[0].focus();
          });
        }
      });
      element.bind('blur', function () {
        scope.$apply(model.assign(scope, false));
      });
    }
  };
}]);
//# sourceMappingURL=ui-focus.js.map