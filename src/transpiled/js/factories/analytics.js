'use strict';

angular.module('app').factory('Analytics', ["$rootScope", "Restangular", function ($rootScope, Restangular) {
  /**
   * Our Restangular urls for Analytics factory
   */

  var rAnalyticsGetFilter = Restangular.all('merchant/analytics/filter/get');
  var rAnalyticsGetSocialFilter = Restangular.all('social/filter/get');
  var rAnalyticsCampaignAll = Restangular.all('merchant/campaign/getAll');
  var rAnalyticsSocialCampaignAll = Restangular.all('social/campaign/getAll');
  var rAnalyticsConsumerAll = Restangular.all('merchant/consumer/get');
  var rAnalyticsRecommendationsAll = Restangular.all('merchant/consumer/products/recommendation');
  var rAnalyticsConsumerTransactionAll = Restangular.all('merchant/consumer/transactions/get');
  var rAnalyticsConsumerUpdate = Restangular.all('merchant/consumer/update');
  var rAnalyticsConsumerTrash = Restangular.all('merchant/consumer/delete');
  var rAnalyticsProductCorrelationAll = Restangular.all('merchant/product_correlation/get');
  var rAnalyticsItemSimilarityAll = Restangular.all('merchant/consumer/products/item_similarity/recommendation');
  var rAnalyticsProductWithTransactionAll = Restangular.all('merchant/campaign/product/get');
  return {
    /**
     * Fetches all analytics for op merchant
     *
     * @merchantToken     {object}    merchantToken from which to fetch all analytics
     *
     * @return {object}   Restangularized response from API
     */

    getFilterData: function getFilterData(merchantToken) {
      return rAnalyticsGetFilter.post(merchantToken);
    },

    getSocialFilterData: function getSocialFilterData(merchantToken) {
      return rAnalyticsGetSocialFilter.post(merchantToken);
    },

    /**
     *  get all campaign data for performance
      */
    getCampaignAll: function getCampaignAll(merchantToken) {
      return rAnalyticsCampaignAll.post(merchantToken);
    },

    getSocialCampaignAll: function getSocialCampaignAll(merchantToken) {
      return rAnalyticsSocialCampaignAll.post(merchantToken);
    },

    /**
     * Get all the consumer for consumer table below consumer uploader
     *
     */

    getConsumerAll: function getConsumerAll(consumerNo) {
      return rAnalyticsConsumerAll.post(consumerNo);
    },

    getConsumerrecommendationsAll: function getConsumerrecommendationsAll(consumerNo) {
      return rAnalyticsRecommendationsAll.post(consumerNo);
    },

    getItemSimilarityAll: function getItemSimilarityAll(itemNo) {
      return rAnalyticsItemSimilarityAll.post(itemNo);
    },
    getProductCorrelationsAll: function getProductCorrelationsAll(merchantToken) {
      return rAnalyticsProductCorrelationAll.post(merchantToken);
    },
    /**
     * Get all the consumer transaction for uploader
     *
     */
    getConsumerTransactionAll: function getConsumerTransactionAll(consumerInfo) {
      return rAnalyticsConsumerTransactionAll.post(consumerInfo);
    },

    /**
     * consumer update on click on save button from profile page
     *
     */

    consumerUpdate: function consumerUpdate(consumerInfo) {
      return rAnalyticsConsumerUpdate.post(consumerInfo);
    },

    getProductWithTransactionAll: function getProductWithTransactionAll(merchantToken) {
      return rAnalyticsProductWithTransactionAll.post(merchantToken);
    },

    /**
     * consumer delete
     *
     */

    consumerDelete: function consumerDelete(consumerInfo) {
      return rAnalyticsConsumerTrash.post(consumerInfo);
    }
  };
}]);
//# sourceMappingURL=analytics.js.map