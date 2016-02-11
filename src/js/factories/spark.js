"use strict";

angular.module("app")
  .factory("Spark", ["Restangular",
    function(           Restangular){

      /**
       * Our Restangular urls for Cause factory
       */
      let rAnalyticsGetSparkProductFilter   = Restangular.all('spark/filter');
      let rAnalyticsSparkLocationTargeting  = Restangular.all('state/filter'); 

      return {
        /**
         * bubble graph product filter
         *
         */
        productGet: productData =>{
          return rAnalyticsGetSparkProductFilter.post(productData);
        },
        
        productLocationGet: locationData =>{
          return rAnalyticsSparkLocationTargeting .post(locationData);
        }

      };
}]);
