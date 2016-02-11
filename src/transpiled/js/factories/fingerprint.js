"use strict";

angular.module("app").factory("Fingerprint", ["Restangular", "$q", function (Restangular, $q) {

  /**
   * Our Restangular urls for Fingerprint factory
   */
  var rFingerprintCreate = Restangular.all("merchant/fingerprint/new");
  var rFingerprintUpdate = Restangular.all("merchant/fingerprint/update");
  var rFingerprintTrash = Restangular.all("merchant/fingerprint/delete");
  var rFingerprintGetOne = Restangular.all("merchant/fingerprint/get");
  var rFingerprintGetAll = Restangular.all("merchant/fingerprint/all");
  var rFingerprintLocationCreate = Restangular.all("merchant/fingerprint/location/new");
  var rFingerprintLocationUpdate = Restangular.all("merchant/fingerprint/location/update");
  var rFingerprintLocationTrash = Restangular.all("merchant/fingerprint/location/delete");
  var rFingerprintLocationGetOne = Restangular.all("merchant/fingerprint/location/get");
  var rFingerprintLocationGetAll = Restangular.all("merchant/fingerprint/location/all");
  var rFingerprintTransactionCreate = Restangular.all("merchant/fingerprint/transactions/new");
  var rFingerprintTransactionUpdate = Restangular.all("merchant/fingerprint/transactions/update");
  var rFingerprintTransactionTrash = Restangular.all("merchant/fingerprint/transactions/delete");
  var rFingerprintTransactionGetOne = Restangular.all("merchant/fingerprint/transactions/get");
  var rFingerprintTransactionGetAll = Restangular.all("merchant/fingerprint/transactions/all");
  var rFingerprintSocialSave = Restangular.all("merchant/fingerprint/product/new ");
  var rFingerprintSocialUpdate = Restangular.all("merchant/fingerprint/product/update");
  var rFingerprintProductDelete = Restangular.all("merchant/fingerprint/product/delete");
  var rFingerprintSocialData = Restangular.all("merchant/fingerprint/product/all");
  var rFingerprintGetAllData = Restangular.all("merchant/fingerprint/alls");
  var rFingerprintDeleteAll = Restangular.all("merchant/fingerprint/product/deleteAll");
  var rFingerprintCauseSave = Restangular.all("merchant/fingerprint/cause/new");
  var rFingerprintUpdateCause = Restangular.all("merchant/fingerprint/cause/update");
  var rFingerprintCauseGet = Restangular.all("merchant/fingerprint/cause/all");
  var rFingerprintDeleteCause = Restangular.all("merchant/fingerprint/cause/deleteAll");
  var rFingerprintBeaconAll = Restangular.all("merchant/fingerprint/beacons/getAll");
  var rFingerprintBeaconSave = Restangular.all("merchant/fingerprint/beacons/new");
  var rFingerprintBeaconUpdate = Restangular.all("merchant/fingerprint/beacons/update");
  var rFingerprintStoreSave = Restangular.all("merchant/fingerprint/store/new");
  var rFingerprintStoreUpdate = Restangular.all("merchant/fingerprint/store/update");
  var rFingerprintStoreGetAll = Restangular.all("merchant/fingerprint/store/getAll");
  var rFingerprintPaginatedData = Restangular.all("merchant/fingerprint/all/number");

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
    create: function create(fingerprintInfo) {
      return rFingerprintCreate.post(fingerprintInfo);
    },
    /**
     * Updates a fingerprint
     *
     * @fingerprintInfo   {object}   info from $scope to update fingerprint
     *
     * @return {object}   Restangularized response from API
     */
    update: function update(fingerprintInfo) {
      return rFingerprintUpdate.post(fingerprintInfo);
    },
    /**
     * Deletes a fingerprint
     *
     * @fingerprintToTrash    {object}    fingerprintId from $scope to delete fingerprint
     *
     * @return {object}   Restangularized response from API
     */
    trash: function trash(fingerprintToTrash) {
      return rFingerprintTrash.post(fingerprintToTrash);
    },
    /**
     * Fetches one fingerprint for op merchant
     *
     * @fingerprintToGet  {object}    fingerprintId from $scope to retrieve fingerprint from API
     *
     * @return {object}   Restangularized response from API
     */
    getOne: function getOne(fingerprintToGet) {
      return rFingerprintGetOne.post(fingerprintToGet);
    },
    /**
     * Fetches all fingerprints for op merchant
     *
     * @merchantToken     {object}    merchantToken from which to fetch all fingerprints
     *
     * @return {object}   Restangularized response from APId
     */
    getAll: function getAll(merchantToken) {
      return rFingerprintGetAll.post(merchantToken);
    },
    /**
     * Creates a fingerprint location
     *
     * @fingerprintLocationInfo   {object}    info from $scope to create fingerprint location
     *
     * @return {object}   Restangularized response from API
     */
    createLocation: function createLocation(fingerprintLocationInfo) {
      return rFingerprintLocationCreate.post(fingerprintLocationInfo);
    },
    /**
     * Updates a fingerprint location
     *
     * @fingerprintLocationInfo   {object}    info from $scope to update fingerprint location
     *
     * @return {object}   Restangularized response from API
     */
    updateLocation: function updateLocation(fingerprintLocationInfo) {
      return rFingerprintLocationUpdate.post(fingerprintLocationInfo);
    },
    /**
     * Deletes a fingerprint location
     *
     * @fingerprintLocationToTrash    {object}    fingerprintLocationId from $scope to delete fingerprint location
     *
     * @return {object}   Restangularized response from API
     */
    trashLocation: function trashLocation(fingerprintLocationToTrash) {
      return rFingerprintLocationTrash.post(fingerprintLocationToTrash);
    },
    /**
     * Fetches one fingerprint location for op merchant
     *
     * @fingerprintLocationToGet    {object}    fingerprintLocationId from $scope to retrieve fingerprint location from API
     *
     * @return {object}   Restangularized response from API
     */
    getOneLocation: function getOneLocation(fingerprintLocationToGet) {
      return rFingerprintLocationGetOne.post(fingerprintLocationToGet);
    },
    /**
     * Fetches all fingerprint locations for op merchant
     *
     * @merchantToken     {object}    merchantToken from which to fetch all fingerprints
     *
     * @return {object}   Restangularized response from APId
     */
    getAllLocation: function getAllLocation(merchantToken) {
      return rFingerprintLocationGetAll.post(merchantToken);
    },
    /**
     * Creates a fingerprint transaction
     *
     * @fingerprintTransactionInfo   {object}    info from $scope to create fingerprint transaction
     *
     * @return {object}   Restangularized response from API
     */
    createTransaction: function createTransaction(fingerprintTransactionInfo) {
      return rFingerprintTransactionCreate.post(fingerprintTransactionInfo);
    },
    /**
     * Updates a fingerprint transaction
     *
     * @fingerprintTransactionInfo   {object}    info from $scope to update fingerprint transaction
     *
     * @return {object}   Restangularized response from API
     */
    updateTransaction: function updateTransaction(fingerprintTransactionInfo) {
      return rFingerprintTransactionUpdate.post(fingerprintTransactionInfo);
    },
    /**
     * Deletes a fingerprint transaction
     *
     * @fingerprintTransactionToTrash    {object}    fingerprintTransactionId from $scope to delete fingerprint transaction
     *
     * @return {object}   Restangularized response from API
     */
    trashTransaction: function trashTransaction(fingerprintTransactionToTrash) {
      return rFingerprintTransactionTrash.post(fingerprintTransactionToTrash);
    },
    /**
     * Fetches one fingerprint transaction for op merchant
     *
     * @fingerprintTransactionToGet    {object}    fingerprintTransactionId from $scope to retrieve fingerprint transaction from API
     *
     * @return {object}   Restangularized response from API
     */
    getOneTransaction: function getOneTransaction(fingerprintTransactionToGet) {
      return rFingerprintTransactionGetOne.post(fingerprintTransactionToGet);
    },
    /**
     * Fetches all fingerprint transactions for op merchant
     *
     * @merchantToken     {object}    merchantToken from which to fetch all transactions
     *
     * @return {object}   Restangularized response from APId
     */
    getAllTransaction: function getAllTransaction(merchantToken) {
      return rFingerprintTransactionGetAll.post(merchantToken);
    },
    getAllData: function getAllData(merchantToken) {
      return rFingerprintGetAllData.post(merchantToken);
    },
    saveSocialHistory: function saveSocialHistory(merchantToken) {
      return rFingerprintSocialSave.post(merchantToken);
    },
    getSocialHistory: function getSocialHistory(merchantToken) {
      return rFingerprintSocialData.post(merchantToken);
    },
    updateSocialHistory: function updateSocialHistory(merchantToken) {
      return rFingerprintSocialUpdate.post(merchantToken);
    },
    deleteProduct: function deleteProduct(merchantToken) {
      return rFingerprintDeleteAll.post(merchantToken);
    },
    saveCauseHistory: function saveCauseHistory(merchantToken) {
      return rFingerprintCauseSave.post(merchantToken);
    },

    updateCause: function updateCause(merchantToken) {
      return rFingerprintUpdateCause.post(merchantToken);
    },
    causeGet: function causeGet(merchantToken) {
      return rFingerprintCauseGet.post(merchantToken);
    },
    deleteCause: function deleteCause(merchantToken) {
      return rFingerprintDeleteCause.post(merchantToken);
    },
    beaconGetAll: function beaconGetAll(merchantToken) {
      return rFingerprintBeaconAll.post(merchantToken);
    },

    beaconSave: function beaconSave(merchantToken) {
      return rFingerprintBeaconSave.post(merchantToken);
    },
    /**
     * save the selected store from pull down
     */
    storeSave: function storeSave(merchantToken) {
      return rFingerprintStoreSave.post(merchantToken);
    },

    /**
     *  update store that update store data
     *
     */
    storeUpdate: function storeUpdate(storeInfo) {
      return rFingerprintStoreUpdate.post(storeInfo);
    },

    /**
     * update beacon that update beacon through rest API call
     *
     */
    beaconUpdate: function beaconUpdate(beaconInfo) {
      return rFingerprintBeaconUpdate.post(beaconInfo);
    },
    /**
     * Get all the fingerprint stores and that is used in config file
     *
     */
    storeGetAll: function storeGetAll(storeInfo) {
      return rFingerprintStoreGetAll.post(storeInfo);
    },

    FingerprintAllData: function FingerprintAllData(merchantToken) {
      var mPass = {
        MerchantToken: merchantToken
      };
      return $q(function (resolve, reject) {
        rFingerprintGetAllData.post(mPass).then(function (response) {
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
    getFingerprintAllData: function getFingerprintAllData() {
      return fingerprintAllData;
    },
    getFingerprintBeaconsAllData: function getFingerprintBeaconsAllData() {
      return fingerprintBeaconsAllData;
    },
    getFingerprintCausesAllData: function getFingerprintCausesAllData() {
      return fingerprintCausesAllData;
    },
    getFingerprintTransactionsAllData: function getFingerprintTransactionsAllData() {
      console.log(" in return transaction");
      console.log(fingerprintTransactionsAllData);
      return fingerprintTransactionsAllData;
    },
    getFingerprintLocationsAllData: function getFingerprintLocationsAllData() {
      return fingerprintLocationsAllData;
    },
    getFingerprintProductsAllData: function getFingerprintProductsAllData() {
      return fingerprintProductsAllData;
    },
    FingerprintPaginateAllData: function FingerprintPaginateAllData(start, limit, merchantToken) {

      var mPass = {
        StartLimit: start,
        EndLimit: limit,
        MerchantToken: merchantToken
      };
      return $q(function (resolve, reject) {
        console.log("before api call");
        rFingerprintPaginatedData.post(mPass).then(function (response) {
          console.log("response is");
          fingerprintPaginateAllData = response.FlikResponse.Data.MerchantFingerprintAll.FingerprintList;

          //$rootScope.allData.campaigns.list = campaignList;
          //$rootScope.allData.campaigns.count = campaignList.length;

          resolve(fingerprintPaginateAllData);
        }, function (err) {
          console.log(err);
          error = err;
          reject(error);
        });
      });
      //return fingerprintAllData;
    },
    getFingerprintPaginateAllData: function getFingerprintPaginateAllData() {
      return fingerprintPaginateAllData;
    }

  };
}]);
//# sourceMappingURL=fingerprint.js.map