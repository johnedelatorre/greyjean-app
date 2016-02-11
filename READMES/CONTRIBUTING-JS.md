### JS - use the force Luke

### Formatting guidelines

* Indented with 2 spaces
* always use double quotes for strings
* SnakeCase controller names
* camelCase variable names
* comment like this please
* ex:

```js
// this is a single line comment

/**
 * This is a fancy single line comment
 *
 */

/**
 * This is a description for a fancy comment with docblockr goodness
 * includes variable name, type, and description
 * also description of what is returned
 *
 * @fingerprintInfo   {object}   info from $scope to create fingerprint
 *
 * @return {object}   Restangularized response from API
 */

```

* align things when possible by `=` or `:` or `=>` when applicable using alignTab
* try to split things into as many modular functions as possible for reuse
* make function params with `defaults` and use `rest` and `spread` when possible
* feel free to utilize `_lodash` for some funcitons as it much better suited for some tasks
* always use `=>` arrow function syntax for functions - there is no lexical `this` binding and looks so much cleaner
* split long lines into multiple lines when possible for readability and benefits thereof
* object keys quoted only when neccessary - they are getting mapped to form params anyway in HTTP request interceptor
* `keys` passed to IndexedDB are always `camelCase`
* `keys` passed to API are `SnakeCase` for now
* `keys` received from API are mostly `camelCase` for now (will stabilize in APIv2)
* `keys` received in response are mostly `SnakeCase` for now (will stabilize in APIv2)
* use `maps` instead of `objects` when possible
* use `sets` when possible for lists of data we can feed to a `map`
* if you are not sure how you should format particular code please ask
* no spaces after opening parens and none before close
* Ex:

```js
// GOOD
console.log(object);

//BAD
console.log( object );
```

* string concat notation with spaces before and after `+`
* Ex:

```js
// GOOD
console.log("object is " + object);

//BAD
console.log( 'this is the object '+object );
```

* to log to the console choose appropriate call for type of log choices are `console.log()`, `console.info()`, `console.warn()`, `console.error()`, and `console.assert()`
* explanation of console.assert()
* the console.assert() method conditionally displays an error string (its second parameter) only if its first parameter evaluates to false.
* here is a great explanation of console methods [here](https://developer.chrome.com/devtools/docs/console)
* example of `console.assert()`

```js
// this will only log when $scope.productPrice is bigger than 500
console.assert($scope.productPrice < 500, "Product price is > 500");
```

* log more than one call to console in one place in a `console.group("name of group")` with a `console.groupEnd()` to end that group
* Ex:

```js
// here we are creating a console.group() because we have more than one call to console then we have console.groupEnd() at the end
console.group("offer list")
// here we are breaking the console log across two lines to improve readability and indenting the 2nd line with 2 spaces
// here we are also using console.info to have this log show up as an info log instead of regular .log .warn or .error
console.info("query dbCore offers where merchantId equals merchantToken toArray found " +
  JSON.stringify(offerList, null, 4));
console.info($scope.offers);
// here this console.groupEnd() is the end of the console.group("offer list")
console.groupEnd();
```

* here is an example of calling a JSON-server endpoint with Restangular
* Ex:

```js
'use strict';

// DEMO: here we configure another additonal Restangular base url
angular.module('app')
  .factory('Info', function(Restangular) {
    return Restangular.withConfig(function(RestangularConfigurer) {
      RestangularConfigurer.setBaseUrl('http://localhost:2500/issues');
    });
  });

// Here we make a restful CRUD interface to work with our sample data stub endpoint in JSON-server
// DEMO: fetch all issues this will make a call to a url endpoint /issues which we have configured in the JSON-server apiV2.json stubs file
ListCtrl($scope, Info, Restangular) => {
  // DEMO: will return an array of issue objects
  $scope.issues = Info.all("issues").getList().$object;
}
// DEMO: here we make a controller to create an issue
CreateCtrl($scope, $location, Info, Restangular) => {
  $scope.save = function() {
    Info.all('issues')
      // DEMO: POST to /issues with $scope.issue object from scope
      .post($scope.issue)
      .then(issue => {
        $state.go('/list');
    });
  }
}
// DEMO: here we make a controller to edit and save the issue
EditCtrl($scope, $location, Info, Restangular, issue) => {
  let original = issue;
  // DEMO: here we get a copy of the object which we received earlier from the router based on :id params
  $scope.issue = Restangular.copy(original);

  $scope.destroy = () => {
    original.remove()
      .then(() => {
        $state.go('/list');
      });
  };

  $scope.save = () => {
    $scope.issue.put()
      .then(() => {
        $state.go('core.home');
      });
  };
}

```


* here is an example of an Controller with an IndexedDB transaction and some correctly formatted js
* comments for this demo on the style and formatting have `DEMO:` in the comment with simple single line comment format


```js
"use strict";

// DEMO: here we are using app.controller because this controller is being lazy loaded on route entrance

app.controller("OffersCtrl", ["$scope", "$rootScope", "$http", "Offer", "$filter",
  function(                    $scope,   $rootScope,   $http,   Offer,   $filter) {

    // DEMO: let is the new var - yay

    /**
     * get Dexie dbCore
     *
     */
    let dbCore = $rootScope.dbCore;
    /**
     * get merchantMe and merchantToken from Locker
     *
     */
    // DEMO: these vars are = aligned
    let merchantMe    = locker.driver("local").namespace("core").get("me");
    let merchantToken = locker.driver("local").namespace("core").get("merchantToken");

    // DEMO: here is the arrow function we are using: () => it is equivalent to function() with exception of no lexical this
    dbCore.transaction("rw", dbCore.offers, () => {
      dbCore.offers
        .where("merchantId")
        .equals(merchantMe.merchantId)
        // DEMO: here is an arrow function with a param: offerList => it is equivalent to function(offerList) with exception of no lexical this
        .toArray(offerList => {
          $scope.offers = offerList;
          $scope.$apply();
          // DEMO: here we are creating a console.group() because we have more than one call to console then we have console.groupEnd() at the end
          console.group("offer list")
          // DEMO: here we are breaking the console log across two lines to improve readability and indenting the 2nd line with 2 spaces
          // DEMO: here we are also using console.info to have this log show up as an info log instead of regular .log .warn or .error
          console.info("query dbCore offers where merchantId equals merchantToken toArray found " +
            JSON.stringify(offerList, null, 4));
          console.info($scope.offers);
          // DEMO: here this console.groupEnd() is the end of the console.group("offer list")
          console.groupEnd();
        });
    }).then(result => {
      // DEMO: here we are using console.log so that this log shows up as a .log
      console.log("Success - from the transaction list offers status code");
    }).catch(error => {
      console.group("offers transaction error")
      // DEMO: here we are using console.error to send this log as an error to console
      console.error(error.stack || error);
      // DEMO: here we are using console.warn to send this log as a warning to the console
      console.warn("Nope - from the transaction offers " + JSON.stringify(error, null, 4));
      console.groupEnd();
    });

}]);
```

#### es6 Harmony features using [6to5](http://6to5.org/docs/learn-es6/)

* we are using many es6 Harmony features please refer to this [great intro](http://6to5.org/docs/learn-es6/) to learn about es6 Harmony
* you can try out the features online in real time and see how they compile to es5 [in this online REPL](http://6to5.org/repl)
* we are transpiling our es6 Harmony JS to es5 during our build step
* we will start using a polyfill for some of the additional features soon
* currently all features are available that do not require a polyfill
* Mostly we are utilizing
  - arrow functions
  - maps
  - sets
  - defaults
  - rest
  - spread
  - let
  - const
  - symbols
  - generators
  - enhanced objet literals
  - destructuring
  - comprehensions
  - template strings
  - classes
  - iterators
* and more to come polyfill is added
  - hooray!

### more to be added soon
