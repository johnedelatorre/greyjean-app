"use strict";

app.filter("propsFilter", function() {
  return function(items, props) {
    let out = [];

    if (angular.isArray(items)) {
      items.forEach(function(item) {
        let itemMatches = false;

        let keys = Object.keys(props);
        for (let i = 0; i < keys.length; i++) {
          let prop = keys[i];
          let text = props[prop].toLowerCase();
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
})

app.controller("CoreCampaignCreateCtrl", ["$scope", "$rootScope", "locker",  "Campaign",  "$state", "$stateParams", "$filter", "$mdToast", "$mdDialog", "$animate", "Fingerprint", "Offer", "Auth","$cookies",
  function(                                $scope,   $rootScope,   locker,    Campaign,    $state,   $stateParams,   $filter,   $mdToast,   $mdDialog,   $animate, Fingerprint, Offer, Auth,$cookies){

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
    let merchantMe = locker.driver("local").namespace("core").get("me");
    let merchantToken = locker.driver("local").namespace("core").get("merchantToken");
   // let smerchantToken = locker.driver('local').namespace('core').get('smerchantToken');
     // alert(smerchantToken);
    let cred = locker.driver('local').namespace('core').get('merchantCreds');

    locker.namespace("campaignCreate")
      .bind($scope, "campaignName");
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
      Offer.OfferPaginateAllData(start,limit,merchantToken).then(function() {
          $scope.allOffers = Offer.getOfferPaginateAllData();

      });
      Fingerprint.FingerprintPaginateAllData(start,limit,merchantToken).then(function() {
          $scope.allFingerprints = Fingerprint.getFingerprintPaginateAllData();

      });

    /**
     * get active fingerprint and offer from Dexie dbCore
     *
     */
    let hasActiveFingerprintId = locker.driver("session").namespace("fingerprintCreate").has("activeFingerprintId");
    let activeFingerprintId    = (hasActiveFingerprintId) ? locker.driver("session").namespace("fingerprintCreate").get("activeFingerprintId") : {};
    let hasActiveOfferId       = locker.driver("session").namespace("offerCreate").has("activeOfferId");
    let activeOfferId          = (hasActiveOfferId) ? locker.driver("session").namespace("offerCreate").get("activeOfferId") : {};
      let hasActiveProductId       = locker.driver("session").namespace("productCreate").has("activeProductId");
      let activeProductId          = (hasActiveProductId) ? locker.driver("session").namespace("productCreate").get("activeProductId") : {};

    locker.namespace("campaignCreate")
      .bind($scope, "fingerprint.selected");
    //$scope.fingerprint.selected  = $filter('where')($rootScope.allData.fingerprints.list, {fingerprintId: activeFingerprintId})[0];
      $scope.fingerprint.selected  = $filter('where')($scope.allFingerprints, {fingerprintId: activeFingerprintId})[0];
    locker.namespace("campaignCreate")
      .bind($scope, "offer.selected");
    //$scope.offer.selected  = $filter('where')($rootScope.allData.offers.list, {offerId: activeOfferId})[0];
      $scope.offer.selected  = $filter('where')($scope.allOffers, {offerId: activeOfferId})[0];

      locker.namespace("campaignCreate")
          .bind($scope, "productWithTransaction.selected");
      $scope.productWithTransaction.selected  = $filter('where')($rootScope.allData.productsWithTransaction.list, {productId: activeProductId})[0];
    $scope.toggleWizardLoader = {
      showLoader: false
    }

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
    $scope.triggers = [
      { name: "Home"},
      { name: "Store"},
      { name: "Work"}
    ];

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
    }

      $scope.addMoreOfferItems = function () {

          var limit = 30;
          var start = limit*paginateOffersVariable;

          Offer.OfferPaginateAllData(start,limit,merchantToken).then(function() {
              $scope.allOffers = $scope.allOffers.concat(Offer.getOfferPaginateAllData());


          });
          paginateOffersVariable=paginateOffersVariable+1;
      };

      $scope.addMoreFingerprintItems = function () {

          var limit = 30;
          var start = limit*paginateFingerprintsVariable;

          Fingerprint.FingerprintPaginateAllData(start,limit,merchantToken).then(function() {
              $scope.allFingerprints = $scope.allFingerprints.concat(Fingerprint.getFingerprintPaginateAllData());


          });
          paginateFingerprintsVariable=paginateFingerprintsVariable+1;
      };

      $scope.refreshList = function() {
          queryString = query;
      };
    //console.log(`this is allData ${JSON.stringify($rootScope.allData, null, 4)}`);

    $scope.dateTimeNow = function() {
        $scope.campaignDates.startDate = new Date();
        $scope.campaignDates.endDate = new Date();
      };
    $scope.dateTimeNow();

    $scope.toggleMinDate = function() {
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
    $scope.timeToggleMode = function() {
      $scope.showMeridian = !$scope.showMeridian;
    };

    $scope.resetHours = function() {
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
    $scope.saveCampaign = activate => {
      /**
       * offerName from $scope
       *
       * @type {string}
       */
      $scope.toggleWizardLoader.showLoader = true;
      let cName  = $scope.campaignName;
      if (!cName) {
        $scope.toggleWizardLoader.showLoader = false;
        $mdToast.show(
          $mdToast.simple()
            .content("Please enter a Campaign name")
            .position("top right")
            .hideDelay(2700)
        );
        return;
      }
      let cID              = locker.driver("local").namespace("campaigns").count();
      let activateCampaign = (activate) ? true : false;
      let cStartDate       = moment($scope.campaignDates.startDate).format("YYYY-MM-DD HH:mm");
      let cEndDate         = moment($scope.campaignDates.endDate).format("YYYY-MM-DD HH:mm");
      let fID              = $scope.fingerprint.selected.fingerprintId;
      let oID              = $scope.offer.selected.offerId;
      let activateOrNot = 0;
      /**
       * this is what we send to the API on save from create screen.
       *
       * @campaign  {Object}
       */
      if(activateCampaign){
          activateOrNot = 1;
      }else{
          activateOrNot = 0;
      }

      if(activateOrNot == 1){
        $scope.toggleWizardLoader.showLoader = false;
        $mdToast.show(
          $mdToast.simple()
            .content("Campaign has been intialized")
            .position("top right")
            .hideDelay(2700)
        );
      }
      let campaign = {
            CampaignName  : cName,
            FingerprintId : fID,
            OfferId       : oID,
            DateStart     : cStartDate,
            DateEnd       : cEndDate,
            MerchantToken : merchantToken,
            Activate      : activateOrNot
          };
      Campaign.create(campaign).then(response => {
        let statusCode    = response.FlikResponse.Status.StatusCode;
        let statusMessage = response.FlikResponse.Status.StatusMessage;
        if (statusCode == 0) {
          let timeNow = moment().format("YYYY-MM-DD hh:mm:ss");
          let cID     = response.FlikResponse.Data.MerchantCampaign.MerchantCampaignId;
          console.info( JSON.stringify(cID, null, 4));

          let updateMessage = (activateCampaign) ? "Saved and Activated" : "Saved and Not Activated";
          $scope.toggleWizardLoader.showLoader = false;
          $mdToast.show(
            $mdToast.simple()
              .content("Campaign " + cName + " " + updateMessage)
              .position("top right")
              .hideDelay(2700)
          );
          locker.driver("session")
            .namespace("campaignCreate")
            .put("activeCampaignId", cID);
          $rootScope.allData.campaigns.list.push({
            campaignId         : cID,
            campaignName       : cName,
            fingerprintId      : fID,
            offerId            : oID,
            dateStart          : cStartDate,
            dateEnd            : cEndDate,
            merchantToken      : merchantToken,
            activate           : activateOrNot
          });
          $rootScope.allData.campaigns.count = $rootScope.allData.campaigns.list.length;
        } else if (statusCode == 1 && statusMessage == "Campaign name already exists") {
            $scope.toggleWizardLoader.showLoader = false;
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
          console.group("and the status is " + statusCode);
          console.warn( response + " token not valid - need to login again" );
          console.groupEnd();
          $state.go("access.signin");
          console.info("bye -- see you soon");
        } else {
          $scope.toggleWizardLoader.showLoader = false;
          $mdToast.show(
            $mdToast.simple()
              .content(statusMessage)
              .position("top right")
              .hideDelay(2700)
          );
          console.warn(statusMessage + " this is the status message");
        }
      }, error => {
        $scope.toggleWizardLoader.showLoader = false;
        $mdToast.show(
          $mdToast.simple()
            .content("there was an error saving Campaign " + cName + " please try again")
            .position("top right")
            .hideDelay(2700)
        );
        console.warn(JSON.stringify(error, null, 4) + " this is the error from the API");
      });
    }

    /**
     * save or update campaign and activate if user answer yes activate
     * to dialog then go to dashboard route otherwise just save campaign
     *
     * @return {Object}  campaign  saved or updated campaign
     */
    $scope.saveCampaignNextStep = ev => {
      let cName   = $scope.campaignName;
      if(ev === "True"){
          $scope.saveCampaign(true);
      }else{
          $scope.saveCampaign(false);
      }

    };

    $scope.socialPush = pv => {
      $scope.toggleWizardLoader.showLoader = true;
      let cName = $scope.campaignName;
      if(!cName){
        $scope.toggleWizardLoader.showLoader = false;
        $mdToast.show(
          $mdToast.simple()
            .content("Please enter a Campaign name")
            .position("top right")
            .hideDelay(2700)
        );
      }

      let cID              = locker.driver("local").namespace("campaigns").count();
      let cStartDate       = moment($scope.campaignDates.startDate).format("YYYY-MM-DD HH:mm:ss");
      let cEndDate         = moment($scope.campaignDates.endDate).format("YYYY-MM-DD HH:mm:ss");
      let fID              = $scope.fingerprint.selected.fingerprintId;
      let oID              = $scope.offer.selected.offerId;

      //let cn = "test9";
      //let fi = "1";
      //let oi ="153";
      //let ds = "2015-01-11";
      //let de = "2015-01-11";

      let campaign = {
        FingerprintId : fID,
        OfferId       : oID,
        CampaignName  : cName,
        DateStart     : cStartDate,
        DateEnd       : cEndDate,
        MerchantToken : merchantToken
      }

      Campaign.socialPush(campaign).then(response =>{
       $scope.toggleWizardLoader.showLoader = false;
       let statusCode = response.FlikResponse.Status.StatusCode;
       if (statusCode == 0){
          $mdToast.show(
            $mdToast.simple()
              .content("Saved and pushed")
              .position("top right")
              .hideDelay(2700)
          );
          $rootScope.allData.campaigns.socialCampaigns.list.push({
            fingerprintId : fID,
            offerId       : oID,
            campaignName  : cName,
            dateStart     : cStartDate,
            dateEnd       : cEndDate
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
          console.warn( response + " token not valid - need to login again" );
          console.groupEnd();
          $state.go("access.signin");
          console.info("bye -- see you soon");
        } else {
         $mdToast.show(
           $mdToast.simple()
             .content(response.FlikResponse.Status.StatusMessage)
             .position("top right")
             .hideDelay(2700)
         );
       }
      },error =>{
        alert("error");
        $scope.toggleWizardLoader.showLoader = false;
      });
    };

    $scope.externalPush = ev => {
      $scope.toggleWizardLoader.showLoader = true;
      let cName = $scope.campaignName;
      if(!cName){
        $scope.toggleWizardLoader.showLoader = false;
        $mdToast.show(
          $mdToast.simple()
            .content("Please enter a Campaign name")
            .position("top right")
            .hideDelay(2700)
        );
      }

      let cID              = locker.driver("local").namespace("campaigns").count();
      let cStartDate       = moment($scope.campaignDates.startDate).format("YYYY-MM-DD HH:mm:ss");
      let cEndDate         = moment($scope.campaignDates.endDate).format("YYYY-MM-DD HH:mm:ss");
      let fID              = $scope.fingerprint.selected.fingerprintId;
      let oID              = $scope.offer.selected.offerId;

      // Auth.socialSignIn(cred).then(function(response){});

      let campaign = {
        FingerprintId : fID,
        OfferId       : oID,
        CampaignName  : cName,
        DateStart     : cStartDate,
        Activate      : 0,
        DateEnd       : cEndDate,
        MerchantToken : merchantToken
      }

      Campaign.externalPush(campaign).then(response => {
        $scope.toggleWizardLoader.showLoader = false;
        let statusCode = response.FlikResponse.Status.StatusCode;
        let statusMessage = response.FlikResponse.Status.StatusMessage;
        if (statusCode == 0){
          $mdToast.show(
            $mdToast.simple()
              .content("Saved and pushed")
              .position("top right")
              .hideDelay(2700)
          );
        } else {
          $mdToast.show(
            $mdToast.simple()
              .content(statusMessage)
              .position("top right")
              .hideDelay(2700)
          );
        }
      }, error => {
          $mdToast.show(
            $mdToast.simple()
              .content("Something went wrong please contact support team.")
              .position("top right")
              .hideDelay(2700)
          );
          $scope.toggleWizardLoader.showLoader = false;
      });
    };
$scope.activateExternalPush = ev => {
    $scope.toggleWizardLoader.showLoader = true;
    let cName = $scope.campaignName;
    if(!cName){
        $scope.toggleWizardLoader.showLoader = false;
        $mdToast.show(
            $mdToast.simple()
                .content("Please enter a Campaign name")
                .position("top right")
                .hideDelay(2700)
        );
    }

    let cID              = locker.driver("local").namespace("campaigns").count();
    let cStartDate       = moment($scope.campaignDates.startDate).format("YYYY-MM-DD HH:mm:ss");
    let cEndDate         = moment($scope.campaignDates.endDate).format("YYYY-MM-DD HH:mm:ss");
    let fID              = $scope.fingerprint.selected.fingerprintId;
    let oID              = $scope.offer.selected.offerId;

    // Auth.socialSignIn(cred).then(function(response){});

    let campaign = {
        FingerprintId : fID,
        OfferId       : oID,
        CampaignName  : cName,
        DateStart     : cStartDate,
        DateEnd       : cEndDate,
        Activate      : 1,
        MerchantToken : merchantToken
    }

    Campaign.activateExternalPush(campaign).then(response => {
        $scope.toggleWizardLoader.showLoader = false;
    let statusCode = response.FlikResponse.Status.StatusCode;
    let statusMessage = response.FlikResponse.Status.StatusMessage;
    if (statusCode == 0){
        $mdToast.show(
            $mdToast.simple()
                .content("Saved and pushed")
                .position("top right")
                .hideDelay(2700)
        );
    } else {
        $mdToast.show(
            $mdToast.simple()
                .content(statusMessage)
                .position("top right")
                .hideDelay(2700)
        );
    }
}, error => {
    $mdToast.show(
        $mdToast.simple()
            .content("Something went wrong please contact support team.")
            .position("top right")
            .hideDelay(2700)
    );
    $scope.toggleWizardLoader.showLoader = false;
});
};

$scope.emailCampaign = ev => {
    $scope.toggleWizardLoader.showLoader = true;
    let cName = $scope.campaignName;
    if(!cName){
        $scope.toggleWizardLoader.showLoader = false;
        $mdToast.show(
            $mdToast.simple()
                .content("Please enter a Campaign name")
                .position("top right")
                .hideDelay(2700)
        );
    }

    let cID              = locker.driver("local").namespace("campaigns").count();
    let cStartDate       = moment($scope.campaignDates.startDate).format("YYYY-MM-DD HH:mm:ss");
    let cEndDate         = moment($scope.campaignDates.endDate).format("YYYY-MM-DD HH:mm:ss");
    let fID              = $scope.fingerprint.selected.fingerprintId;
    let oID              = $scope.offer.selected.offerId;
    let activateCamp         = 1
    // Auth.socialSignIn(cred).then(function(response){});

    let campaign = {
        FingerprintId : fID,
        OfferId       : oID,
        CampaignName  : cName,
        DateStart     : cStartDate,
        DateEnd       : cEndDate,
        Activate      : activateCamp,
        MerchantToken : merchantToken
    }

    Campaign.emailCampaign(campaign).then(response => {
        $scope.toggleWizardLoader.showLoader = false;
    let statusCode = response.FlikResponse.Status.StatusCode;
    let statusMessage = response.FlikResponse.Status.StatusMessage;
    if (statusCode == 0){
        $mdToast.show(
            $mdToast.simple()
                .content("Saved and activated")
                .position("top right")
                .hideDelay(2700)
        );
    } else {
        $mdToast.show(
            $mdToast.simple()
                .content(statusMessage)
                .position("top right")
                .hideDelay(2700)
        );
    }
}, error => {
    $mdToast.show(
        $mdToast.simple()
            .content("Something went wrong please contact support team.")
            .position("top right")
            .hideDelay(2700)
    );
    $scope.toggleWizardLoader.showLoader = false;
});
};

$scope.populateOtherDropDowns = ev => {
    $scope.isDisabled = true;
    $scope.offer.selected='';
    $scope.fingerprint.selected='';
    let product = {
        ProductId : $scope.productWithTransaction.selected.productId,
        MerchantToken    : locker.driver("local").namespace("core").get("merchantToken")
    };

    Campaign.calculateOptimalCampaign(product).then(response =>{
        let statusCode = response.FlikResponse.Status.StatusCode;
    let statusMessage = response.FlikResponse.Status.StatusMessage;
    if(statusCode == 0){
        $scope.optimalCampaignRows = {
            allOptimalCampaign:response.FlikResponse.Data.MerchanOfferLoyalty.OfferLoyaltyGet

        }
        let fingerprint = {
            FingerprintId : $scope.optimalCampaignRows.allOptimalCampaign.fingerprintId,
            MerchantToken    : locker.driver("local").namespace("core").get("merchantToken")
        };
        Fingerprint.getOne(fingerprint).then(response => {
        $scope.fingerprint.selected = response.FlikResponse.Data.MerchantFingerprintAll.FingerprintGet;
    });
    let offer = {
        OfferId : $scope.optimalCampaignRows.allOptimalCampaign.offerId,
        MerchantToken    : locker.driver("local").namespace("core").get("merchantToken")
    };
    Offer.getOne(offer).then(response => {
    $scope.offer.selected = response.FlikResponse.Data.MerchantOfferGet.OfferGet;

});

    }
});

}
$scope.deleteProduct = function() {
    $scope.isDisabled = false;
    $scope.productWithTransaction.selected = {};
    $scope.fingerprint.selected = {};
    $scope.offer.selected = {};

};
  }]);
