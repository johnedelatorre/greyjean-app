"use strict";

angular.module("app").factory("Store", ["Restangular", "$q", function (Restangular, $q) {

    /**
     * Our Restangular urls for Store factory
     */
    var rStoreGetAll = Restangular.all("merchant/store/getAll");
    var rStoreAdd = Restangular.all("merchant/store/new");
    var rStoreUpdate = Restangular.all("merchant/store/update");
    var rStoreDelete = Restangular.all("merchant/store/delete");
    var storeAllData = {};
    Restangular.setBaseUrl('http://66.228.114.178/genie/api/');
    return {
        storeGetAll: function storeGetAll(merchantToken) {
            return rStoreGetAll.post(merchantToken);
        },

        storeAdd: function storeAdd(storeInfo) {
            return rStoreAdd.post(storeInfo);
        },

        storeUpdate: function storeUpdate(storeInfo) {
            return rStoreUpdate.post(storeInfo);
        },

        storeDelete: function storeDelete(storeInfo) {
            return rStoreDelete.post(storeInfo);
        },
        StoreAllData: function StoreAllData(merchantToken) {
            console.log("in store start");
            var mPass = {
                MerchantToken: merchantToken
            };
            return $q(function (resolve, reject) {
                console.log("before api call");
                rStoreGetAll.post(mPass).then(function (response) {
                    console.log("response is");
                    storeAllData = response.FlikResponse.Data.MerchantStoreAll.StoreList;

                    resolve(storeAllData);
                }, function (err) {
                    console.log(err);
                    error = err;
                    reject(error);
                });
            });
            //return fingerprintAllData;
        },
        getStoreAllData: function getStoreAllData() {
            return storeAllData;
        }

    };
}]);
//# sourceMappingURL=store.js.map