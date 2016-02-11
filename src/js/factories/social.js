"use strict";

angular.module("app")
    .factory("Social", ["Restangular",
        function(           Restangular){

            /**
             * Our Restangular urls for Cause factory
             */
            let rAnalyticsGetSocialProductFilter   = Restangular.all('spark/social/filter');
            let rAnalyticsSocialLocationTargeting  = Restangular.all('social/filter/state');

            return {
                /**
                 * bubble graph product filter
                 *
                 */
                socialproductGet: productData =>{
                return rAnalyticsGetSocialProductFilter.post(productData);
        },

        productSocialLocationGet: locationData =>{
    return rAnalyticsSocialLocationTargeting.post(locationData);
}

};
}]);
