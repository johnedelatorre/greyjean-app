'use strict';

angular.module('app')
.factory('Offer', ["Restangular","Fingerprint","$q",
  function(         Restangular,Fingerprint,$q) {

  /**
   * Our Restangular urls for Offer factory
   */
  let rOfferCreate            = Restangular.all('merchant/offer/new');
  let rLoyaltyCreate          = Restangular.all('merchant/offer/loyalty/new');
  let rOfferUpdate            = Restangular.all('merchant/offer/update');
  let rLoyaltyUpdate          = Restangular.all('merchant/offer/loyalty/update');
  let rOfferTrash             = Restangular.all('merchant/offer/delete');
  let rLoyaltyTrash           = Restangular.all('merchant/offer/loyalty/delete');
  let rOfferGetOne            = Restangular.all('merchant/offer/get');
  let rOfferGetAll            = Restangular.all('merchant/offer/all');
  let rLoyaltyGetAll          = Restangular.all('merchant/offer/loyalty/getAll');
  let rOfferLocationCreate    = Restangular.all("merchant/offer/location/new");
  let rOfferLocationUpdate    = Restangular.all("merchant/offer/location/update");
  let rOfferLocationTrash     = Restangular.all("merchant/offer/location/delete");
  let rOfferLocationGetOne    = Restangular.all("merchant/offer/location/get");
  let rOfferLocationGetAll    = Restangular.all("merchant/offer/location/all");
  let rOfferTransactionCreate = Restangular.all("merchant/offer/transactions/new");
  let rOfferTransactionUpdate = Restangular.all("merchant/offer/transactions/update");
  let rOfferTransactionTrash  = Restangular.all("merchant/offer/transactions/delete");
  let rOfferTransactionGetOne = Restangular.all("merchant/offer/transactions/get");
  let rOfferTransactionGetAll = Restangular.all("merchant/offer/transactions/all");
  let rOfferGetAllData        = Restangular.all("merchant/offer/alls");
      let rOfferPaginatedData = Restangular.all("merchant/offer/all/number");
  var offerAllData            = {};
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
    create: offerInfo => {
      return rOfferCreate.post(offerInfo);
    },

    createloyalty: loyaltyInfo => {
    return rLoyaltyCreate.post(loyaltyInfo);
    },
    /**
     * Updates an offer and loyalty
     *
     * @offerInfo  {object}   info from $scope to update offer
     *
     * @return {object}   Restangularized response from API
     */
    update: offerInfo => {
      return rOfferUpdate.post(offerInfo);
    },

    updateloyalty: loyaltyInfo => {
        return rLoyaltyUpdate.post(loyaltyInfo);
    },
    /**
     * Deletes an offer and loyalty
     *
     * @offerToDelete  {object}  offerId from $scope to delete offer
     *
     * @return {object}   Restangularized response from API
     */
    trash: offerToTrash => {
      return rOfferTrash.post(offerToTrash);
    },

    trashloyalty: loyaltyToTrash => {
        return rLoyaltyTrash.post(loyaltyToTrash);
    },
    /**
     * Fetches one offer for op merchant
     *
     * @offerToGet  {object}   offerId from $scope to retrieve offer from API
     *
     * @return {object}   Restangularized response from API
     */
    getOne: offerToGet => {
      return rOfferGetOne.post(offerToGet);
    },
    /**
     * Fetches all offers for op merchant
     *
     * @merchantToken  {object}    merchantToken from which to fetch all offers
     *
     * @return {object}   Restangularized response from APId
     */
    getAll: merchantToken => {
      return rOfferGetAll.post(merchantToken);
    },

    getAllloyalty: merchantToken => {
        return rLoyaltyGetAll.post(merchantToken);
    },
    /**
     * Creates a offer location
     *
     * @offerLocationInfo   {object}    info from $scope to create offer location
     *
     * @return {object}   Restangularized response from API
     */
    createLocation: offerLocationInfo => {
      return rOfferLocationCreate.post(offerLocationInfo);
    },
    /**
     * Updates a offer location
     *
     * @offerLocationInfo   {object}    info from $scope to update offer location
     *
     * @return {object}   Restangularized response from API
     */
    updateLocation: offerLocationInfo => {
      return rOfferLocationUpdate.post(offerLocationInfo);
    },
    /**
     * Deletes a offer location
     *
     * @offerLocationToTrash    {object}    offerLocationId from $scope to delete offer location
     *
     * @return {object}   Restangularized response from API
     */
    trashLocation: offerLocationToTrash => {
      return rOfferLocationTrash.post(offerLocationToTrash);
    },
    /**
     * Fetches one offer location for op merchant
     *
     * @offerLocationToGet    {object}    offerLocationId from $scope to retrieve offer location from API
     *
     * @return {object}   Restangularized response from API
     */
    getOneLocation: offerLocationToGet => {
      return rOfferLocationGetOne.post(offerLocationToGet);
    },
    /**
     * Fetches all offer locations for op merchant
     *
     * @merchantToken     {object}    merchantToken from which to fetch all offers
     *
     * @return {object}   Restangularized response from APId
     */
    getAllLocation: merchantToken => {
      return rOfferLocationGetAll.post(merchantToken);
    },
    /**
     * Creates a offer transaction
     *
     * @offerTransactionInfo   {object}    info from $scope to create offer transaction
     *
     * @return {object}   Restangularized response from API
     */
    createTransaction: offerTransactionInfo => {
      return rOfferTransactionCreate.post(offerTransactionInfo);
    },
    /**
     * Updates a offer transaction
     *
     * @offerTransactionInfo   {object}    info from $scope to update offer transaction
     *
     * @return {object}   Restangularized response from API
     */
    updateTransaction: offerTransactionInfo => {
      return rOfferTransactionUpdate.post(offerTransactionInfo);
    },
    /**
     * Deletes a offer transaction
     *
     * @offerTransactionToTrash    {object}    offerTransactionId from $scope to delete offer transaction
     *
     * @return {object}   Restangularized response from API
     */
    trashTransaction: offerTransactionToTrash => {
      return rOfferTransactionTrash.post(offerTransactionToTrash);
    },
    /**
     * Fetches one offer transaction for op merchant
     *
     * @offerTransactionToGet    {object}    offerTransactionId from $scope to retrieve offer transaction from API
     *
     * @return {object}   Restangularized response from API
     */
    getOneTransaction: offerTransactionToGet => {
      return rOfferTransactionGetOne.post(offerTransactionToGet);
    },
    /**
     * Fetches all offer Transactions for op merchant
     *
     * @merchantToken     {object}    merchantToken from which to fetch all offers
     *
     * @return {object}   Restangularized response from APId
     */
    getAllTransaction: merchantToken => {
      return rOfferTransactionGetAll.post(merchantToken);
    },
    getAllData: merchantToken => {
      return rOfferGetAllData.post(merchantToken);
    },

OfferAllData: merchantToken =>{
    console.log("in offer start");
    let mPass = {
        MerchantToken: merchantToken
    }
    return $q(function(resolve, reject) {
        console.log("before api call");
        console.log(rOfferGetAllData);
        rOfferGetAllData.post(mPass).then(response =>{
            console.log("response is")
        offerAllData = response.FlikResponse.Data.MerchantOfferAll;
        console.log("in offer");
        //$rootScope.allData.campaigns.list = campaignList;
        //$rootScope.allData.campaigns.count = campaignList.length;

        resolve(offerAllData);
    },function(err){
        console.log(err);
        error = err;
        reject(error);
    });
});
//return fingerprintAllData;
},
 getOfferAllData: function() {
    return offerAllData;
},
OfferPaginateAllData: function(start,limit,merchantToken) {
    console.log("in offer pagination start");
    let mPass = {
        StartLimit: start,
        EndLimit: limit,
        MerchantToken: merchantToken
    }
    return $q(function(resolve, reject) {
        rOfferPaginatedData.post(mPass).then(response =>{
        offerPaginateAllData = response.FlikResponse.Data.MerchantOfferAll.MerchantOfferList;
        console.log("in offer");

        resolve(offerPaginateAllData);
    },function(err){
        console.log(err);
        error = err;
        reject(error);
    });
});
//return fingerprintAllData;
},
getOfferPaginateAllData: function() {
    return offerPaginateAllData;
}
};

}]);
