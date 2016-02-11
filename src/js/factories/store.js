"use strict";

angular.module("app")
  .factory("Store", ["Restangular","$q",
    function(           Restangular,$q){

      /**
       * Our Restangular urls for Store factory
       */
      let rStoreGetAll                          = Restangular.all("merchant/store/getAll");
      let rStoreAdd                             = Restangular.all("merchant/store/new");
      let rStoreUpdate                          = Restangular.all("merchant/store/update");
      let rStoreDelete                          = Restangular.all("merchant/store/delete");
        var storeAllData = {};
        Restangular.setBaseUrl('http://66.228.114.178/genie/api/');
      return {
        storeGetAll: merchantToken =>{
           return rStoreGetAll.post(merchantToken);
        },

        storeAdd: storeInfo =>{
          return rStoreAdd.post(storeInfo);
        },

        storeUpdate: storeInfo =>{
          return rStoreUpdate.post(storeInfo);
        },

        storeDelete: storeInfo =>{
          return rStoreDelete.post(storeInfo);
        },
StoreAllData: merchantToken =>{
    console.log("in store start");
    let mPass = {
        MerchantToken: merchantToken
    }
    return $q(function(resolve, reject) {
        console.log("before api call");
        rStoreGetAll.post(mPass).then(response =>{
            console.log("response is")
        storeAllData = response.FlikResponse.Data.MerchantStoreAll.StoreList;

        resolve(storeAllData);
    },function(err){
        console.log(err);
        error = err;
        reject(error);
    });
});
//return fingerprintAllData;
},
getStoreAllData: function() {
    return storeAllData;
}

      };
}]);
