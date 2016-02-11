'use strict';

angular.module('app').directive('gsWidgetOpen', function () {
  var linker = function linker(scope, element, attrs) {
    // let
    var tl = new TimelineLite();
    tl.to(element, 1, { width: '100%', ease: Power2.easeOut });
    tl.to(element, 1, { height: '450px', ease: Power2.easeOut }, '+=1.0');
    // tl.call(loadWidget);
    tl.stop();

    // function loadWidget = {

    // }

    scope.play = function () {
      tl.play();
    };

    scope.reverse = function () {
      tl.reverse();
    };
  };

  return {
    scope: true,
    link: linker
  };
});
//# sourceMappingURL=gs-widget-open.js.map