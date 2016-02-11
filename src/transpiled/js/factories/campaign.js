'use strict';

angular.module('app').factory('Campaign', ["Restangular", "$q", function (Restangular, $q) {

  /**
   * Our Restangular urls for Campaign factory
   */
  var rCampaignCreate = Restangular.all('merchant/campaign/new');
  var rCampaignUpdate = Restangular.all('merchant/campaign/update');
  var rCampaignTrash = Restangular.all('merchant/campaign/delete');
  var rCampaignGetOne = Restangular.all('merchant/campaign/get');
  var rCampaignGetAll = Restangular.all('merchant/campaign/all');
  var rCampaignEmail = Restangular.all('merchant/campaign/email/new');
  var rCampaignSocialPush = Restangular.all('merchant/campaign/social_twitter/new');
  var rCampaignExternalPush = Restangular.all('merchant/campaign/social_twitter_external/new');
  var rCampaignActivate = Restangular.all('merchant/campaign/activate');
  var rCampaignCalculateOptimal = Restangular.all('merchant/calculate/optimal/campaign');
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
    create: function create(campaignInfo) {
      return rCampaignCreate.post(campaignInfo);
    },
    /**
     * Updates a campaign
     *
     * @campaignInfo  {object}   info from $scope to update campaign
     *
     * @return {object}   Restangularized response from API
     */
    update: function update(campaignInfo) {
      return rCampaignUpdate.post(campaignInfo);
    },
    /**
     * Deletes a campaign
     *
     * @campaignToDelete  {object}    campaignId from $scope to delete campaign
     *
     * @return {object}   Restangularized response from API
     */
    trash: function trash(campaignToTrash) {
      return rCampaignTrash.post(campaignToTrash);
    },
    /**
     * Fetches one campaign for op merchant
     *
     * @campaignToGet  {object}    campaignId from $scope to retrieve campaign from API
     *
     * @return {object}   Restangularized response from API
     */
    getOne: function getOne(campaignToGet) {
      return rCampaignGetOne.post(campaignToGet);
    },
    /**
     * Fetches all campaigns for op merchant
     *
     * @merchantToken     {object}    merchantToken from which to fetch all campaigns
     *
     * @return {object}   Restangularized response from APId
     */
    getAll: function getAll(merchantToken) {
      return rCampaignGetAll.post(merchantToken);
    },

    socialPush: function socialPush(campaign) {
      return rCampaignSocialPush.post(campaign);
    },

    externalPush: function externalPush(campaignInfo) {
      return rCampaignExternalPush.post(campaignInfo);
    },

    activateExternalPush: function activateExternalPush(campaignInfo) {
      return rCampaignExternalPush.post(campaignInfo);
    },

    activateDeactivate: function activateDeactivate(campaignActivate) {
      return rCampaignActivate.post(campaignActivate);
    },

    emailCampaign: function emailCampaign(campaignInfo) {
      return rCampaignEmail.post(campaignInfo);
    },

    calculateOptimalCampaign: function calculateOptimalCampaign(productData) {
      return rCampaignCalculateOptimal.post(productData);
    },
    CampaignAllData: function CampaignAllData(merchantToken) {
      var mPass = {
        MerchantToken: merchantToken
      };
      return $q(function (resolve, reject) {
        rCampaignGetAll.post(mPass).then(function (response) {
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
    getCampaignAllData: function getCampaignAllData() {
      return campaignAllData;
    }
  };
}]);
//# sourceMappingURL=campaign.js.map