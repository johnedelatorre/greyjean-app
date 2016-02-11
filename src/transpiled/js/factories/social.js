"use strict";

angular.module("app").factory("Social", ["Restangular", function (Restangular) {

    /**
     * Our Restangular urls for Cause factory
     */
    var rAnalyticsGetSocialProductFilter = Restangular.all('spark/social/filter');
    var rAnalyticsSocialLocationTargeting = Restangular.all('social/filter/state');

    return {
        /**
         * bubble graph product filter
         *
         */
        socialproductGet: function socialproductGet(productData) {
            return rAnalyticsGetSocialProductFilter.post(productData);
        },

        productSocialLocationGet: function productSocialLocationGet(locationData) {
            return rAnalyticsSocialLocationTargeting.post(locationData);
        }

    };
}]);
//# sourceMappingURL=social.js.map