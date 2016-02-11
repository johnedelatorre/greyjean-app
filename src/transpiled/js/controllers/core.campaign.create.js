"use strict";

app.filter("propsFilter", function () {
  return function (items, props) {
    var out = [];

    if (angular.isArray(items)) {
      items.forEach(function (item) {
        var itemMatches = false;

        var keys = Object.keys(props);
        for (var i = 0; i < keys.length; i++) {
          var prop = keys[i];
          var text = props[prop].toLowerCase();
          if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
            itemMatches = true;
            break;
          }
        }

        if (itemMatches) {
          out.push(item);
        }
      });
    } else {
      // Let the output be the input untouched
      out = items;
    }

    return out;
  };
});

app.controller("CoreCampaignCreateCtrl", ["$scope", "$rootScope", "locker", "Campaign", "$state", "$stateParams", "$filter", "$mdToast", "$mdDialog", "$animate", "Fingerprint", "Offer", "Auth", "$cookies", function ($scope, $rootScope, locker, Campaign, $state, $stateParams, $filter, $mdToast, $mdDialog, $animate, Fingerprint, Offer, Auth, $cookies) {

  $scope.allData = $rootScope.allData;
  $scope.isDisabled = false;
  $scope.allFingerprints = {};
  $scope.allOffers = {};
  var paginateOffersVariable = 1;
  var paginateFingerprintsVariable = 1;
  //if(!Offer.offerAllData)
  //{
  //    console.log("in if router");
  //    var merchantId = $cookies.merchantToken;
  //    console.log(merchantId);
  //    Offer.OfferAllData(merchantId).then(function() {
  //        $scope.allOffers = Offer.getOfferAllData();
  //        console.log("data offer is");
  //        console.log($scope.allOffers);
  //    });
  //}
  //else {
  //    console.log("in else config");
  //    $scope.allOffers = Offer.getOfferAllData();
  //
  //    console.log($scope.allFingerprints);
  //}

  //if(!Fingerprint.fingerprintAllData)
  //{
  //    console.log("in if router");
  //    var merchantId = $cookies.merchantToken;
  //    console.log(merchantId);
  //    Fingerprint.FingerprintAllData(merchantId).then(function() {
  //        $scope.allFingerprints = Fingerprint.getFingerprintAllData();
  //        console.log("data fingerprint is");
  //        console.log($scope.allFingerprints);
  //    });
  //}
  //else {
  //    console.log("in else config");
  //        $scope.allFingerprints = Fingerprint.getFingerprintAllData();
  //        console.log("data fingerprint is");
  //        console.log($scope.allFingerprints);
  //}

  /**
   * get merchantMe and merchantToken from Locker
   *
   */
  var merchantMe = locker.driver("local").namespace("core").get("me");
  var merchantToken = locker.driver("local").namespace("core").get("merchantToken");
  // let smerchantToken = locker.driver('local').namespace('core').get('smerchantToken');
  // alert(smerchantToken);
  var cred = locker.driver('local').namespace('core').get('merchantCreds');

  locker.namespace("campaignCreate").bind($scope, "campaignName");
  $scope.campaignName = "";

  /**
   * limits campaignName to a-z 0-9 and spaces only
   *
   * @$scope.wordsOnly  {RegExp}
   */
  $scope.wordsOnly = /^[a-zA-Z0-9 ]*$/;

  var start = 0;
  var limit = 30;
  var queryString = '';
  Offer.OfferPaginateAllData(start, limit, merchantToken).then(function () {
    $scope.allOffers = Offer.getOfferPaginateAllData();
  });
  Fingerprint.FingerprintPaginateAllData(start, limit, merchantToken).then(function () {
    $scope.allFingerprints = Fingerprint.getFingerprintPaginateAllData();
  });

  /**
   * get active fingerprint and offer from Dexie dbCore
   *
   */
  var hasActiveFingerprintId = locker.driver("session").namespace("fingerprintCreate").has("activeFingerprintId");
  var activeFingerprintId = hasActiveFingerprintId ? locker.driver("session").namespace("fingerprintCreate").get("activeFingerprintId") : {};
  var hasActiveOfferId = locker.driver("session").namespace("offerCreate").has("activeOfferId");
  var activeOfferId = hasActiveOfferId ? locker.driver("session").namespace("offerCreate").get("activeOfferId") : {};
  var hasActiveProductId = locker.driver("session").namespace("productCreate").has("activeProductId");
  var activeProductId = hasActiveProductId ? locker.driver("session").namespace("productCreate").get("activeProductId") : {};

  locker.namespace("campaignCreate").bind($scope, "fingerprint.selected");
  //$scope.fingerprint.selected  = $filter('where')($rootScope.allData.fingerprints.list, {fingerprintId: activeFingerprintId})[0];
  $scope.fingerprint.selected = $filter('where')($scope.allFingerprints, { fingerprintId: activeFingerprintId })[0];
  locker.namespace("campaignCreate").bind($scope, "offer.selected");
  //$scope.offer.selected  = $filter('where')($rootScope.allData.offers.list, {offerId: activeOfferId})[0];
  $scope.offer.selected = $filter('where')($scope.allOffers, { offerId: activeOfferId })[0];

  locker.namespace("campaignCreate").bind($scope, "productWithTransaction.selected");
  $scope.productWithTransaction.selected = $filter('where')($rootScope.allData.productsWithTransaction.list, { productId: activeProductId })[0];
  $scope.toggleWizardLoader = {
    showLoader: false
  };

  /**
   * radius
   *
   */
  //$scope.radius =[
  //    {radius:"1"},
  //    {radius:"5"},
  //    {radius:"10"},
  //    {radius:"15"},
  //    {radius:"20"}
  //];
  //
  //$scope.campaignRadius = {};

  //if (!$stateParams.id) {
  //    locker.namespace("campaignCreate")
  //        .bind($scope, "campaignRadius.selected");
  //    $scope.campaignRadius.selected = {};
  //    $scope.campaignRadius.selected = {radius:"10"};

  //}

  //
  /**
   * get triggers
   *
   */
  $scope.trigger = {};
  $scope.triggers = [{ name: "Home" }, { name: "Store" }, { name: "Work" }];

  /**
   * campaign budget
   *
   */
  $scope.campaignBudget = 1000;

  $scope.rangeBudget = {
    minIncome: 0,
    maxIncome: 1000000
  };

  /**
   * datetimepicker for campaign
   */

  $scope.campaignDates = {
    startDate: null,
    endDate: null
  };

  $scope.addMoreOfferItems = function () {

    var limit = 30;
    var start = limit * paginateOffersVariable;

    Offer.OfferPaginateAllData(start, limit, merchantToken).then(function () {
      $scope.allOffers = $scope.allOffers.concat(Offer.getOfferPaginateAllData());
    });
    paginateOffersVariable = paginateOffersVariable + 1;
  };

  $scope.addMoreFingerprintItems = function () {

    var limit = 30;
    var start = limit * paginateFingerprintsVariable;

    Fingerprint.FingerprintPaginateAllData(start, limit, merchantToken).then(function () {
      $scope.allFingerprints = $scope.allFingerprints.concat(Fingerprint.getFingerprintPaginateAllData());
    });
    paginateFingerprintsVariable = paginateFingerprintsVariable + 1;
  };

  $scope.refreshList = function () {
    queryString = query;
  };
  //console.log(`this is allData ${JSON.stringify($rootScope.allData, null, 4)}`);

  $scope.dateTimeNow = function () {
    $scope.campaignDates.startDate = new Date();
    $scope.campaignDates.endDate = new Date();
  };
  $scope.dateTimeNow();

  $scope.toggleMinDate = function () {
    $scope.minDate = $scope.minDate ? null : new Date();
  };

  $scope.maxDate = new Date('2014-06-22');
  $scope.toggleMinDate();

  $scope.dateOptions = {
    startingDay: 1,
    showWeeks: false
  };

  // Disable weekend selection
  // $scope.disabled = function(calendarDate, mode) {
  //   return mode === 'day' && ( calendarDate.getDay() === 0 || calendarDate.getDay() === 6 );
  // };

  $scope.hourStep = 1;
  $scope.minuteStep = 5;

  $scope.timeOptions = {
    hourStep: [1, 2, 3],
    minuteStep: [1, 5, 10, 15, 25, 30]
  };

  $scope.showMeridian = true;
  $scope.timeToggleMode = function () {
    $scope.showMeridian = !$scope.showMeridian;
  };

  $scope.resetHours = function () {
    $scope.date.setHours(1);
  };

  /**
   * used to set campaign to active gets passed
   * is passed to save or update as param it is just init here
   *
   * @$scope.campaignActive   {Boolean}  true if activated
   */
  $scope.campaignActive = false;
  /**
   * save our campaign to API on error save to Dexie and Locker
   * if name not unique then update campaign instead
   *
   * @return {object} saved Campaign
   */
  $scope.saveCampaign = function (activate) {
    /**
     * offerName from $scope
     *
     * @type {string}
     */
    $scope.toggleWizardLoader.showLoader = true;
    var cName = $scope.campaignName;
    if (!cName) {
      $scope.toggleWizardLoader.showLoader = false;
      $mdToast.show($mdToast.simple().content("Please enter a Campaign name").position("top right").hideDelay(2700));
      return;
    }
    var cID = locker.driver("local").namespace("campaigns").count();
    var activateCampaign = activate ? true : false;
    var cStartDate = moment($scope.campaignDates.startDate).format("YYYY-MM-DD HH:mm");
    var cEndDate = moment($scope.campaignDates.endDate).format("YYYY-MM-DD HH:mm");
    var fID = $scope.fingerprint.selected.fingerprintId;
    var oID = $scope.offer.selected.offerId;
    var activateOrNot = 0;
    /**
     * this is what we send to the API on save from create screen.
     *
     * @campaign  {Object}
     */
    if (activateCampaign) {
      activateOrNot = 1;
    } else {
      activateOrNot = 0;
    }

    if (activateOrNot == 1) {
      $scope.toggleWizardLoader.showLoader = false;
      $mdToast.show($mdToast.simple().content("Campaign has been intialized").position("top right").hideDelay(2700));
    }
    var campaign = {
      CampaignName: cName,
      FingerprintId: fID,
      OfferId: oID,
      DateStart: cStartDate,
      DateEnd: cEndDate,
      MerchantToken: merchantToken,
      Activate: activateOrNot
    };
    Campaign.create(campaign).then(function (response) {
      var statusCode = response.FlikResponse.Status.StatusCode;
      var statusMessage = response.FlikResponse.Status.StatusMessage;
      if (statusCode == 0) {
        var timeNow = moment().format("YYYY-MM-DD hh:mm:ss");
        var _cID = response.FlikResponse.Data.MerchantCampaign.MerchantCampaignId;
        console.info(JSON.stringify(_cID, null, 4));

        var updateMessage = activateCampaign ? "Saved and Activated" : "Saved and Not Activated";
        $scope.toggleWizardLoader.showLoader = false;
        $mdToast.show($mdToast.simple().content("Campaign " + cName + " " + updateMessage).position("top right").hideDelay(2700));
        locker.driver("session").namespace("campaignCreate").put("activeCampaignId", _cID);
        $rootScope.allData.campaigns.list.push({
          campaignId: _cID,
          campaignName: cName,
          fingerprintId: fID,
          offerId: oID,
          dateStart: cStartDate,
          dateEnd: cEndDate,
          merchantToken: merchantToken,
          activate: activateOrNot
        });
        $rootScope.allData.campaigns.count = $rootScope.allData.campaigns.list.length;
      } else if (statusCode == 1 && statusMessage == "Campaign name already exists") {
        $scope.toggleWizardLoader.showLoader = false;
        $mdToast.show($mdToast.simple().content(statusMessage).position("top right").hideDelay(2700));
      } else if (statusCode == 3) {
        /**
         * if we reach here merchantToken is no longer valid
         * we boot user back to signin
         *
         * TODO: add modal to reauth without back to signin page
         */
        console.group("and the status is " + statusCode);
        console.warn(response + " token not valid - need to login again");
        console.groupEnd();
        $state.go("access.signin");
        console.info("bye -- see you soon");
      } else {
        $scope.toggleWizardLoader.showLoader = false;
        $mdToast.show($mdToast.simple().content(statusMessage).position("top right").hideDelay(2700));
        console.warn(statusMessage + " this is the status message");
      }
    }, function (error) {
      $scope.toggleWizardLoader.showLoader = false;
      $mdToast.show($mdToast.simple().content("there was an error saving Campaign " + cName + " please try again").position("top right").hideDelay(2700));
      console.warn(JSON.stringify(error, null, 4) + " this is the error from the API");
    });
  };

  /**
   * save or update campaign and activate if user answer yes activate
   * to dialog then go to dashboard route otherwise just save campaign
   *
   * @return {Object}  campaign  saved or updated campaign
   */
  $scope.saveCampaignNextStep = function (ev) {
    var cName = $scope.campaignName;
    if (ev === "True") {
      $scope.saveCampaign(true);
    } else {
      $scope.saveCampaign(false);
    }
  };

  $scope.socialPush = function (pv) {
    $scope.toggleWizardLoader.showLoader = true;
    var cName = $scope.campaignName;
    if (!cName) {
      $scope.toggleWizardLoader.showLoader = false;
      $mdToast.show($mdToast.simple().content("Please enter a Campaign name").position("top right").hideDelay(2700));
    }

    var cID = locker.driver("local").namespace("campaigns").count();
    var cStartDate = moment($scope.campaignDates.startDate).format("YYYY-MM-DD HH:mm:ss");
    var cEndDate = moment($scope.campaignDates.endDate).format("YYYY-MM-DD HH:mm:ss");
    var fID = $scope.fingerprint.selected.fingerprintId;
    var oID = $scope.offer.selected.offerId;

    //let cn = "test9";
    //let fi = "1";
    //let oi ="153";
    //let ds = "2015-01-11";
    //let de = "2015-01-11";

    var campaign = {
      FingerprintId: fID,
      OfferId: oID,
      CampaignName: cName,
      DateStart: cStartDate,
      DateEnd: cEndDate,
      MerchantToken: merchantToken
    };

    Campaign.socialPush(campaign).then(function (response) {
      $scope.toggleWizardLoader.showLoader = false;
      var statusCode = response.FlikResponse.Status.StatusCode;
      if (statusCode == 0) {
        $mdToast.show($mdToast.simple().content("Saved and pushed").position("top right").hideDelay(2700));
        $rootScope.allData.campaigns.socialCampaigns.list.push({
          fingerprintId: fID,
          offerId: oID,
          campaignName: cName,
          dateStart: cStartDate,
          dateEnd: cEndDate
        });
        $rootScope.allData.campaigns.socialCampaigns.count = $rootScope.allData.campaigns.socialCampaigns.list.length;
      } else if (statusCode == 3) {
        /**
         * if we reach here merchantToken is no longer valid
         * we boot user back to signin
         *
         * TODO: add modal to reauth without back to signin page
         */
        console.group("and the status is " + statusCode);
        console.warn(response + " token not valid - need to login again");
        console.groupEnd();
        $state.go("access.signin");
        console.info("bye -- see you soon");
      } else {
        $mdToast.show($mdToast.simple().content(response.FlikResponse.Status.StatusMessage).position("top right").hideDelay(2700));
      }
    }, function (error) {
      alert("error");
      $scope.toggleWizardLoader.showLoader = false;
    });
  };

  $scope.externalPush = function (ev) {
    $scope.toggleWizardLoader.showLoader = true;
    var cName = $scope.campaignName;
    if (!cName) {
      $scope.toggleWizardLoader.showLoader = false;
      $mdToast.show($mdToast.simple().content("Please enter a Campaign name").position("top right").hideDelay(2700));
    }

    var cID = locker.driver("local").namespace("campaigns").count();
    var cStartDate = moment($scope.campaignDates.startDate).format("YYYY-MM-DD HH:mm:ss");
    var cEndDate = moment($scope.campaignDates.endDate).format("YYYY-MM-DD HH:mm:ss");
    var fID = $scope.fingerprint.selected.fingerprintId;
    var oID = $scope.offer.selected.offerId;

    // Auth.socialSignIn(cred).then(function(response){});

    var campaign = {
      FingerprintId: fID,
      OfferId: oID,
      CampaignName: cName,
      DateStart: cStartDate,
      Activate: 0,
      DateEnd: cEndDate,
      MerchantToken: merchantToken
    };

    Campaign.externalPush(campaign).then(function (response) {
      $scope.toggleWizardLoader.showLoader = false;
      var statusCode = response.FlikResponse.Status.StatusCode;
      var statusMessage = response.FlikResponse.Status.StatusMessage;
      if (statusCode == 0) {
        $mdToast.show($mdToast.simple().content("Saved and pushed").position("top right").hideDelay(2700));
      } else {
        $mdToast.show($mdToast.simple().content(statusMessage).position("top right").hideDelay(2700));
      }
    }, function (error) {
      $mdToast.show($mdToast.simple().content("Something went wrong please contact support team.").position("top right").hideDelay(2700));
      $scope.toggleWizardLoader.showLoader = false;
    });
  };
  $scope.activateExternalPush = function (ev) {
    $scope.toggleWizardLoader.showLoader = true;
    var cName = $scope.campaignName;
    if (!cName) {
      $scope.toggleWizardLoader.showLoader = false;
      $mdToast.show($mdToast.simple().content("Please enter a Campaign name").position("top right").hideDelay(2700));
    }

    var cID = locker.driver("local").namespace("campaigns").count();
    var cStartDate = moment($scope.campaignDates.startDate).format("YYYY-MM-DD HH:mm:ss");
    var cEndDate = moment($scope.campaignDates.endDate).format("YYYY-MM-DD HH:mm:ss");
    var fID = $scope.fingerprint.selected.fingerprintId;
    var oID = $scope.offer.selected.offerId;

    // Auth.socialSignIn(cred).then(function(response){});

    var campaign = {
      FingerprintId: fID,
      OfferId: oID,
      CampaignName: cName,
      DateStart: cStartDate,
      DateEnd: cEndDate,
      Activate: 1,
      MerchantToken: merchantToken
    };

    Campaign.activateExternalPush(campaign).then(function (response) {
      $scope.toggleWizardLoader.showLoader = false;
      var statusCode = response.FlikResponse.Status.StatusCode;
      var statusMessage = response.FlikResponse.Status.StatusMessage;
      if (statusCode == 0) {
        $mdToast.show($mdToast.simple().content("Saved and pushed").position("top right").hideDelay(2700));
      } else {
        $mdToast.show($mdToast.simple().content(statusMessage).position("top right").hideDelay(2700));
      }
    }, function (error) {
      $mdToast.show($mdToast.simple().content("Something went wrong please contact support team.").position("top right").hideDelay(2700));
      $scope.toggleWizardLoader.showLoader = false;
    });
  };

  $scope.emailCampaign = function (ev) {
    $scope.toggleWizardLoader.showLoader = true;
    var cName = $scope.campaignName;
    if (!cName) {
      $scope.toggleWizardLoader.showLoader = false;
      $mdToast.show($mdToast.simple().content("Please enter a Campaign name").position("top right").hideDelay(2700));
    }

    var cID = locker.driver("local").namespace("campaigns").count();
    var cStartDate = moment($scope.campaignDates.startDate).format("YYYY-MM-DD HH:mm:ss");
    var cEndDate = moment($scope.campaignDates.endDate).format("YYYY-MM-DD HH:mm:ss");
    var fID = $scope.fingerprint.selected.fingerprintId;
    var oID = $scope.offer.selected.offerId;
    var activateCamp = 1;
    // Auth.socialSignIn(cred).then(function(response){});

    var campaign = {
      FingerprintId: fID,
      OfferId: oID,
      CampaignName: cName,
      DateStart: cStartDate,
      DateEnd: cEndDate,
      Activate: activateCamp,
      MerchantToken: merchantToken
    };

    Campaign.emailCampaign(campaign).then(function (response) {
      $scope.toggleWizardLoader.showLoader = false;
      var statusCode = response.FlikResponse.Status.StatusCode;
      var statusMessage = response.FlikResponse.Status.StatusMessage;
      if (statusCode == 0) {
        $mdToast.show($mdToast.simple().content("Saved and activated").position("top right").hideDelay(2700));
      } else {
        $mdToast.show($mdToast.simple().content(statusMessage).position("top right").hideDelay(2700));
      }
    }, function (error) {
      $mdToast.show($mdToast.simple().content("Something went wrong please contact support team.").position("top right").hideDelay(2700));
      $scope.toggleWizardLoader.showLoader = false;
    });
  };

  $scope.populateOtherDropDowns = function (ev) {
    $scope.isDisabled = true;
    $scope.offer.selected = '';
    $scope.fingerprint.selected = '';
    var product = {
      ProductId: $scope.productWithTransaction.selected.productId,
      MerchantToken: locker.driver("local").namespace("core").get("merchantToken")
    };

    Campaign.calculateOptimalCampaign(product).then(function (response) {
      var statusCode = response.FlikResponse.Status.StatusCode;
      var statusMessage = response.FlikResponse.Status.StatusMessage;
      if (statusCode == 0) {
        $scope.optimalCampaignRows = {
          allOptimalCampaign: response.FlikResponse.Data.MerchanOfferLoyalty.OfferLoyaltyGet

        };
        var fingerprint = {
          FingerprintId: $scope.optimalCampaignRows.allOptimalCampaign.fingerprintId,
          MerchantToken: locker.driver("local").namespace("core").get("merchantToken")
        };
        Fingerprint.getOne(fingerprint).then(function (response) {
          $scope.fingerprint.selected = response.FlikResponse.Data.MerchantFingerprintAll.FingerprintGet;
        });
        var offer = {
          OfferId: $scope.optimalCampaignRows.allOptimalCampaign.offerId,
          MerchantToken: locker.driver("local").namespace("core").get("merchantToken")
        };
        Offer.getOne(offer).then(function (response) {
          $scope.offer.selected = response.FlikResponse.Data.MerchantOfferGet.OfferGet;
        });
      }
    });
  };
  $scope.deleteProduct = function () {
    $scope.isDisabled = false;
    $scope.productWithTransaction.selected = {};
    $scope.fingerprint.selected = {};
    $scope.offer.selected = {};
  };
}]);
//# sourceMappingURL=core.campaign.create.js.map