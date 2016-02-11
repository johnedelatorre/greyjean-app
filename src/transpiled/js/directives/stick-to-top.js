'use strict';

angular.module('app').directive('stickToTop', ['$window', function ($window) {
  var $win = angular.element($window); // wrap window object as jQuery object

  return {
    restrict: 'A',
    link: function link(scope, element, attrs) {
      var topClass = attrs.stickToTop,
          // get CSS class from directive's attribute value
      offsetTop = element.offset().top; // get element's offset top relative to document

      $win.on('scroll', 'resize', function (e) {
        if ($win.scrollTop() >= offsetTop) {
          element.addClass(topClass);
          console.info('addin class scroll');
        } else {
          element.removeClass(topClass);
          console.info('remove dat class scroll');
        }
      });
    }
  };
}]);
//# sourceMappingURL=stick-to-top.js.map