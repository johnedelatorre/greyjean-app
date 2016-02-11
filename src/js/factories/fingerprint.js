"use strict";

angular.module("app")
.factory("Fingerprint", ["Restangular","$q",
  function(               Restangular,$q){

    /**
     * Our Restangular urls for Fingerprint factory
     */
    let rFingerprintCreate                    = Restangular.all("merchant/fingerprint/new");
    let rFingerprintUpdate                    = Restangular.all("merchant/fingerprint/update");
    let rFingerprintTrash                     = Restangular.all("merchant/fingerprint/delete");
    let rFingerprintGetOne                    = Restangular.all("merchant/fingerprint/get");
    let rFingerprintGetAll                    = Restangular.all("merchant/fingerprint/all");
    let rFingerprintLocationCreate            = Restangular.all("merchant/fingerprint/location/new");
    let rFingerprintLocationUpdate            = Restangular.all("merchant/fingerprint/location/update");
    let rFingerprintLocationTrash             = Restangular.all("merchant/fingerprint/location/delete");
    let rFingerprintLocationGetOne            = Restangular.all("merchant/fingerprint/location/get");
    let rFingerprintLocationGetAll            = Restangular.all("merchant/fingerprint/location/all");
    let rFingerprintTransactionCreate         = Restangular.all("merchant/fingerprint/transactions/new");
    let rFingerprintTransactionUpdate         = Restangular.all("merchant/fingerprint/transactions/update");
    let rFingerprintTransactionTrash          = Restangular.all("merchant/fingerprint/transactions/delete");
    let rFingerprintTransactionGetOne         = Restangular.all("merchant/fingerprint/transactions/get");
    let rFingerprintTransactionGetAll         = Restangular.all("merchant/fingerprint/transactions/all");
    let rFingerprintSocialSave                = Restangular.all("merchant/fingerprint/product/new ");
    let rFingerprintSocialUpdate              = Restangular.all("merchant/fingerprint/product/update");
    let rFingerprintProductDelete             = Restangular.all("merchant/fingerprint/product/delete");
    let rFingerprintSocialData                = Restangular.all("merchant/fingerprint/product/all");
    let rFingerprintGetAllData                = Restangular.all("merchant/fingerprint/alls");
    let rFingerprintDeleteAll                 = Restangular.all("merchant/fingerprint/product/deleteAll");
    let rFingerprintCauseSave                 = Restangular.all("merchant/fingerprint/cause/new");
    let rFingerprintUpdateCause               = Restangular.all("merchant/fingerprint/cause/update");
    let rFingerprintCauseGet                  = Restangular.all("merchant/fingerprint/cause/all");
    let rFingerprintDeleteCause               = Restangular.all("merchant/fingerprint/cause/deleteAll")
    let rFingerprintBeaconAll				  = Restangular.all("merchant/fingerprint/beacons/getAll");
    let rFingerprintBeaconSave                = Restangular.all("merchant/fingerprint/beacons/new");
    let rFingerprintBeaconUpdate              = Restangular.all("merchant/fingerprint/beacons/update");
    let rFingerprintStoreSave                 = Restangular.all("merchant/fingerprint/store/new");
    let rFingerprintStoreUpdate               = Restangular.all("merchant/fingerprint/store/update");
    let rFingerprintStoreGetAll               = Restangular.all("merchant/fingerprint/store/getAll");
      let rFingerprintPaginatedData = Restangular.all("merchant/fingerprint/all/number");

Restangular.setBaseUrl('http://66.228.114.178/genie/api/');

      var fingerprintAllData = {};
      var fingerprintBeaconsAllData = {};
      var fingerprintCausesAllData = {};
      var fingerprintLocationsAllData = {};
      var fingerprintPaginateAllData = {};
      var fingerprintTransactionsAllData = {};
      var fingerprintProductsAllData = {};

    return {
      /**
       * Creates a fingerprint
       *
       * @fingerprintInfo   {object}   info from $scope to create fingerprint
       *
       * @return {object}   Restangularized response from API
       */
      create: fingerprintInfo => {
        return rFingerprintCreate.post(fingerprintInfo);
      },
      /**
       * Updates a fingerprint
       *
       * @fingerprintInfo   {object}   info from $scope to update fingerprint
       *
       * @return {object}   Restangularized response from API
       */
      update: fingerprintInfo => {
        return rFingerprintUpdate.post(fingerprintInfo);
      },
      /**
       * Deletes a fingerprint
       *
       * @fingerprintToTrash    {object}    fingerprintId from $scope to delete fingerprint
       *
       * @return {object}   Restangularized response from API
       */
      trash: fingerprintToTrash => {
        return rFingerprintTrash.post(fingerprintToTrash);
      },
      /**
       * Fetches one fingerprint for op merchant
       *
       * @fingerprintToGet  {object}    fingerprintId from $scope to retrieve fingerprint from API
       *
       * @return {object}   Restangularized response from API
       */
      getOne: fingerprintToGet => {
        return rFingerprintGetOne.post(fingerprintToGet);
      },
      /**
       * Fetches all fingerprints for op merchant
       *
       * @merchantToken     {object}    merchantToken from which to fetch all fingerprints
       *
       * @return {object}   Restangularized response from APId
       */
      getAll: merchantToken => {
        return rFingerprintGetAll.post(merchantToken);
      },
      /**
       * Creates a fingerprint location
       *
       * @fingerprintLocationInfo   {object}    info from $scope to create fingerprint location
       *
       * @return {object}   Restangularized response from API
       */
      createLocation: fingerprintLocationInfo => {
        return rFingerprintLocationCreate.post(fingerprintLocationInfo);
      },
      /**
       * Updates a fingerprint location
       *
       * @fingerprintLocationInfo   {object}    info from $scope to update fingerprint location
       *
       * @return {object}   Restangularized response from API
       */
      updateLocation: fingerprintLocationInfo => {
        return rFingerprintLocationUpdate.post(fingerprintLocationInfo);
      },
      /**
       * Deletes a fingerprint location
       *
       * @fingerprintLocationToTrash    {object}    fingerprintLocationId from $scope to delete fingerprint location
       *
       * @return {object}   Restangularized response from API
       */
      trashLocation: fingerprintLocationToTrash => {
        return rFingerprintLocationTrash.post(fingerprintLocationToTrash);
      },
      /**
       * Fetches one fingerprint location for op merchant
       *
       * @fingerprintLocationToGet    {object}    fingerprintLocationId from $scope to retrieve fingerprint location from API
       *
       * @return {object}   Restangularized response from API
       */
      getOneLocation: fingerprintLocationToGet => {
        return rFingerprintLocationGetOne.post(fingerprintLocationToGet);
      },
      /**
       * Fetches all fingerprint locations for op merchant
       *
       * @merchantToken     {object}    merchantToken from which to fetch all fingerprints
       *
       * @return {object}   Restangularized response from APId
       */
      getAllLocation: merchantToken => {
        return rFingerprintLocationGetAll.post(merchantToken);
      },
      /**
       * Creates a fingerprint transaction
       *
       * @fingerprintTransactionInfo   {object}    info from $scope to create fingerprint transaction
       *
       * @return {object}   Restangularized response from API
       */
      createTransaction: fingerprintTransactionInfo => {
        return rFingerprintTransactionCreate.post(fingerprintTransactionInfo);
      },
      /**
       * Updates a fingerprint transaction
       *
       * @fingerprintTransactionInfo   {object}    info from $scope to update fingerprint transaction
       *
       * @return {object}   Restangularized response from API
       */
      updateTransaction: fingerprintTransactionInfo => {
        return rFingerprintTransactionUpdate.post(fingerprintTransactionInfo);
      },
      /**
       * Deletes a fingerprint transaction
       *
       * @fingerprintTransactionToTrash    {object}    fingerprintTransactionId from $scope to delete fingerprint transaction
       *
       * @return {object}   Restangularized response from API
       */
      trashTransaction: fingerprintTransactionToTrash => {
        return rFingerprintTransactionTrash.post(fingerprintTransactionToTrash);
      },
      /**
       * Fetches one fingerprint transaction for op merchant
       *
       * @fingerprintTransactionToGet    {object}    fingerprintTransactionId from $scope to retrieve fingerprint transaction from API
       *
       * @return {object}   Restangularized response from API
       */
      getOneTransaction: fingerprintTransactionToGet => {
        return rFingerprintTransactionGetOne.post(fingerprintTransactionToGet);
      },
      /**
       * Fetches all fingerprint transactions for op merchant
       *
       * @merchantToken     {object}    merchantToken from which to fetch all transactions
       *
       * @return {object}   Restangularized response from APId
       */
      getAllTransaction: merchantToken => {
        return rFingerprintTransactionGetAll.post(merchantToken);
      },
      getAllData: merchantToken => {
        return rFingerprintGetAllData.post(merchantToken);
      },
      saveSocialHistory: merchantToken => {
        return rFingerprintSocialSave.post(merchantToken);
      },
      getSocialHistory: merchantToken =>{
        return rFingerprintSocialData.post(merchantToken);
      },
      updateSocialHistory:merchantToken =>{
        return rFingerprintSocialUpdate.post(merchantToken);
      },
      deleteProduct: merchantToken =>{
        return rFingerprintDeleteAll.post(merchantToken);
      },
      saveCauseHistory: merchantToken =>{
        return rFingerprintCauseSave.post(merchantToken);
      },

      updateCause: merchantToken =>{
        return rFingerprintUpdateCause.post(merchantToken);
      },
      causeGet: merchantToken =>{
        return rFingerprintCauseGet.post(merchantToken);
      },
      deleteCause: merchantToken =>{
        return rFingerprintDeleteCause.post(merchantToken);
      },
      beaconGetAll: merchantToken =>{
        return rFingerprintBeaconAll.post(merchantToken);
      },

      beaconSave: merchantToken =>{
        return rFingerprintBeaconSave.post(merchantToken);
      },
      /**
       * save the selected store from pull down
       */
      storeSave: merchantToken =>{
        return rFingerprintStoreSave.post(merchantToken);
      },

      /**
       *  update store that update store data
       *
       */
      storeUpdate: storeInfo =>{
        return rFingerprintStoreUpdate.post(storeInfo);
      },

      /**
       * update beacon that update beacon through rest API call
       *
       */
      beaconUpdate: beaconInfo =>{
        return rFingerprintBeaconUpdate.post(beaconInfo);
      },
      /**
       * Get all the fingerprint stores and that is used in config file
       *
       */
      storeGetAll:storeInfo =>{
        return rFingerprintStoreGetAll.post(storeInfo);
      },

      FingerprintAllData: merchantToken =>{
          let mPass = {
              MerchantToken: merchantToken
          }
    return $q(function(resolve, reject) {
        rFingerprintGetAllData.post(mPass).then(response => {
            console.log("after api call");
        fingerprintBeaconsAllData = response.FlikResponse.Data.FingerprintBeaconsAll;
        fingerprintCausesAllData = response.FlikResponse.Data.FingerprintCauseAll;
        fingerprintTransactionsAllData = response.FlikResponse.Data.FingerprintTransactionAll;
        fingerprintLocationsAllData = response.FlikResponse.Data.FingerprintLocationAll;
        fingerprintProductsAllData = response.FlikResponse.Data.FingerprintProductAll;
        fingerprintAllData = response.FlikResponse.Data;
        console.log(response.FlikResponse.Data);
        console.log(" in api transaction");
        console.log(fingerprintTransactionsAllData);
        //$rootScope.allData.campaigns.list = campaignList;
        //$rootScope.allData.campaigns.count = campaignList.length;

        resolve(fingerprintAllData);
    }, function (err) {
        error = err;
        reject(error);
    });
});

       //return fingerprintAllData;
      },
      getFingerprintAllData: function() {
        return fingerprintAllData;
      },
getFingerprintBeaconsAllData: function() {
    return fingerprintBeaconsAllData;
},
getFingerprintCausesAllData: function() {
    return fingerprintCausesAllData;
},
getFingerprintTransactionsAllData: function() {
    console.log(" in return transaction");
    console.log(fingerprintTransactionsAllData);
    return fingerprintTransactionsAllData;
},
getFingerprintLocationsAllData: function() {
    return fingerprintLocationsAllData;
},
getFingerprintProductsAllData: function() {
    return fingerprintProductsAllData;
},
FingerprintPaginateAllData: function(start,limit,merchantToken) {

    let mPass = {
        StartLimit: start,
        EndLimit: limit,
        MerchantToken: merchantToken
    }
    return $q(function(resolve, reject) {
        console.log("before api call");
        rFingerprintPaginatedData.post(mPass).then(response => {
            console.log("response is");
        fingerprintPaginateAllData = response.FlikResponse.Data.MerchantFingerprintAll.FingerprintList;

        //$rootScope.allData.campaigns.list = campaignList;
        //$rootScope.allData.campaigns.count = campaignList.length;

        resolve(fingerprintPaginateAllData);
    },function(err){
        console.log(err);
        error = err;
        reject(error);
    });
});
//return fingerprintAllData;
},
getFingerprintPaginateAllData: function() {
    return fingerprintPaginateAllData;
}

};
}]);
