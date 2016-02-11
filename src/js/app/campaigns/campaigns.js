"use strict";

app.controller("CampaignsCtrl", ["$scope", "$rootScope", "$http", "$mdToast",  "Campaign", "$filter",
  function(                       $scope,   $rootScope,   $http,   $mdToast,    Campaign,   $filter) {

    /**
     * get Dexie dbCore
     *
     */
    let dbCore = $rootScope.dbCore;

      $scope.toggleWizardLoader = {
          showLoader: false
      }
    /**
     * get merchantMe and merchantToken from Locker
     *
     */
    let merchantMe    = locker.driver("local").namespace("core").get("me");
    let merchantToken = locker.driver("local").namespace("core").get("merchantToken");

    let merchantCampaigns  = $rootScope.allData.campaigns;

      $scope.allCampaigns = {};
      $scope.toggleWizardLoader.showLoader = true;
      Campaign.CampaignAllData(merchantToken).then(function() {
          $scope.allCampaigns = Campaign.getCampaignAllData();
          //$scope.allCampaigns = $scope.allCampaigns;
          $scope.toggleWizardLoader.showLoader = false;
      });

    $scope.trashCampaign = (index, cId) => {

      let campaignId = {
        CampaignId: cId,
        MerchantToken: merchantToken
      }
          /*
           this api call is done to remove the need for fetching the data at the time of log in.
           */

      Campaign.trash(campaignId).then(response => {

        let statusCode = response.FlikResponse.Status.StatusCode;
        let statusMessage = response.FlikResponse.Status.StatusMessage;

        if (statusCode == 0) {

          //merchantCampaigns.list.splice(index, 1);
          //merchantCampaigns.count = merchantCampaigns.list.length;

            $scope.allCampaigns.splice(index, 1);
            //$scope.allCampaigns.count = $scope.allCampaigns.list.length;

          $mdToast.show(
            $mdToast.simple()
              .content("campaign deleted successfully")
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
            .content("there was an error deleting campaign please try again")
            .position("top right")
            .hideDelay(2700)
        );
        console.warn(error + " this is the error from campaign delete");

      });
    };

    $scope.campaignActivateDeactivate = (campaignId, isActivate, campaignIndex) => {

        let activateData = {
            CampaignId : campaignId,
            Activate   : isActivate,
            MerchantToken : merchantToken
        }
        Campaign.activateDeactivate(activateData).then(response => {
          let statusCode = response.FlikResponse.Status.StatusCode;
          let statusMessage = response.FlikResponse.Status.StatusMessage;
          let activateMessage = response.FlikResponse.Data.MerchantCampaign.ActiveStatus;

          if(statusCode == 0){
            $mdToast.show(
              $mdToast.simple()
                  .content(activateMessage)
                  .position("top right")
                  .hideDelay(2700)
            );

          //$rootScope.allData.campaigns.list[campaignIndex].activate = isActivate;
              $scope.allCampaigns[campaignIndex].activate = isActivate;

          }else if (statusCode == 3) {

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
          }else {

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
            .content("Error in Activating and Deactivating")
            .position("top right")
            .hideDelay(2700)
          );

        });
    };



}]);
