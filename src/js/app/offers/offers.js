"use strict";

app.controller("OffersCtrl", ["$scope", "$rootScope", "$http", "$mdToast", "Offer", "$filter",
  function(                    $scope,   $rootScope,   $http,   $mdToast,   Offer,   $filter) {

    /**
     * get Dexie dbCore
     *
     */
    let dbCore = $rootScope.dbCore;
    /**
     * get merchantMe and merchantToken from Locker
     *
     */
    let merchantMe    = locker.driver("local").namespace("core").get("me");
    let merchantToken = locker.driver("local").namespace("core").get("merchantToken");

    let merchantOffers = $rootScope.allData.offers;
      $scope.allOffers = {};
      //$scope.allOffers.list = {};
      $scope.allOffers.count = 0;

      $scope.toggleWizardLoader = {
          showLoader: false
      }

      $scope.toggleWizardLoader.showLoader = true;

      Offer.OfferAllData(merchantToken).then(function() {
          $scope.allOffers = Offer.getOfferAllData();
          //$scope.allOffers.list = $scope.allOffers;
          $scope.toggleWizardLoader.showLoader = false;
      });

    $scope.trashOffer = (index, oId) => {

      let offerId = {
        OfferId: oId,
        MerchantToken: merchantToken
      }

      Offer.trash(offerId).then(response => {

        let statusCode    = response.FlikResponse.Status.StatusCode;
        let statusMessage = response.FlikResponse.Status.StatusMessage;

        if (statusCode == 0) {

          //merchantOffers.list.splice(index, 1);
          //merchantOffers.count = merchantOffers.list.length;

            $scope.allOffers.splice(index, 1);
            //$scope.allOffers.count = $scope.allOffers.list.length;

          $mdToast.show(
            $mdToast.simple()
              .content("offer deleted successfully")
              .position("top right")
              .hideDelay(2700)
          );

        } else if (statusCode == 1 && statusMessage == "No record found" ||
          statusCode == 1 && statusMessage ==  "Data in the request is either empty or of invalid format") {

          $mdToast.show(
            $mdToast.simple()
              .content(statusMessage)
              .position("top right")
              .hideDelay(2700)
          );

        } else if (statusCode == 3) {

          /**
           * if we reach here merchantToken is no longer valid
           * we boot user back to signin
           *
           * TODO: add modal to reauth without back to signin page
           */
          locker.driver("local")
            .namespace("core")
            .forget("merchantToken");
          $state.go("access.signin");
          console.group("and the status is " + statusCode);
          console.warn(response + " token not valid - need to login again");
          console.info("bye -- see you soon");
          console.groupEnd();

        } else {

          $mdToast.show(
            $mdToast.simple()
              .content(statusMessage)
              .position("top right")
              .hideDelay(2700)
          );
          console.warn(statusMessage + " this is the status message");

        }
      }, error => {

        $mdToast.show(
          $mdToast.simple()
            .content("there was an error deleting offer please try again")
            .position("top right")
            .hideDelay(2700)
        );
        console.warn(error + " this is the error from offer delete");

      });
    }

}]);
