'use strict';

angular.module('app').directive('uiScroll', ['$location', '$anchorScroll', function ($location, $anchorScroll) {
  return {
    restrict: 'AC',
    link: function link(scope, el, attr) {
      el.on('click', function (e) {
        $location.hash(attr.uiScroll);
        $anchorScroll();
      });
    }
  };
}]);
//# sourceMappingURL=ui-scroll.js.map