"use strict";

angular.module("app")
  .factory("Beacon", ["Restangular","$q",
    function(           Restangular,$q){

      /**
       * Our Restangular urls for Cause factory
       */
      let rBeaconGetAll               = Restangular.all("merchant/beacons/getAll");
      let rBeaconDelete               = Restangular.all("merchant/beacons/delete");
      let rBeaconAdd                  = Restangular.all("merchant/beacons/new");
      let rBeaconUpdate               = Restangular.all("merchant/beacons/update");

        var beaconAllData = {};
        Restangular.setBaseUrl('http://66.228.114.178/genie/api/');

      return {
        beaconGetAll: merchantToken =>{
          return rBeaconGetAll.post(merchantToken);
        },

        beaconDelete: beaconInfo =>{
          return rBeaconDelete.post(beaconInfo);
        },

        beaconAdd: beaconInfo =>{
          return rBeaconAdd.post(beaconInfo);
        },

        beaconUpdate: beaconInfo =>{
          return rBeaconUpdate.post(beaconInfo);
        },
BeaconAllData: merchantToken =>{
    let mPass = {
        MerchantToken: merchantToken
    }
    return $q(function(resolve, reject) {
        rBeaconGetAll.post(mPass).then(response => {
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
getBeaconAllData: function() {
    return beaconAllData;
}

      };
}]);

