'use strict';

// signup controller
app.controller('SignupFormController', ['$scope', '$rootScope', 'Auth', '$state', function ($scope, $rootScope, Auth, $state) {

  $scope.authError = null;
  $scope.signup = function () {
    var merchantInfo = {
      FirstName: $scope.user.firstName,
      LastName: $scope.user.lastName,
      Email: $scope.user.email,
      Password: $scope.user.password,
      MobileNo: $scope.user.mobileNo
    };
    Auth.signup(merchantInfo).then(function (response) {
      var statusCode = response.FlikResponse.Status.StatusCode;
      var statusMessage = response.FlikResponse.Status.StatusMessage;
      console.log('this is the signup response ' + JSON.stringify(response, null, 4));
      if (statusCode == 0) {
        var merchantToken = response.FlikResponse.Data.MerchantToken.AuthToken;
        console.info('success' + JSON.stringify(response, null, 4));
        locker.driver('local').namespace('core').put('merchantToken', merchantToken);
        console.info('this is merchantToken ' + merchantToken);
        // $state.go('core.home');
        Auth.getMe(merchantToken).then(function (response) {
          var me = response.FlikResponse.Data.Merchant.Me;
          console.info('this is me ' + JSON.stringify(me, null, 4));
          if (statusCode == 0) {
            var _merchantInfo = {
              merchantId: me.merchantId,
              loginId: me.loginId,
              email: me.email,
              firstName: me.firstName,
              lastName: me.lastName,
              mobileNo: me.mobileNo,
              applicationKey: me.applicationKey,
              developerKey: me.developerKey
            };
            console.warn('and the status is on get me is ' + statusCode);
            locker.driver('local').namespace('core').put('me', _merchantInfo);
            $rootScope.merchantMe = _merchantInfo;
            console.log('Success - transaction writing merchant with ' + me.email + ' completed');
            $state.go('core.home');
            console.info('merchant name is ' + me.firstName + ' ' + me.lastName + ' with email ' + me.email);
          } else if (statusCode == 3) {
            console.warn('and the status is ' + statusCode);
            console.warn(response + ' token not valid - need to login again');
            locker.driver('local').namespace('core').forget('merchantToken');
            $state.go('access.signin');
          }
        }, function (error) {
          console.info('cannot validate token -- the error is ' + JSON.stringify(error, null, 4));
          Raven.captureMessage('API is giving error for getMe this is the error code ' + error.statusCode);
        });
      } else if (statusCode == 1) {
        console.warn('no bueno' + JSON.stringify(response, null, 4));
        $scope.authError = statusMessage;
      } else {
        console.warn('no bueno' + JSON.stringify(response, null, 4));
        $scope.authError = statusMessage;
      }
    }, function (error) {
      console.info('this is the signup error ' + error);
      $scope.authError = 'Server Error';
    });
  };
}]);
//# sourceMappingURL=signup.js.map