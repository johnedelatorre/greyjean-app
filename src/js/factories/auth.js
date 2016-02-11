'use strict';

angular.module('app')
.factory('Auth',["$state", "$q", "locker", "Restangular",
  function(       $state,   $q,   locker,   Restangular){

    /**
     * our Restangular urls for Auth factory
     */
    var rAuthMerchant            = Restangular.all('auth/merchant');
    var rAuthCheck               = Restangular.all('auth/isActive');
    var rAuthLogout              = Restangular.all('auth/logOut');
    var rMerchantNew             = Restangular.all('merchant/new');
    var rMerchantMe              = Restangular.all('merchant/me');
    var rMerchantForgetPassword  = Restangular.all('merchant/newpassword');

    return {
      isLoggedIn: () => {
        var deferred = $q.defer();
        if (!locker.driver('local').namespace('core').has('merchantToken')) {
          return false
        } else {
          var merchantToken = locker.driver('local').namespace('core').get('merchantToken');
        }
        var token = {
              tokenKey: merchantToken
            }
        rAuthCheck.post(token)
          .then(function(response) {
            var statusCode = response.FlikResponse.Status.StatusCode;
            if (statusCode == 0) {
              console.warn('and the status is '+statusCode);
              console.info( 'good token --- \n' + locker.driver('local').namespace('core').get('merchantToken'));
              deferred.resolve(response);
            } else if (statusCode == 1) {
              $state.go('access.signin');
              console.group("and the status is %i", statusCode);
              console.warn(JSON.stringify(response, null, 4)+' token not valid - need to login again' );
              console.groupEnd();
              $state.go('access.signin');
              deferred.reject(response);
            }
          }, function(error){
            // var errorCode = error.FlikResponse.Status.StatusCode
            console.error( 'cannot validate token -- the error is ' + JSON.stringify(error, null, 4));
            // Raven.captureMessage('API is giving error for checkAuth with error code ' + JSON.stringify(errorCode, null, 4));
            $state.go('access.signin');
            deferred.reject(error);
          });
        return deferred.promise;
      },
      login: function(merchantCreds) {
        return rAuthMerchant.post(merchantCreds);
      },
      getMe: merchantToken => {
        var token = {
              MerchantToken: merchantToken
            };
        return rMerchantMe.post(token);
      },
      logout: merchantToken => {
        var token = {
              tokenKey: merchantToken
            };
        return rAuthLogout.post(token);
      },
      signup: merchantInfo => {
        return rMerchantNew.post(merchantInfo);
      },
    /**
     * Forget password restangular Api call that return password of merchant.
     *
     */
      newPassword: emailId =>{
        return rMerchantForgetPassword.post(emailId);
      }
    };
}]);
