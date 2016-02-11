"use strict";

app.controller("FingerprintsCtrl", ["$scope", "$rootScope", "$http", "$mdToast", "Fingerprint", "$filter", function ($scope, $rootScope, $http, $mdToast, Fingerprint, $filter) {

  /**
   * get Dexie dbCore
   *
   */
  var dbCore = $rootScope.dbCore;
  /**
   * get merchantMe and merchantToken from Locker
   *
   */

  $scope.toggleWizardLoader = {
    showLoader: false
  };

  var merchantMe = locker.driver("local").namespace("core").get("me");
  var merchantToken = locker.driver("local").namespace("core").get("merchantToken");
  var productId = locker.driver("session").namespace("fingerprintCreate").get("activeFingerprintSocialTransactionId");
  var merchantFingerprints = $rootScope.allData.fingerprints;
  $scope.allFingerprints = {};
  //$scope.allFingerprints.list = {};
  //$scope.allFingerprints.count = 0;
  $scope.toggleWizardLoader.showLoader = true;
  Fingerprint.FingerprintAllData(merchantToken).then(function (resp) {
    //console.log($scope.allFingerprints.list.length);
    $scope.allFingerprints = resp.MerchantFingerprintAll;
    //$scope.allFingerprints.list = $scope.allFingerprints;
    $scope.toggleWizardLoader.showLoader = false;
  });

  $scope.trashFingerprint = function (index, fId) {
    var fingerprintId = {
      FingerprintId: fId,
      MerchantToken: merchantToken
    };

    var fingerprintInfo = {
      MerchantToken: merchantToken,
      MerchantFingerprintId: fId
    };

    Fingerprint.trash(fingerprintId).then(function (response) {

      var statusCode = response.FlikResponse.Status.StatusCode;
      var statusMessage = response.FlikResponse.Status.StatusMessage;

      if (statusCode == 0) {
        $scope.allFingerprints.splice(index, 1);
        //merchantFingerprints.list.splice(index, 1);
        //merchantFingerprints.count = merchantFingerprints.list.length;

        $mdToast.show($mdToast.simple().content("fingerprint deleted successfully").position("top right").hideDelay(2700));
      } else if (statusCode == 1 && statusMessage == "No record found" || statusCode == 1 && statusMessage == "Data in the request is either empty or of invalid format") {
        $mdToast.show($mdToast.simple().content(statusMessage).position("top right").hideDelay(2700));
      } else if (statusCode == 3) {

        /**
         * if we reach here merchantToken is no longer valid
         * we boot user back to signin
         *
         * TODO: add modal to reauth without back to signin page
         */
        locker.driver("local").namespace("core").forget("merchantToken");
        $state.go("access.signin");
        console.group("and the status is " + statusCode);
        console.warn(response + " token not valid - need to login again");
        console.info("bye -- see you soon");
        console.groupEnd();
      } else {

        $mdToast.show($mdToast.simple().content(statusMessage).position("top right").hideDelay(2700));
        console.warn(statusMessage + " this is the status message");
      }
    }, function (error) {

      $mdToast.show($mdToast.simple().content("there was an error deleting fingerprint please try again").position("top right").hideDelay(2700));
      console.warn(error + " this is the error from fingerprint delete");
    });

    Fingerprint.deleteProduct(fingerprintInfo).then(function (response) {

      var statusCode = response.FlikResponse.Status.StatusCode;
      var statusMessage = response.FlikResponse.Status.StatusMessage;
      if (statusCode == 0) {} else {
        $mdToast.show($mdToast.simple().content(statusMessage).position("top right").hideDelay(2700));
      }
    });

    Fingerprint.deleteCause(fingerprintInfo).then(function (response) {

      var statusCode = response.FlikResponse.Status.StatusCode;
      var statusMessage = response.FlikResponse.Status.StatusMessage;
      if (statusCode == 0) {} else {
        $mdToast.show($mdToast.simple().content(statusMessage).position("top right").hideDelay(2700));
      }
    });
  };
}]);
//# sourceMappingURL=fingerprints.js.map