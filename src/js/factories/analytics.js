'use strict';

angular.module('app')
.factory('Analytics', ["$rootScope","Restangular",
  function(             $rootScope,Restangular){
    /**
     * Our Restangular urls for Analytics factory
     */

    let rAnalyticsGetFilter               = Restangular.all('merchant/analytics/filter/get');
    let rAnalyticsGetSocialFilter         = Restangular.all('social/filter/get');
    let rAnalyticsCampaignAll             = Restangular.all('merchant/campaign/getAll');
    let rAnalyticsSocialCampaignAll       = Restangular.all('social/campaign/getAll');
    let rAnalyticsConsumerAll             = Restangular.all('merchant/consumer/get');
    let rAnalyticsRecommendationsAll      = Restangular.all('merchant/consumer/products/recommendation');
    let rAnalyticsConsumerTransactionAll  = Restangular.all('merchant/consumer/transactions/get');
    let rAnalyticsConsumerUpdate          = Restangular.all('merchant/consumer/update');
    let rAnalyticsConsumerTrash           = Restangular.all('merchant/consumer/delete');
    let rAnalyticsProductCorrelationAll   = Restangular.all('merchant/product_correlation/get');
    let rAnalyticsItemSimilarityAll       = Restangular.all('merchant/consumer/products/item_similarity/recommendation');
    let rAnalyticsProductWithTransactionAll  = Restangular.all('merchant/campaign/product/get');
    return {
      /**
       * Fetches all analytics for op merchant
       *
       * @merchantToken     {object}    merchantToken from which to fetch all analytics
       *
       * @return {object}   Restangularized response from API
       */

     getFilterData: merchantToken => {
            return rAnalyticsGetFilter.post(merchantToken);
     },

     getSocialFilterData: merchantToken => {
        return rAnalyticsGetSocialFilter.post(merchantToken);
     },

    /**
     *  get all campaign data for performance
      */
     getCampaignAll: merchantToken => {
            return rAnalyticsCampaignAll.post(merchantToken);
     },

     getSocialCampaignAll: merchantToken => {
        return rAnalyticsSocialCampaignAll.post(merchantToken);
     },

    /**
     * Get all the consumer for consumer table below consumer uploader
     *
     */

      getConsumerAll: consumerNo =>{
        return rAnalyticsConsumerAll.post(consumerNo);
      },

      getConsumerrecommendationsAll: consumerNo =>{
        return rAnalyticsRecommendationsAll.post(consumerNo);
      },

      getItemSimilarityAll: itemNo =>{
        return rAnalyticsItemSimilarityAll.post(itemNo);
      },
      getProductCorrelationsAll: merchantToken => {
        return rAnalyticsProductCorrelationAll.post(merchantToken);
      },
      /**
       * Get all the consumer transaction for uploader
       *
       */
      getConsumerTransactionAll: consumerInfo =>{
        return rAnalyticsConsumerTransactionAll.post(consumerInfo);
      },

      /**
       * consumer update on click on save button from profile page
       *
       */

      consumerUpdate: consumerInfo =>{
        return rAnalyticsConsumerUpdate.post(consumerInfo);
      },

      getProductWithTransactionAll: merchantToken =>{
        return rAnalyticsProductWithTransactionAll.post(merchantToken);
      },

      /**
       * consumer delete
       *
       */

      consumerDelete: consumerInfo =>{
        return rAnalyticsConsumerTrash.post(consumerInfo);
      }
    };
}]);
