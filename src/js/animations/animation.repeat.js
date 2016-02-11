"use strict";

angular.module('app')
  .animation('.repeat-animation', ['$timeout', function($timeout) {

    let queue = { enter : [], leave : [] };
    function queueAllAnimations(event, element, done, onComplete) {
      let index = queue[event].length;
      queue[event].push({
        element : element,
        done : done
      });
      queue[event].timer && $timeout.cancel(queue[event].timer);
      queue[event].timer = $timeout(function() {
        let elms = [], doneFns = [];
        angular.forEach(queue[event], function(item) {
          item && elms.push(item.element);
          doneFns.push(item.done);
        });
        let onDone = function() {
          angular.forEach(doneFns, function(fn) {
            fn();
          });
        };
        onComplete(elms, onDone);
        queue[event] = [];
      }, 10, false);

      return function() {
        queue[event] = [];
      };
    }

    return {
      enter : function(element, done) {
        element.css('opacity', 0);
        let cancel = queueAllAnimations('enter',
          element, done, function(elements, done) {

          TweenMax.allTo(elements, 1, { opacity : 1 }, 0.2, done);
        });
        return function onClose(cancelled) {
          cancelled && cancel();
        };
      },
      leave : function(element, done) {
        let cancel = queueAllAnimations('leave',
          element, done, function(elements, done) {

          TweenMax.allTo(elements, 1, { opacity : 0 }, 0.2, done);
        });
        return function onClose(cancelled) {
          cancelled && cancel();
        };
      }
    };
  }]);
