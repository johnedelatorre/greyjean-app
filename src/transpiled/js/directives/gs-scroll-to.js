'use strict';

angular.module('app').directive('gsScrollTo', ['$location', '$anchorScroll', function ($location, $anchorScroll) {
  return {
    restrict: 'AC',
    link: function link(scope, el, attr) {
      var address = '#' + attr.gsScrollTo;
      var topY = $(address).offset().top;
      el.on('click', function (e) {
        $location.hash(attr.gsScrollTo);
        TweenMax.to($(window), 1, {
          scrollTo: {
            y: topY,
            autoKill: true
          },
          ease: Power3.easeOut
        });
      });
    }
  };
}]);
//# sourceMappingURL=gs-scroll-to.js.map