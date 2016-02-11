app.directive('nagPrism', ['$compile', '$timeout', function($compile, $timeout) {
    return {
        restrict: 'A',
        transclude: true,
        scope: {
          source: '@',
          code: '@'
        },
        link: function(scope, element, attrs, controller, transclude) {
            scope.$watch('source', function(v) {
              element.find("code").html(v);

              Prism.highlightElement(element.find("code")[0]);
            });
            var c;
            transclude(function(clone) {
              if (clone.html() !== undefined) {
                c = clone.html();
                element.find("code").html(c);
                $compile(element.contents())(scope.$parent);
              }
            });
            scope.$watch('code', function(v) {

              element.find("code").html(c);
              $compile(element.contents())(scope.$parent);
              $timeout(function() {
                Prism.highlightElement(element.find("code")[0]);
              });
            });
        },
        template: "<code></code>"
    };
}]);
