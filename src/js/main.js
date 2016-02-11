'use strict';

/* Controllers */
// NOTE :
// $rootScope being injected here only for
// DEV purpose

angular.module('app')
  .controller('AppCtrl', ['$scope', '$rootScope',  '$translate', '$localStorage', 'locker',  'Auth', '$state', '$timeout', '$window','$cookies',
    function(              $scope,   $rootScope,    $translate,   $localStorage,   locker,    Auth,   $state,   $timeout,   $window, $cookies) {

      let merchantMe    = locker.driver("local").namespace("core").get("me");
      let merchantToken = locker.driver("local").namespace("core").get("merchantToken");

      $rootScope.merchantMe = merchantMe;

      // add 'ie' classes to html
      let isIE = !!navigator.userAgent.match(/MSIE/i);
      isIE && angular.element($window.document.body).addClass('ie');
      isSmartDevice($window) &&
      angular.element($window.document.body).addClass('smart');

      // config
      $scope.app = {
        name    : 'Admin.Genie',
        version : '0.0.1',
        // for chart colors
        color: {
          primary : '#7266ba',
          info    : '#23b7e5',
          success : '#27c24c',
          warning : '#fad733',
          danger  : '#f05050',
          light   : '#e8eff0',
          dark    : '#3a3f51',
          black   : '#333238'
        },
        settings: {
          navbarHeaderColor   : 'bg-black',
          navbarCollapseColor : 'bg-white-only',
          asideColor          : 'bg-black'
        }
      }

      /**
       * custom array forEach function for perf
       * test it here http://jsperf.com/sdngjkn
       *
       * ZELDA:   =>    custom array forEach fun
       */
      Array.prototype.forEachCat = function(a) {
        let l = this.length;
        for (let i = 0; i < l; i++)a(this[i], i)
      }

      // save settings to local storage
      if ( angular.isDefined($localStorage.settings) ) {
        $scope.app.settings = $localStorage.settings;
      } else {
        $localStorage.settings = $scope.app.settings;
      }
      $scope.$watch('app.settings', function(){
        if( $scope.app.settings.asideDock  &&  $scope.app.settings.asideFixed ){
          // aside dock and fixed must set the header fixed.
          $scope.app.settings.headerFixed = true;
        }
        // save to local storage
        $localStorage.settings = $scope.app.settings;
      }, true);

      // angular translate
      $scope.lang = { isopen: false };
      $scope.langs = {en:'English', de_DE:'German', it_IT:'Italian'};
      $scope.selectLang = $scope.langs[$translate.proposedLanguage()] || "English";
      $scope.setLang = function(langKey, $event) {
        // set the current lang
        $scope.selectLang = $scope.langs[langKey];
        // You can change the language during runtime
        $translate.use(langKey);
        $scope.lang.isopen = !$scope.lang.isopen;
      };

      function isSmartDevice( $window )
      {
        // Adapted from http://www.detectmobilebrowsers.com
        let ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
        // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
        return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
      }

      //
      // helpers
      //
      //
      // og function from http://stackoverflow.com/questions/7532714/javascript-convert-objects-to-array-of-objects
      // let offerKeys = Object.keys(unsortedOffers);
      // let offerItems = [];
      // for (let j=0; j < offerKeys.length; j++) {
      //   offerItems[j] = unsortedOffers[offerKeys[j]];
      // }
      $scope.makeArrayMeow = function(objectToSort, objectKeys, sortedObject) {
        for (let j=0; j < objectKeys.length; j++) {
          sortedObject[j] = objectToSort[objectKeys[j]];
        }
      }

      //
      // logout hack
      //
      $scope.logoutHack = () => {
        Auth.logout(merchantToken).then(response => {
          let statusCode    = response.FlikResponse.Status.StatusCode;
          let statusMessage = response.FlikResponse.Status.StatusMessage;
          if (statusCode == 0) {
              //var cookies = $cookies.getAll();
              //angular.forEach(cookies, function (value, key) {
              //    $cookies.remove(key);
              //});
              delete $cookies['merchantToken'];
            console.warn('logged out and the status is ' + statusCode);
            $state.go("access.signin");
            console.info("bye " + statusMessage + " -- see you soon");
          } else if (statusCode == 1) {
            console.warn("logged out and the status is " + statusCode);
            $state.go("access.signin");
            console.info("there was an issue logging out " + statusMessage + " but bye anyways -- see you soon");
          } else {
            console.warn("logged out and the status is " + statusCode);
            $state.go("access.signin");
            console.info("there was an issue logging out " + statusMessage + " but bye anyways -- see you soon");
          }
        }, error => {
          console.warn(JSON.stringify(error, null, 4) + " there was an issue logging out but bye anyways");
          $state.go("access.signin");
        });
      }

      //
      // for dev
      //
      if (DEV_CORE) {
        window.locker   = locker;
        window.devScope = $scope;
        window.dbCore   = $rootScope.dbCore;
      }

  }]);
