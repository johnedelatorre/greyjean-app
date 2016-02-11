"use strict";

angular.module("app").factory("Spark", ["Restangular", function (Restangular) {

  /**
   * Our Restangular urls for Cause factory
   */
  var rAnalyticsGetSparkProductFilter = Restangular.all("spark/filter");
  var rAnalyticsSparkLocationTargeting = Restangular.all("state/filter");

  return {
    /**
     * bubble graph product filter
     *
     */
    productGet: function productGet(productData) {
      return rAnalyticsGetSparkProductFilter.post(productData);
    },

    productLocationGet: function productLocationGet(locationData) {
      return rAnalyticsSparkLocationTargeting.post(locationData);
    }

  };
}]);
//# sourceMappingURL=spark.js.map