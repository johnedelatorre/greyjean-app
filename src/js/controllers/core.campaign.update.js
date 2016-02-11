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

app.controller("CoreCampaignUpdateCtrl", ["$scope", "$rootScope", "locker",  "Campaign",  "$state", "$stateParams", "$filter", "$mdToast", "$mdDialog", "$animate", "Fingerprint", "Offer", "Auth", "$location", "$rootElement", "$window",
  function(                                $scope,   $rootScope,   locker,    Campaign,    $state,   $stateParams,   $filter,   $mdToast,   $mdDialog,   $animate, Fingerprint, Offer, Auth, $location, $rootElement, $window){

    $scope.allData = $rootScope.allData;
      $scope.allFingerprints = {};
      $scope.allOffers = {};
      var i =1;
      var paginateOffersVariable = 1;
      var paginateFingerprintsVariable = 1;
    /**
     * get merchantMe and merchantToken from Locker
     *
     */
    let merchantMe = locker.driver("local").namespace("core").get("me");
    let merchantToken = locker.driver("local").namespace("core").get("merchantToken");
    $scope.toggleWizardLoader ={};

    /**
     * datetimepicker for campaign
     */

    $scope.campaignDates = {
      startDate: null,
      endDate: null
    }

      var start = 0;
      var limit = 30;
      var queryString = '';
      Offer.OfferPaginateAllData(start,limit,merchantToken).then(function() {
          $scope.allOffers = Offer.getOfferPaginateAllData();

      });
      Fingerprint.FingerprintPaginateAllData(start,limit,merchantToken).then(function() {
          $scope.allFingerprints = Fingerprint.getFingerprintPaginateAllData();

      });


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
    
    // setting the campaign URL for smart app banner using angular element and $rootElement service
    
    $scope.settingCamapignUrl =() =>{
      let iTuneUrl = "https://itunes.apple.com/us/app/genie-app/id965196098?mt=8";
      let campaignUrl = $location.absUrl();
      let contentInfo = "app-id=965196098, app-argument=" +campaignUrl;
      var metaDesc = angular.element($rootElement.find('meta[name=apple-itunes-app]')[0]);
      metaDesc.attr('content', contentInfo);
      $window.location.href = iTuneUrl;
      $location.replace();
    };

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
    /**
     * update our offer if offer already exists
     *
     * @return {object} updated offer
     */
    $scope.updateCampaign = activate => {
      $scope.toggleWizardLoader.showLoader = true;
      let cName              = $scope.campaignName;
      let timeNow            = moment().format("YYYY-MM-DD hh:mm:ss");
      let cStartDate         = moment($scope.campaignStartDate).format("YYYY-MM-DD");
      let cEndDate           = moment($scope.campaignEndDate).format("YYYY-MM-DD");
      let activateCampaign   = (activate) ? true : false;
      let merchantId         = merchantMe.merchantId;
      let currentCampaignId  = $scope.campaignId;
      let fID                = $scope.fingerprint.selected.fingerprintId;
      let oID                = $scope.offer.selected.offerId;
      /**
       * this is what we send to the API on update from create screen.
       *
       * @campaign  {Object}
       */
      let campaign = {
            CampaignId    : currentCampaignId,
            CampaignName  : cName,
            FingerprintId : fID,
            OfferId       : oID,
            DateStart     : cStartDate,
            DateEnd       : cEndDate,
            MerchantToken : merchantToken,
            MerchantId    : merchantId
          };
      console.info(merchantMe);
      Campaign.update(campaign).then(response => {
        let statusCode    = response.FlikResponse.Status.StatusCode;
        let statusMessage = response.FlikResponse.Status.StatusMessage;
        if (statusCode == 0) {
          let timeNow       = moment().format("YYYY-MM-DD hh:mm:ss");
          let cID           = response.FlikResponse.Data.MerchantCampaignUpdate.MerchantCampaignId;
          let updateMessage = (activateCampaign) ? "Updated and Activated" : "Updated";
          let campaignUpdateData ={
            campaignId         : currentCampaignId,
            campaignName       : cName,
            fingerprintId      : fID,
            offerId            : oID,
            dateStart          : cStartDate,
            dateEnd            : cEndDate,
            merchantToken      : merchantToken
          };
          let allCamapign = $rootScope.allData.campaigns.list;
          angular.forEach(allCamapign,function(camapign,index){

            if(camapign.campaignId == currentCampaignId){
              $rootScope.allData.campaigns.list[index]= campaignUpdateData;
            }

          });

          locker.driver("session")
            .namespace("campaignCreate")
            .put("activeCampaignId", cID);
          $scope.toggleWizardLoader.showLoader = false;
          $mdToast.show(
            $mdToast.simple()
              .content("campaign " + cName + " " + updateMessage)
              .position("top right")
              .hideDelay(2700)
          );
        } else if (statusCode == 1 && statusMessage == "Campaign name must be unique") {
          $scope.toggleWizardLoader.showLoader = false;
          $mdToast.show(
            $mdToast.simple()
              .content("Cannot Update Campaign from create screen "+cName+" Please try from the view/edit screen")
              .position("top right")
              .hideDelay(2700)
          );
        } else if (statusCode == 3) {
          /**
           * if we reach here merchantToken is no longer valid
           * if we reach here merchantToken is no longer valid
           * we boot user back to signin
           *
           * TODO:   =>   add modal to reauth without back to signin page
           */
          console.warn("and the status is "+statusCode);
          console.warn(JSON.stringify(response, null, 4)+" token not valid - need to login again");
          locker.driver("local")
            .namespace("core")
            .forget("merchantToken");
          $state.go("access.signin");
          console.info("bye -- see you soon");
        }
      }, error => {
        $scope.toggleWizardLoader.showLoader = false;
        $mdToast.show(
          $mdToast.simple()
            .content("Error updating "+fName)
            .position("top right")
            .hideDelay(2700)
        );
      });
    }

  }]);
