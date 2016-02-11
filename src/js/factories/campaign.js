'use strict';

angular.module('app')
.factory('Campaign', ["Restangular","$q",
  function(            Restangular,$q){

    /**
     * Our Restangular urls for Campaign factory
     */
    let rCampaignCreate = Restangular.all('merchant/campaign/new');
    let rCampaignUpdate = Restangular.all('merchant/campaign/update');
    let rCampaignTrash  = Restangular.all('merchant/campaign/delete');
    let rCampaignGetOne = Restangular.all('merchant/campaign/get');
    let rCampaignGetAll = Restangular.all('merchant/campaign/all');
    let rCampaignEmail = Restangular.all('merchant/campaign/email/new');
    let rCampaignSocialPush = Restangular.all('merchant/campaign/social_twitter/new');
    let rCampaignExternalPush = Restangular.all('merchant/campaign/social_twitter_external/new');
    let rCampaignActivate = Restangular.all('merchant/campaign/activate');
    let rCampaignCalculateOptimal= Restangular.all('merchant/calculate/optimal/campaign');
      var campaignAllData = {};
      Restangular.setBaseUrl('http://66.228.114.178/genie/api/');

    return {
      /**
       * Creates a campaign
       *
       * @campaignInfo  {object}   info from $scope to create campaign
       *
       * @return {object}   Restangularized response from API
       */
      create: campaignInfo => {
        return rCampaignCreate.post(campaignInfo);
      },
      /**
       * Updates a campaign
       *
       * @campaignInfo  {object}   info from $scope to update campaign
       *
       * @return {object}   Restangularized response from API
       */
      update: campaignInfo => {
        return rCampaignUpdate.post(campaignInfo);
      },
      /**
       * Deletes a campaign
       *
       * @campaignToDelete  {object}    campaignId from $scope to delete campaign
       *
       * @return {object}   Restangularized response from API
       */
      trash: campaignToTrash => {
        return rCampaignTrash.post(campaignToTrash);
      },
      /**
       * Fetches one campaign for op merchant
       *
       * @campaignToGet  {object}    campaignId from $scope to retrieve campaign from API
       *
       * @return {object}   Restangularized response from API
       */
      getOne: campaignToGet => {
        return rCampaignGetOne.post(campaignToGet);
      },
      /**
       * Fetches all campaigns for op merchant
       *
       * @merchantToken     {object}    merchantToken from which to fetch all campaigns
       *
       * @return {object}   Restangularized response from APId
       */
      getAll: merchantToken => {
        return rCampaignGetAll.post(merchantToken);
      },

      socialPush: campaign => {
        return rCampaignSocialPush.post(campaign);
      },

      externalPush: campaignInfo =>{
        return rCampaignExternalPush.post(campaignInfo);
      },

      activateExternalPush: campaignInfo =>{
        return rCampaignExternalPush.post(campaignInfo);
      },

     activateDeactivate: campaignActivate =>{
       return rCampaignActivate.post(campaignActivate);
    },

     emailCampaign: campaignInfo =>{
       return rCampaignEmail.post(campaignInfo);
    },

    calculateOptimalCampaign: productData =>{
    return rCampaignCalculateOptimal.post(productData);
   },
CampaignAllData: merchantToken =>{
    let mPass = {
        MerchantToken: merchantToken
    }
    return $q(function(resolve, reject) {
        rCampaignGetAll.post(mPass).then(response => {
            console.log("after api call");
        campaignAllData = response.FlikResponse.Data.MerchantCampaign.CampaignList;
        //$rootScope.allData.campaigns.list = campaignList;
        //$rootScope.allData.campaigns.count = campaignList.length;

        resolve(campaignAllData);
    }, function (err) {
        error = err;
        reject(error);
    });
});

//return fingerprintAllData;
},
getCampaignAllData: function() {
    return campaignAllData;
},
    };
}]);
