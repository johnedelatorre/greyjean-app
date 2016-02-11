"use strict";

angular.module("app").factory("Cause", ["Restangular", "$q", function (Restangular, $q) {

  /**
   * Our Restangular urls for Cause factory
   */
  var rCauseGetAll = Restangular.all("merchant/cause/all");
  var rCauseAdd = Restangular.all("merchant/cause/new");
  var rCauseDelete = Restangular.all("merchant/cause/delete");
  var rCauseUpdate = Restangular.all("merchant/cause/update");
  var causeAllData = {};
  Restangular.setBaseUrl('http://66.228.114.178/genie/api/');
  return {
    /**
     * Rest API call for getting all causes
     *
     */
    causeGetAll: function causeGetAll(merchantToken) {
      return rCauseGetAll.post(merchantToken);
    },
    /**
     * API for adding new cause
     *
     */
    causeAdd: function causeAdd(causeInfo) {
      return rCauseAdd.post(causeInfo);
    },

    /**
     * API for deletion of cause
     *
     */
    causeDelete: function causeDelete(causeInfo) {
      return rCauseDelete.post(causeInfo);
    },

    /**
     *  API for updating cause
     *
     */

    causeUpdate: function causeUpdate(causeInfo) {
      return rCauseUpdate.post(causeInfo);
    },
    CauseAllData: function CauseAllData(merchantToken) {
      console.log("in offer start");
      var mPass = {
        MerchantToken: merchantToken
      };
      return $q(function (resolve, reject) {
        console.log("before api call");
        rCauseGetAll.post(mPass).then(function (response) {
          console.log("response is");
          causeAllData = response.FlikResponse.Data.MerchantCauseAllAll.CauseAllList;
          console.log("in cause");
          //$rootScope.allData.campaigns.list = campaignList;
          //$rootScope.allData.campaigns.count = campaignList.length;

          resolve(causeAllData);
        }, function (err) {
          console.log(err);
          error = err;
          reject(error);
        });
      });
      //return fingerprintAllData;
    },
    getCauseAllData: function getCauseAllData() {
      return causeAllData;
    }
  };
}]);
//# sourceMappingURL=cause.js.map