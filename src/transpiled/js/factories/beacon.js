"use strict";

angular.module("app").factory("Beacon", ["Restangular", "$q", function (Restangular, $q) {

  /**
   * Our Restangular urls for Cause factory
   */
  var rBeaconGetAll = Restangular.all("merchant/beacons/getAll");
  var rBeaconDelete = Restangular.all("merchant/beacons/delete");
  var rBeaconAdd = Restangular.all("merchant/beacons/new");
  var rBeaconUpdate = Restangular.all("merchant/beacons/update");

  var beaconAllData = {};
  Restangular.setBaseUrl('http://66.228.114.178/genie/api/');

  return {
    beaconGetAll: function beaconGetAll(merchantToken) {
      return rBeaconGetAll.post(merchantToken);
    },

    beaconDelete: function beaconDelete(beaconInfo) {
      return rBeaconDelete.post(beaconInfo);
    },

    beaconAdd: function beaconAdd(beaconInfo) {
      return rBeaconAdd.post(beaconInfo);
    },

    beaconUpdate: function beaconUpdate(beaconInfo) {
      return rBeaconUpdate.post(beaconInfo);
    },
    BeaconAllData: function BeaconAllData(merchantToken) {
      var mPass = {
        MerchantToken: merchantToken
      };
      return $q(function (resolve, reject) {
        rBeaconGetAll.post(mPass).then(function (response) {
          console.log("after api call");
          beaconAllData = response.FlikResponse.Data.MerchantBeacons.GetAll;
          console.log(beaconAllData);
          resolve(beaconAllData);
        }, function (err) {
          error = err;
          reject(error);
        });
      });
    },
    getBeaconAllData: function getBeaconAllData() {
      return beaconAllData;
    }

  };
}]);
//# sourceMappingURL=beacon.js.map