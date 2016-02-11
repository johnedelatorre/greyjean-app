angular.module('app')
  .directive('gsScrollTo', ['$location', '$anchorScroll', function($location, $anchorScroll) {
    return {
      restrict: 'AC',
      link: function(scope, el, attr) {
        let address = '#' + attr.gsScrollTo
        let topY = $(address).offset().top;
        el.on('click', function(e) {
          $location.hash(attr.gsScrollTo);
          TweenMax.to($(window), 1, {
            scrollTo:{
              y: topY,
              autoKill: true
            },
            ease:Power3.easeOut
          });
        });
      }
    };
  }]);
