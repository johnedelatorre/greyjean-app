'use strict';

angular.module('app').factory('Offer', ["Restangular", "Fingerprint", "$q", function (Restangular, Fingerprint, $q) {

  /**
   * Our Restangular urls for Offer factory
   */
  var rOfferCreate = Restangular.all('merchant/offer/new');
  var rLoyaltyCreate = Restangular.all('merchant/offer/loyalty/new');
  var rOfferUpdate = Restangular.all('merchant/offer/update');
  var rLoyaltyUpdate = Restangular.all('merchant/offer/loyalty/update');
  var rOfferTrash = Restangular.all('merchant/offer/delete');
  var rLoyaltyTrash = Restangular.all('merchant/offer/loyalty/delete');
  var rOfferGetOne = Restangular.all('merchant/offer/get');
  var rOfferGetAll = Restangular.all('merchant/offer/all');
  var rLoyaltyGetAll = Restangular.all('merchant/offer/loyalty/getAll');
  var rOfferLocationCreate = Restangular.all("merchant/offer/location/new");
  var rOfferLocationUpdate = Restangular.all("merchant/offer/location/update");
  var rOfferLocationTrash = Restangular.all("merchant/offer/location/delete");
  var rOfferLocationGetOne = Restangular.all("merchant/offer/location/get");
  var rOfferLocationGetAll = Restangular.all("merchant/offer/location/all");
  var rOfferTransactionCreate = Restangular.all("merchant/offer/transactions/new");
  var rOfferTransactionUpdate = Restangular.all("merchant/offer/transactions/update");
  var rOfferTransactionTrash = Restangular.all("merchant/offer/transactions/delete");
  var rOfferTransactionGetOne = Restangular.all("merchant/offer/transactions/get");
  var rOfferTransactionGetAll = Restangular.all("merchant/offer/transactions/all");
  var rOfferGetAllData = Restangular.all("merchant/offer/alls");
  var rOfferPaginatedData = Restangular.all("merchant/offer/all/number");
  var offerAllData = {};
  var offerPaginateAllData = {};
  Restangular.setBaseUrl('http://66.228.114.178/genie/api/');

  return {
    /**
     * Creates a Offer and loyalty
     *
     * @offerInfo  {object}  info from $scope to create Offer
     *
     * @return {object}   Restangularized response from API
     */
    create: function create(offerInfo) {
      return rOfferCreate.post(offerInfo);
    },

    createloyalty: function createloyalty(loyaltyInfo) {
      return rLoyaltyCreate.post(loyaltyInfo);
    },
    /**
     * Updates an offer and loyalty
     *
     * @offerInfo  {object}   info from $scope to update offer
     *
     * @return {object}   Restangularized response from API
     */
    update: function update(offerInfo) {
      return rOfferUpdate.post(offerInfo);
    },

    updateloyalty: function updateloyalty(loyaltyInfo) {
      return rLoyaltyUpdate.post(loyaltyInfo);
    },
    /**
     * Deletes an offer and loyalty
     *
     * @offerToDelete  {object}  offerId from $scope to delete offer
     *
     * @return {object}   Restangularized response from API
     */
    trash: function trash(offerToTrash) {
      return rOfferTrash.post(offerToTrash);
    },

    trashloyalty: function trashloyalty(loyaltyToTrash) {
      return rLoyaltyTrash.post(loyaltyToTrash);
    },
    /**
     * Fetches one offer for op merchant
     *
     * @offerToGet  {object}   offerId from $scope to retrieve offer from API
     *
     * @return {object}   Restangularized response from API
     */
    getOne: function getOne(offerToGet) {
      return rOfferGetOne.post(offerToGet);
    },
    /**
     * Fetches all offers for op merchant
     *
     * @merchantToken  {object}    merchantToken from which to fetch all offers
     *
     * @return {object}   Restangularized response from APId
     */
    getAll: function getAll(merchantToken) {
      return rOfferGetAll.post(merchantToken);
    },

    getAllloyalty: function getAllloyalty(merchantToken) {
      return rLoyaltyGetAll.post(merchantToken);
    },
    /**
     * Creates a offer location
     *
     * @offerLocationInfo   {object}    info from $scope to create offer location
     *
     * @return {object}   Restangularized response from API
     */
    createLocation: function createLocation(offerLocationInfo) {
      return rOfferLocationCreate.post(offerLocationInfo);
    },
    /**
     * Updates a offer location
     *
     * @offerLocationInfo   {object}    info from $scope to update offer location
     *
     * @return {object}   Restangularized response from API
     */
    updateLocation: function updateLocation(offerLocationInfo) {
      return rOfferLocationUpdate.post(offerLocationInfo);
    },
    /**
     * Deletes a offer location
     *
     * @offerLocationToTrash    {object}    offerLocationId from $scope to delete offer location
     *
     * @return {object}   Restangularized response from API
     */
    trashLocation: function trashLocation(offerLocationToTrash) {
      return rOfferLocationTrash.post(offerLocationToTrash);
    },
    /**
     * Fetches one offer location for op merchant
     *
     * @offerLocationToGet    {object}    offerLocationId from $scope to retrieve offer location from API
     *
     * @return {object}   Restangularized response from API
     */
    getOneLocation: function getOneLocation(offerLocationToGet) {
      return rOfferLocationGetOne.post(offerLocationToGet);
    },
    /**
     * Fetches all offer locations for op merchant
     *
     * @merchantToken     {object}    merchantToken from which to fetch all offers
     *
     * @return {object}   Restangularized response from APId
     */
    getAllLocation: function getAllLocation(merchantToken) {
      return rOfferLocationGetAll.post(merchantToken);
    },
    /**
     * Creates a offer transaction
     *
     * @offerTransactionInfo   {object}    info from $scope to create offer transaction
     *
     * @return {object}   Restangularized response from API
     */
    createTransaction: function createTransaction(offerTransactionInfo) {
      return rOfferTransactionCreate.post(offerTransactionInfo);
    },
    /**
     * Updates a offer transaction
     *
     * @offerTransactionInfo   {object}    info from $scope to update offer transaction
     *
     * @return {object}   Restangularized response from API
     */
    updateTransaction: function updateTransaction(offerTransactionInfo) {
      return rOfferTransactionUpdate.post(offerTransactionInfo);
    },
    /**
     * Deletes a offer transaction
     *
     * @offerTransactionToTrash    {object}    offerTransactionId from $scope to delete offer transaction
     *
     * @return {object}   Restangularized response from API
     */
    trashTransaction: function trashTransaction(offerTransactionToTrash) {
      return rOfferTransactionTrash.post(offerTransactionToTrash);
    },
    /**
     * Fetches one offer transaction for op merchant
     *
     * @offerTransactionToGet    {object}    offerTransactionId from $scope to retrieve offer transaction from API
     *
     * @return {object}   Restangularized response from API
     */
    getOneTransaction: function getOneTransaction(offerTransactionToGet) {
      return rOfferTransactionGetOne.post(offerTransactionToGet);
    },
    /**
     * Fetches all offer Transactions for op merchant
     *
     * @merchantToken     {object}    merchantToken from which to fetch all offers
     *
     * @return {object}   Restangularized response from APId
     */
    getAllTransaction: function getAllTransaction(merchantToken) {
      return rOfferTransactionGetAll.post(merchantToken);
    },
    getAllData: function getAllData(merchantToken) {
      return rOfferGetAllData.post(merchantToken);
    },

    OfferAllData: function OfferAllData(merchantToken) {
      console.log("in offer start");
      var mPass = {
        MerchantToken: merchantToken
      };
      return $q(function (resolve, reject) {
        console.log("before api call");
        console.log(rOfferGetAllData);
        rOfferGetAllData.post(mPass).then(function (response) {
          console.log("response is");
          offerAllData = response.FlikResponse.Data.MerchantOfferAll;
          console.log("in offer");
          //$rootScope.allData.campaigns.list = campaignList;
          //$rootScope.allData.campaigns.count = campaignList.length;

          resolve(offerAllData);
        }, function (err) {
          console.log(err);
          error = err;
          reject(error);
        });
      });
      //return fingerprintAllData;
    },
    getOfferAllData: function getOfferAllData() {
      return offerAllData;
    },
    OfferPaginateAllData: function OfferPaginateAllData(start, limit, merchantToken) {
      console.log("in offer pagination start");
      var mPass = {
        StartLimit: start,
        EndLimit: limit,
        MerchantToken: merchantToken
      };
      return $q(function (resolve, reject) {
        rOfferPaginatedData.post(mPass).then(function (response) {
          offerPaginateAllData = response.FlikResponse.Data.MerchantOfferAll.MerchantOfferList;
          console.log("in offer");

          resolve(offerPaginateAllData);
        }, function (err) {
          console.log(err);
          error = err;
          reject(error);
        });
      });
      //return fingerprintAllData;
    },
    getOfferPaginateAllData: function getOfferPaginateAllData() {
      return offerPaginateAllData;
    }
  };
}]);
//# sourceMappingURL=offer.js.map