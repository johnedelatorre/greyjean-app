"use strict";

// Form controller
app.controller("CoreProfileCtrl", ["$scope", "$rootScope", "FileUploader", "locker", "$filter", "$state", "$stateParams", "$mdToast", "$animate", "Product", "Store", "Offer", "Cause", "Fingerprint", "Beacon", "Campaign", function ($scope, $rootScope, FileUploader, locker, $filter, $state, $stateParams, $mdToast, $animate, Product, Store, Offer, Cause, Fingerprint, Beacon, Campaign) {

  /**
   * get Dexie dbCore
   *
   */
  var dbCore = $rootScope.dbCore;

  /**
   * get merchantMe and merchantToken from Locker
   *
   */
  var merchantMe = locker.driver("local").namespace("core").get("me");
  var merchantToken = locker.driver("local").namespace("core").get("merchantToken");
  var mPass = {
    MerchantToken: merchantToken
  };
  $scope.productRows = {

    allProductRows: []
  };

  // store function
  $scope.allStores = function () {
    Store.storeGetAll(mPass).then(function (response) {
      var storeList = response.FlikResponse.Data.MerchantStoreAll.StoreList;
      //$rootScope.allData.stores.list = storeList;
      //$rootScope.allData.stores.count = storeList.length;
      $scope.storesRows = {
        allStoreRows: storeList
      };
    });
  };
  $scope.allLoyalty = function () {
    Offer.getAllloyalty(mPass).then(function (response) {
      var loyaltyList = response.FlikResponse.Data.MerchantOfferLoyaltyAll.OfferLoyaltyList;
      //$rootScope.allData.loyalty.list = loyaltyList;
      //$rootScope.allData.loyalty.count = loyaltyList.length;
      $scope.loyaltyRows = {
        allLoyaltyRows: loyaltyList
      };
    });
  };
  $scope.allLoyalty();
  // uploader store

  var uploaderStore = $scope.uploaderStore = new FileUploader({
    url: 'http://66.228.114.178/genie/api/upload/merchant/store'
  });

  // FILTERS

  uploaderStore.filters.push({
    name: 'customFilter',
    fn: function fn(item, /*{File|FileLikeObject}*/options) {
      return this.queue.length < 10;
    }
  });

  uploaderStore.formData.push({
    MerchantToken: merchantToken
  });

  // CALLBACKS

  uploaderStore.onWhenAddingFileFailed = function (item, /*{File|FileLikeObject}*/filter, options) {
    //console.info('onWhenAddingFileFailed', item, filter, options);
  };
  uploaderStore.onAfterAddingFile = function (fileItem) {
    //console.info('onAfterAddingFile', fileItem);
  };
  uploaderStore.onAfterAddingAll = function (addedFileItems) {
    //console.info('onAfterAddingAll', addedFileItems);
  };
  uploaderStore.onBeforeUploadItem = function (item) {
    //console.info('onBeforeUploadItem', item);
  };
  uploaderStore.onProgressItem = function (fileItem, progress) {
    //console.info('onProgressItem', fileItem, progress);
  };
  uploaderStore.onProgressAll = function (progress) {
    //console.info('onProgressAll', progress);
  };
  uploaderStore.onSuccessItem = function (fileItem, response, status, headers) {
    //console.info('onSuccessItem', fileItem, response, status, headers);

  };
  uploaderStore.onErrorItem = function (fileItem, response, status, headers) {
    //console.info('onErrorItem', fileItem, response, status, headers);
  };
  uploaderStore.onCancelItem = function (fileItem, response, status, headers) {
    //console.info('onCancelItem', fileItem, response, status, headers);
  };
  uploaderStore.onCompleteItem = function (fileItem, response, status, headers) {
    //console.info('onCompleteItem', fileItem, response, status, headers);
  };
  uploaderStore.onCompleteAll = function () {
    //console.info('onCompleteAll');
  };

  //console.info('uploaderStore', uploaderStore);

  // product function
  //$scope.allProducts =()=>{
  //  Product.getAll(mPass).then(response =>{
  //    let productList = response.FlikResponse.Data.MerchantProductAll.ProductList;
  //    $rootScope.allData.products.list             = productList;
  //    $rootScope.allData.products.count            = productList.length;
  //    //$rootScope.allData.products.categories.list  = productList.length > 0 ? $filter('unique')(productList, 'productCategory') : [];
  //    //$rootScope.allData.products.categories.count = $rootScope.allData.products.categories.list.length;
  //    //$rootScope.allData.products.types.list       = productList.length > 0 ? $filter('unique')(productList, 'productType') : [];
  //    //$rootScope.allData.products.types.count      = $rootScope.allData.products.types.list.length;
  //    //$rootScope.allData.products.name.list        = productList.length > 0 ? $filter('unique')(productList, 'productName') : [];
  //    //$rootScope.allData.products.name.count       = $rootScope.allData.products.types.list.length;
  //    //$rootScope.allData.products.brands.list      = productList.length > 0 ?  $filter('unique')(productList, 'brandName') : [];
  //    //$rootScope.allData.products.brands.count     = $rootScope.allData.products.brands.list.length;
  //    $scope.productRows = {
  //      allProductRows: productList
  //    };
  //  });
  //};

  // uploader product

  var uploaderProduct = $scope.uploaderProduct = new FileUploader({
    method: 'POST',
    url: 'http://66.228.114.178/genie/api/upload/merchant/product'

  });

  // FILTERS

  uploaderProduct.filters.push({
    name: 'customFilter',
    fn: function fn(item, /*{File|FileLikeObject}*/options) {
      return this.queue.length < 10;
    }
  });

  uploaderProduct.formData.push({
    MerchantToken: merchantToken
  });
  // CALLBACKS

  uploaderProduct.onWhenAddingFileFailed = function (item, /*{File|FileLikeObject}*/filter, options) {
    //console.info('onWhenAddingFileFailed', item, filter, options);
  };
  uploaderProduct.onAfterAddingFile = function (fileItem) {
    //console.info('onAfterAddingFile', fileItem);
  };
  uploaderProduct.onAfterAddingAll = function (addedFileItems) {
    //console.info('onAfterAddingAll', addedFileItems);
  };
  uploaderProduct.onBeforeUploadItem = function (item) {
    //console.info('onBeforeUploadItem', item);
  };
  uploaderProduct.onProgressItem = function (fileItem, progress) {
    //console.info('onProgressItem', fileItem, progress);
  };
  uploaderProduct.onProgressAll = function (progress) {
    //console.info('onProgressAll', progress);
  };
  uploaderProduct.onSuccessItem = function (fileItem, response, status, headers) {
    //console.info('onSuccessItem', fileItem, response, status, headers);
    $scope.allProducts();
  };
  uploaderProduct.onErrorItem = function (fileItem, response, status, headers) {
    //console.info('onErrorItem', fileItem, response, status, headers);
  };
  uploaderProduct.onCancelItem = function (fileItem, response, status, headers) {
    //console.info('onCancelItem', fileItem, response, status, headers);
  };
  uploaderProduct.onCompleteItem = function (fileItem, response, status, headers) {
    //console.info('onCompleteItem', fileItem, response, status, headers);
  };
  uploaderProduct.onCompleteAll = function () {
    //console.info('onCompleteAll');
  };

  //console.info('uploaderProduct', uploaderProduct);

  // uploader consumer

  var uploaderConsumer = $scope.uploaderConsumer = new FileUploader({
    url: 'http://66.228.114.178/genie/api/upload/consumer'
  });

  // FILTERS

  uploaderConsumer.filters.push({
    name: 'customFilter',
    fn: function fn(item, /*{File|FileLikeObject}*/options) {
      return this.queue.length < 10;
    }
  });
  uploaderConsumer.formData.push({
    MerchantToken: merchantToken
  });
  // CALLBACKS

  uploaderConsumer.onWhenAddingFileFailed = function (item, /*{File|FileLikeObject}*/filter, options) {
    //console.info('onWhenAddingFileFailed', item, filter, options);
  };
  uploaderConsumer.onAfterAddingFile = function (fileItem) {
    //console.info('onAfterAddingFile', fileItem);
  };
  uploaderConsumer.onAfterAddingAll = function (addedFileItems) {
    //console.info('onAfterAddingAll', addedFileItems);
  };
  uploaderConsumer.onBeforeUploadItem = function (item) {
    //console.info('onBeforeUploadItem', item);
  };
  uploaderConsumer.onProgressItem = function (fileItem, progress) {
    //console.info('onProgressItem', fileItem, progress);
  };
  uploaderConsumer.onProgressAll = function (progress) {
    //console.info('onProgressAll', progress);
  };
  uploaderConsumer.onSuccessItem = function (fileItem, response, status, headers) {
    //console.info('onSuccessItem', fileItem, response, status, headers);
  };
  uploaderConsumer.onErrorItem = function (fileItem, response, status, headers) {
    //console.info('onErrorItem', fileItem, response, status, headers);
  };
  uploaderConsumer.onCancelItem = function (fileItem, response, status, headers) {
    //console.info('onCancelItem', fileItem, response, status, headers);
  };
  uploaderConsumer.onCompleteItem = function (fileItem, response, status, headers) {
    //console.info('onCompleteItem', fileItem, response, status, headers);
  };
  uploaderConsumer.onCompleteAll = function () {
    //console.info('onCompleteAll');
  };

  //console.info('uploaderConsumer', uploaderConsumer);

  // uploader transaction

  var uploaderTransaction = $scope.uploaderTransaction = new FileUploader({
    url: 'http://66.228.114.178/genie/api/upload/transaction'
  });

  // FILTERS

  uploaderTransaction.filters.push({
    name: 'customFilter',
    fn: function fn(item, /*{File|FileLikeObject}*/options) {
      return this.queue.length < 10;
    }
  });

  uploaderTransaction.formData.push({
    MerchantToken: merchantToken
  });

  // CALLBACKS

  uploaderTransaction.onWhenAddingFileFailed = function (item, /*{File|FileLikeObject}*/filter, options) {
    //console.info('onWhenAddingFileFailed', item, filter, options);
  };
  uploaderTransaction.onAfterAddingFile = function (fileItem) {
    //console.info('onAfterAddingFile', fileItem);
  };
  uploaderTransaction.onAfterAddingAll = function (addedFileItems) {
    //console.info('onAfterAddingAll', addedFileItems);
  };
  uploaderTransaction.onBeforeUploadItem = function (item) {
    //console.info('onBeforeUploadItem', item);
  };
  uploaderTransaction.onProgressItem = function (fileItem, progress) {
    //console.info('onProgressItem', fileItem, progress);
  };
  uploaderTransaction.onProgressAll = function (progress) {
    //console.info('onProgressAll', progress);
  };
  uploaderTransaction.onSuccessItem = function (fileItem, response, status, headers) {
    //console.info('onSuccessItem', fileItem, response, status, headers);
  };
  uploaderTransaction.onErrorItem = function (fileItem, response, status, headers) {
    //console.info('onErrorItem', fileItem, response, status, headers);
  };
  uploaderTransaction.onCancelItem = function (fileItem, response, status, headers) {
    //console.info('onCancelItem', fileItem, response, status, headers);
  };
  uploaderTransaction.onCompleteItem = function (fileItem, response, status, headers) {
    //console.info('onCompleteItem', fileItem, response, status, headers);
  };
  uploaderTransaction.onCompleteAll = function () {
    //console.info('onCompleteAll');
  };

  //console.info('uploaderTransaction', uploaderTransaction);

  // cause function
  $scope.allCauses = function () {
    console.log(" in profile all causes");
    Cause.causeGetAll(mPass).then(function (response) {
      var causeList = response.FlikResponse.Data.MerchantCauseAllAll.CauseAllList;
      $rootScope.allData.causes.list = causeList;
      $rootScope.allData.causes.count = causeList.length;
      $scope.causeRows = {
        allCauseRows: causeList
      };
    });
  };

  // uploader cause

  var uploaderCause = $scope.uploaderCause = new FileUploader({
    url: 'http://66.228.114.178/genie/api/upload/merchant/cause'
  });

  // FILTERS

  uploaderCause.filters.push({
    name: 'customFilter',
    fn: function fn(item, /*{File|FileLikeObject}*/options) {
      return this.queue.length < 10;
    }
  });
  uploaderCause.formData.push({
    MerchantToken: merchantToken
  });
  // CALLBACKS

  uploaderCause.onWhenAddingFileFailed = function (item, /*{File|FileLikeObject}*/filter, options) {
    //console.info('onWhenAddingFileFailed', item, filter, options);
  };
  uploaderCause.onAfterAddingFile = function (fileItem) {
    //console.info('onAfterAddingFile', fileItem);
  };
  uploaderCause.onAfterAddingAll = function (addedFileItems) {
    //console.info('onAfterAddingAll', addedFileItems);
  };
  uploaderCause.onBeforeUploadItem = function (item) {
    //console.info('onBeforeUploadItem', item);
  };
  uploaderCause.onProgressItem = function (fileItem, progress) {
    //console.info('onProgressItem', fileItem, progress);
  };
  uploaderCause.onProgressAll = function (progress) {
    //console.info('onProgressAll', progress);
  };
  uploaderCause.onSuccessItem = function (fileItem, response, status, headers) {
    //console.info('onSuccessItem', fileItem, response, status, headers);
    $scope.allCauses();
  };
  uploaderCause.onErrorItem = function (fileItem, response, status, headers) {
    //console.info('onErrorItem', fileItem, response, status, headers);
  };
  uploaderCause.onCancelItem = function (fileItem, response, status, headers) {
    //console.info('onCancelItem', fileItem, response, status, headers);
  };
  uploaderCause.onCompleteItem = function (fileItem, response, status, headers) {
    //console.info('onCompleteItem', fileItem, response, status, headers);
  };
  uploaderCause.onCompleteAll = function () {
    //console.info('onCompleteAll');
  };

  //console.info('uploaderCause', uploaderCause);

  // function Beacon
  $scope.allBeacons = function () {
    Beacon.beaconGetAll(mPass).then(function (response) {
      var beaconList = response.FlikResponse.Data.MerchantBeacons.GetAll;
      //$rootScope.allData.beacons.list = beaconList;
      //$rootScope.allData.beacons.count = beaconList.length;
      $scope.beaconRows = {
        allBeaconRows: beaconList
      };
    });
  };

  //uploader beacon

  var uploaderBeacon = $scope.uploaderBeacon = new FileUploader({
    method: "post",
    url: 'http://66.228.114.178/genie/api/upload/merchant/beacons'
  });

  // FILTERS

  uploaderBeacon.filters.push({
    name: 'customFilter',
    fn: function fn(item, /*{File|FileLikeObject}*/options) {
      return this.queue.length < 10;
    }
  });

  uploaderBeacon.formData.push({
    MerchantToken: merchantToken
  });
  // CALLBACKS

  uploaderBeacon.onWhenAddingFileFailed = function (item, /*{File|FileLikeObject}*/filter, options) {
    //console.info('onWhenAddingFileFailed', item, filter, options);
  };
  uploaderBeacon.onAfterAddingFile = function (fileItem) {
    //console.info('onAfterAddingFile', fileItem);
  };
  uploaderBeacon.onAfterAddingAll = function (addedFileItems) {
    //console.info('onAfterAddingAll', addedFileItems);
  };
  uploaderBeacon.onBeforeUploadItem = function (item) {
    //console.info('onBeforeUploadItem', item);
  };
  uploaderBeacon.onProgressItem = function (fileItem, progress) {
    //console.info('onProgressItem', fileItem, progress);
  };
  uploaderBeacon.onProgressAll = function (progress) {
    //console.info('onProgressAll', progress);
  };
  uploaderBeacon.onSuccessItem = function (fileItem, response, status, headers) {
    //console.info('onSuccessItem', fileItem, response, status, headers);
    $scope.allBeacons();
  };
  uploaderBeacon.onErrorItem = function (fileItem, response, status, headers) {
    //console.info('onErrorItem', fileItem, response, status, headers);
  };
  uploaderBeacon.onCancelItem = function (fileItem, response, status, headers) {
    //console.info('onCancelItem', fileItem, response, status, headers);
  };
  uploaderBeacon.onCompleteItem = function (fileItem, response, status, headers) {
    //console.info('onCompleteItem', fileItem, response, status, headers);
  };
  uploaderBeacon.onCompleteAll = function () {
    //console.info('onCompleteAll');
  };

  //console.info('uploaderBeacon', uploaderBeacon);

  $scope.allCampaigns = function () {
    console.log(" in profile campaign");
    Campaign.getAll(mPass).then(function (response) {
      var campaignList = response.FlikResponse.Data.MerchantCampaign.CampaignList;
      //$rootScope.allData.campaigns.list = campaignList;
      //$rootScope.allData.campaigns.count = campaignList.length;
      $scope.campaignRows = {
        allCampaignRows: campaignList
      };
    });
  };

  //Campaign Loader

  var uploaderCampaign = $scope.uploaderCampaign = new FileUploader({
    method: "post",
    url: 'http://66.228.114.178/genie/api/upload/merchant/campaign'
  });

  // FILTERS
  uploaderCampaign.filters.push({
    name: 'customFilter',
    fn: function fn(item, /*{File|FileLikeObject}*/options) {
      return this.queue.length < 10;
    }
  });

  uploaderCampaign.formData.push({
    MerchantToken: merchantToken
  });

  // CALLBACKS

  uploaderCampaign.onWhenAddingFileFailed = function (item, /*{File|FileLikeObject}*/filter, options) {
    //console.info('onWhenAddingFileFailed', item, filter, options);
  };

  uploaderCampaign.onAfterAddingFile = function (fileItem) {
    //console.info('onAfterAddingFile', fileItem);
  };

  uploaderCampaign.onAfterAddingAll = function (addedFileItems) {
    //console.info('onAfterAddingAll', addedFileItems);
  };

  uploaderCampaign.onBeforeUploadItem = function (item) {
    //console.info('onBeforeUploadItem', item);
  };
  uploaderCampaign.onProgressItem = function (fileItem, progress) {
    //console.info('onProgressItem', fileItem, progress);
  };
  uploaderCampaign.onProgressAll = function (progress) {
    //console.info('onProgressAll', progress);
  };
  uploaderCampaign.onSuccessItem = function (fileItem, response, status, headers) {
    //console.info('onSuccessItem', fileItem, response, status, headers);
    $scope.allCampaigns();
  };
  uploaderCampaign.onErrorItem = function (fileItem, response, status, headers) {
    //console.info('onErrorItem', fileItem, response, status, headers);
  };
  uploaderCampaign.onCancelItem = function (fileItem, response, status, headers) {
    //console.info('onCancelItem', fileItem, response, status, headers);
  };
  uploaderCampaign.onCompleteItem = function (fileItem, response, status, headers) {
    //console.info('onCompleteItem', fileItem, response, status, headers);
  };
  uploaderCampaign.onCompleteAll = function () {
    //console.info('onCompleteAll');
  };

  //console.info('uploaderCampaign', uploaderCampaign);
}]);
//# sourceMappingURL=core.profile.js.map