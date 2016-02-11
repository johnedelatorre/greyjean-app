"use strict";

angular.module("app")
  .factory("Cause", ["Restangular","$q",
    function(           Restangular,$q){

      /**
       * Our Restangular urls for Cause factory
       */
      let rCauseGetAll               = Restangular.all("merchant/cause/all");
      let rCauseAdd                  = Restangular.all("merchant/cause/new");
      let rCauseDelete               = Restangular.all("merchant/cause/delete");
      let rCauseUpdate               = Restangular.all("merchant/cause/update");
var causeAllData = {};
        Restangular.setBaseUrl('http://66.228.114.178/genie/api/');
      return {
        /**
         * Rest API call for getting all causes
         *
         */
        causeGetAll: merchantToken =>{
          return rCauseGetAll.post(merchantToken);
        },
        /**
         * API for adding new cause
         *
         */
        causeAdd: causeInfo =>{
          return rCauseAdd.post(causeInfo);
        },

        /**
         * API for deletion of cause
         *
         */
        causeDelete: causeInfo =>{
          return rCauseDelete.post(causeInfo);
        },

        /**
         *  API for updating cause
         *
         */

        causeUpdate : causeInfo =>{
          return rCauseUpdate.post(causeInfo);
        },
CauseAllData: merchantToken =>{
    console.log("in offer start");
    let mPass = {
        MerchantToken: merchantToken
    }
    return $q(function(resolve, reject) {
        console.log("before api call");
        rCauseGetAll.post(mPass).then(response =>{
            console.log("response is")
        causeAllData = response.FlikResponse.Data.MerchantCauseAllAll.CauseAllList;
        console.log("in cause");
        //$rootScope.allData.campaigns.list = campaignList;
        //$rootScope.allData.campaigns.count = campaignList.length;

        resolve(causeAllData);
    },function(err){
        console.log(err);
        error = err;
        reject(error);
    });
});
//return fingerprintAllData;
},
getCauseAllData: function() {
    return causeAllData;
}
      };
}]);
