"use strict";

app.filter("propsFilter", function () {
  return function (items, props) {
    var out = [];

    if (angular.isArray(items)) {
      items.forEach(function (item) {
        var itemMatches = false;

        var keys = Object.keys(props);
        for (var i = 0; i < keys.length; i++) {
          var prop = keys[i];
          var text = props[prop].toLowerCase();
          if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
            itemMatches = true;
            break;
          }
        }

        if (itemMatches) {
          out.push(item);
        }
      });
    } else {
      // Let the output be the input untouched
      out = items;
    }

    return out;
  };
});

app.controller("CoreFingerprintUpdateCtrl", ["$scope", "$rootScope", "locker", "Fingerprint", "$filter", "$state", "$stateParams", "$mdToast", "$timeout", "Store", function ($scope, $rootScope, locker, Fingerprint, $filter, $state, $stateParams, $mdToast, $timeout, Store) {

  $scope.allData = $rootScope.allData;
  $scope.allFingerprints = {};
  $scope.allFingerprints.list = {};
  $scope.allFingerprints.count = 0;
  $scope.stores = {};
  /**
   * get merchantMe and merchantToken from Locker
   *
   */
  var merchantMe = locker.driver("local").namespace("core").get("me");
  var merchantToken = locker.driver("local").namespace("core").get("merchantToken");
  $scope.toggleWizardLoader = {};

  Store.StoreAllData(merchantToken).then(function () {
    console.log(" in stores api call");
    $scope.stores = Store.getStoreAllData();
  });

  Fingerprint.FingerprintAllData(merchantToken).then(function () {
    $scope.allFingerprints = Fingerprint.getFingerprintAllData();
    $scope.allFingerprints.list = $scope.allFingerprints;
  });
  /**
   * update our fingerprint if fingerprint already exists
   *
   * @return {object} updated fingerprint
   */
  $scope.updateFingerprint = function () {

    var fName = $scope.fingerprintData.fingerprint[0].fingerprintName;
    var merchantId = merchantMe.merchantId;
    var currentFingerprintId = locker.driver("session").namespace("fingerprintCreate").get("activeFingerprintId");
    var shouldSaveLocation = locker.driver("session").namespace("fingerprintCreate").has("activeFingerprintLocationId");
    var shouldSaveTransaction = locker.driver("session").namespace("fingerprintCreate").has("activeFingerprintTransactionId");
    var ShouldSaveSocialTransaction = locker.driver("session").namespace("fingerprintCreate").has("activeFingerprintSocialTransactionId");
    var ShouldSaveCauseTransaction = locker.driver("session").namespace("fingerprintCreate").has("activeFingerprintCauseTransactionId");
    var shouldSaveStoreTransaction = locker.driver("session").namespace("fingerprintCreate").has("activeFingerprintStoreTransactionId");
    var shouldSaveBeaconTransaction = locker.driver("session").namespace("fingerprintCreate").has("activeFingerprintBeaconTransactionId");
    var merchantFingerprintStoreId = locker.driver("session").namespace("fingerprintCreate").get("activeFingerprintStoreTransactionId");
    var merchantFingerprintBeaconId = locker.driver("session").namespace("fingerprintCreate").get("activeFingerprintBeaconTransactionId");

    /**
     * this is what we send to the API to update fingerprint if already saved
     * from create screen.
     *
     * @fingerprint  {Object}
     */
    var fingerprintInfo = {
      FingerprintName: $scope.fingerprintData.fingerprint[0].fingerprintName,
      FingerprintId: currentFingerprintId,
      Gender: $scope.gender.filter,
      MinAge: $scope.rangeAge.minAge,
      MaxAge: $scope.rangeAge.maxAge,
      MinIncome: $scope.rangeIncome.minIncome,
      MaxIncome: $scope.rangeIncome.maxIncome,
      Radius: $scope.radius.selected.radius,
      MerchantToken: merchantToken,
      MerchantId: merchantId
    };
    console.group("current merchant");
    console.info("current merchant " + JSON.stringify(merchantMe, null, 4));
    console.table([merchantMe]);
    console.groupEnd();
    Fingerprint.update(fingerprintInfo).then(function (response) {
      var statusCode = response.FlikResponse.Status.StatusCode;
      var statusMessage = response.FlikResponse.Status.StatusMessage;
      if (statusCode == 0) {
        (function () {
          var timeNow = moment().format("YYYY-MM-DD hh:mm:ss");
          var fID = response.FlikResponse.Data.FingerPrintUpdate.FingerPrintId;
          // new logic
          angular.forEach($rootScope.allData.fingerprints.list, function (fingerprint, index) {
            if (fingerprint.fingerprintId == currentFingerprintId) {
              $rootScope.allData.fingerprints.list[index] = {
                fingerprintId: fID,
                fingerprintName: $scope.fingerprintData.fingerprint[0].fingerprintName,
                gender: $scope.gender.filter,
                minAge: $scope.rangeAge.minAge,
                maxAge: $scope.rangeAge.maxAge,
                minIncome: $scope.rangeIncome.minIncome,
                maxIncome: $scope.rangeIncome.maxIncome,
                radius: $scope.radius.selected.radius
              };
            }
          });

          $scope.updateFingerprintLocation(fID);
          locker.driver("session").namespace("fingerprintCreate").put("activeFingerprintId", fID);
        })();
      } else if (statusCode == 1 && statusMessage == "Fingerprint name already exists") {
        $scope.toggleWizardLoader.showLoader = false;
        $mdToast.show($mdToast.simple().content("Cannot Update Fingerprint " + fName + " Please try from the view/edit screen").position("top right").hideDelay(2700));
      } else if (statusCode == 3) {
        /**
         * if we reach here merchantToken is no longer valid
         * we boot user back to signin
         *
         * TODO:   =>   add modal to reauth without back to signin page
         */
        locker.driver("local").namespace("core").forget("merchantToken");
        $state.go("access.signin");
        console.group("and the status is " + statusCode);
        console.warn(JSON.stringify(response, null, 4) + " token not valid - need to login again");
        console.info("bye -- see you soon");
        console.groupEnd();
      }
    }, function (error) {
      $scope.toggleWizardLoader.showLoader = false;
      $mdToast.show($mdToast.simple().content("Error updating " + fName + " because " + JSON.stringify(error, null, 4)).position("top right").hideDelay(2700));
    });

    /**
     * update fingerprint location
     *
     * @fingerprintId  {int}  passed from $scope.updateFingerprint()
     * @return  {object}  update fingerprint success or fail
     */

    $scope.updateFingerprintLocation = function (fingerprintId) {
      /**
       * param passed to function
       * @fID {string} fingeprintId from API on $scope.saveFingeprint()
       */
      var fID = fingerprintId;
      var timeNow = moment().format("YYYY-MM-DD hh:mm:ss");
      var fLocationID = locker.driver("session").namespace("fingerprintCreate").get("activeFingerprintLocationId");

      if (!shouldSaveLocation) {
        $scope.updateFingerprintStoreTransaction(fID);
      } else {
        (function () {
          var fullLocation = $scope.fingerprintLocationAddresses.selected = [] ? "ALL" : $scope.fingerprintLocationAddresses.selected;
          /**
           * this is what we send to the API to update offer if already saved
           * from create screen.
           *
           * @fingerprintLocation  {Object}
           */
          var fingerprintLocation = {
            MerchantFingerprintId: fID,
            MerchantFingerprintLocationId: fLocationID,
            Latitude: fullLocation.latitude,
            Longitude: fullLocation.longitude,
            ZipCode: "86336",
            Date: timeNow,
            StreetAddress: fullLocation.street,
            City: fullLocation.city,
            State: fullLocation.state,
            Country: fullLocation.country,
            MerchantId: merchantMe.merchantId,
            MerchantToken: merchantToken
          };
          Fingerprint.updateLocation(fingerprintLocation).then(function (response) {
            var statusCode = response.FlikResponse.Status.StatusCode;
            var statusMessage = response.FlikResponse.Status.StatusMessage;
            if (statusCode == 0) {
              (function () {
                var timeNow = moment().format("YYYY-MM-DD hh:mm:ss");
                var fLocationID = response.FlikResponse.Data.FingerprintLocationUpdate.FingerprintLocationId;

                console.info(JSON.stringify(fID, null, 4));

                angular.forEach($rootScope.allData.fingerprints.locations.list, function (location, index) {
                  if (location.merchantFingerprintId == fID) {
                    $rootScope.allData.fingerprints.locations[index] = {
                      merchantFingerprintId: fID,
                      merchantFingerprintLocationId: fLocationID,
                      latitude: fullLocation.latitude,
                      longitude: fullLocation.longitude,
                      zipCode: "86336",
                      date: timeNow,
                      streetAddress: fullLocation.street,
                      city: fullLocation.city,
                      state: fullLocation.state,
                      country: fullLocation.country,
                      formattedAddress: fullLocation.formatted_address

                    };
                  }
                });

                locker.driver("session").namespace("fingerprintCreate").put("activeFingerprintLocationId", fLocationID);
                console.info("saved fingerprint Location with ID " + fLocationID);
                $scope.updateFingerprintStoreTransaction(fID);
              })();
            } else if (statusCode == 3) {
              /**
               * if we reach here merchantToken is no longer valid
               * we boot user back to signin
               *
               * TODO: add modal to reauth without back to signin page
               */
              locker.driver("local").namespace("core").forget("merchantToken");
              $state.go("access.signin");
              console.group("and the status is " + statusCode);
              console.warn(JSON.stringify(response, null, 4) + " token not valid - need to login again");
              console.info("bye -- see you soon");
              console.groupEnd();
            } else {
              $scope.toggleWizardLoader.showLoader = false;
              $mdToast.show($mdToast.simple().content(statusMessage).position("top right").hideDelay(2700));
              console.warn(statusMessage + " this is the status message");
            }
          }, function (error) {
            $scope.toggleWizardLoader.showLoader = false;
            $mdToast.show($mdToast.simple().content("There was an error updating fingerprint location please try again").position("top right").hideDelay(2700));
            console.warn("this is an API error from update fingerprint location");
          });
        })();
      }

      //      let fID                     = fingerprintId;
      //      let fLocationID             = locker.driver("session").namespace("fingerprintCreate").get("activeFingerprintLocationId");
      //      let fLocationUUID           = locker.driver("session").namespace("fingerprintCreate").get("activeFingerprintLocationUUID");
      //      let thisFingerprintLocation = locker.driver("local").namespace("fingerprintLocations").get(fLocationUUID);
      //      let timeNow                 = moment().format("YYYY-MM-DD hh:mm:ss");
    }; // location function ending

    /**
     * store transaction update
     *
     */
    $scope.updateFingerprintStoreTransaction = function (fID) {
      var timeNow = moment().format("YYYY-MM-DD hh:mm:ss");
      //        let shouldSaveStoreLocation = Object.keys(storeLocation).length > 0;
      var merchantFingerprintStoreId = locker.driver("session").namespace("fingerprintCreate").get("activeFingerprintStoreTransactionId");

      if (!shouldSaveStoreTransaction) {
        $scope.updateFingerprintTransaction(fID);
      } else if (shouldSaveBeaconTransaction) {
        $scope.updateFingerprintBeaconTransaction(fID);
      } else {
        (function () {
          var storeUpdateData = $scope.fingerprintStoreAddresses.selected;
          var updateStore = {
            MerchantFingerprintStoreId: merchantFingerprintStoreId,
            FingerprintId: fID,
            StoreId: storeUpdateData.storeId,
            Latitude: storeUpdateData.storeLatitude,
            Longitude: storeUpdateData.storeLongitude,
            ZipCode: storeUpdateData.storeZipCode,
            Date: timeNow,
            StreetAddress: storeUpdateData.storeStreetAddress,
            State: storeUpdateData.storeState,
            City: storeUpdateData.storeCity,
            Country: storeUpdateData.storeCountry,
            MerchantToken: merchantToken
          };
          Fingerprint.storeUpdate(updateStore).then(function (response) {
            var statusCode = response.FlikResponse.Status.StatusCode;
            var statusMessage = response.FlikResponse.Status.StatusMessage;
            if (statusCode == 0) {
              (function () {
                var storeTransactionAll = $rootScope.allData.fingerprints.storeTransactions.list;
                var storeUpdatedData = {
                  merchantFingerprintId: fID,
                  merchantFingerprintStoreId: merchantFingerprintStoreId,
                  storeId: storeUpdateData.storeId,
                  storeLatitude: storeUpdateData.storeLatitude,
                  storeLongitude: storeUpdateData.storeLongitude,
                  storeZipCode: storeUpdateData.storeZipCode,
                  date: timeNow,
                  storeStreetAddress: storeUpdateData.storeStreetAddress,
                  storeState: storeUpdateData.storeState,
                  storeCity: storeUpdateData.storeCity,
                  storeCountry: storeUpdateData.storeCountry
                };
                angular.forEach(storeTransactionAll, function (storeInfo, index) {
                  if (merchantFingerprintStoreId == storeInfo.merchantFingerprintStoreId) {
                    $rootScope.allData.fingerprints.storeTransactions.list[index] = storeUpdatedData;
                  }
                });
                $scope.updateFingerprintTransaction(fID);
              })();
            }
          });
        })();
      }
    }; // strore function ending 

    /**
     * update fingerprint transaction
     *
     * @fingerprintId  {int}  passed from $scope.updateFingerprintLocation()
     * @return  {object}  update fingerprint transaction success or fail
     */
    $scope.updateFingerprintTransaction = function (fingerprintId) {
      /**
       * param passed to function
       * @fID {string} fingeprintId from API on $scope.saveFingeprint()
       */
      var fID = fingerprintId;
      var fTransactionID = locker.driver("session").namespace("fingerprintCreate").get("activeFingerprintTransactionId");
      var fTransactionUUID = locker.driver("session").namespace("fingerprintCreate").get("activeFingerprintTransactionUUID");
      var thisFingerprintTransaction = locker.driver("local").namespace("fingerprintTransactions").get("fTransactionUUID");
      var timeNow = moment().format("YYYY-MM-DD hh:mm:ss");

      if (!shouldSaveTransaction) {
        $scope.updateFingerprintSocialTransaction(fID);
      } else {
        /**
        * this is what we send to the API to update fingerprint transaction if already saved
        * from create screen.
        *
        * @fingerprintTransaction  {Object}
        */
        var product = $scope.conBuysLists[0].filter.productCat.selected;
        var productCat = product.productCategory;
        var fingerprintUpdateTransactions = $scope.conBuysLists;
        fingerprintUpdateTransactions.forEachCat(function (updateFilter) {
          var product = Object.keys(updateFilter.filter.productCat.selected).length > 0 ? updateFilter.filter.productCat.selected : "ALL";
          var productDescription = updateFilter.filter;
          var fingerprintTransaction = {
            MerchantFingerprintId: fID,
            MerchantFingerprintTransactionId: fTransactionID,
            TransactionDate: moment().format("YYYY-MM-DD hh:mm:ss"),
            ProductId: product.productId,
            ProductName: product.productName,
            ProductQuantity: 7,
            ProductDescription: product.productDescription,
            ProductPrice: product.price,
            FinalSalePrice: 7,
            BrandName: product.brandName,
            BrandId: product.brandId,
            Product_SKU_Number: product.product_SKU_Number,
            ProductType: product.productType,
            ProductTypeDescription: product.productTypeDescription,
            ProductCategory: product.productCategory,
            ProductCategoryDescription: product.productCategoryDescription,
            LogicalOperator: productDescription.logicOperator,
            BuyNotBuy: productDescription.logicPurchased,
            MerchantToken: merchantToken
          };
          Fingerprint.updateTransaction(fingerprintTransaction).then(function (response) {
            var statusCode = response.FlikResponse.Status.StatusCode;
            var statusMessage = response.FlikResponse.Status.StatusMessage;
            if (statusCode == 0) {
              var _timeNow = moment().format("YYYY-MM-DD hh:mm:ss");
              fTransactionID = response.FlikResponse.Data.MerchantFingerprintTransaction.MerchantFingerprintTransactionId;
              console.info(JSON.stringify(fID, null, 4));

              //                $scope.toggleWizardLoader.showLoader = false;
              //                $mdToast.show(
              //                  $mdToast.simple()
              //                    .content("Fingerprint " + $scope.fingerprintName + " and targeting info updated")
              //                    .position("top right")
              //                    .hideDelay(2700)
              //                );

              angular.forEach($rootScope.allData.fingerprints.transactions.list, function (transaction, index) {
                if (transaction.merchantFingerprintId == fID) {
                  $rootScope.allData.fingerprints.transactions.list[index] = {
                    merchantFingerprintId: fID,
                    merchantFingerprintTransactionId: fTransactionID,
                    transactionDate: moment().format("YYYY-MM-DD hh:mm:ss"),
                    productId: product.productId,
                    productName: product.productName,
                    productQuantity: 7,
                    productDescription: product.productDescription,
                    productPrice: product.price,
                    finalSalePrice: 7,
                    brandName: product.brandName,
                    brandId: product.brandId,
                    product_SKU_Number: product.product_SKU_Number,
                    productType: product.productType,
                    productTypeDescription: product.productTypeDescription,
                    productCategory: product.productCategory,
                    productCategoryDescription: product.productCategoryDescription,
                    logicalOperator: productDescription.logicOperator,
                    buyNotBuy: productDescription.logicPurchased
                  };
                }
              });
              locker.driver("session").namespace("fingerprintCreate").put("activeFingerprintTransactionId", fTransactionID);
              console.info("saved fingerprint Transaction with ID " + fTransactionID);
              $scope.updateFingerprintSocialTransaction(fID);
            } else if (statusCode == 3) {
              /**
               * if we reach here merchantToken is no longer valid
               * we boot user back to signin
               *
               * TODO: add modal to reauth without back to signin page
               */
              locker.driver("local").namespace("core").forget("merchantToken");
              $state.go("access.signin");
              console.group("and the status is " + statusCode);
              console.warn(JSON.stringify(response, null, 4) + " token not valid - need to login again");
              console.info("bye -- see you soon");
              console.groupEnd();
            } else {
              $mdToast.show($mdToast.simple().content(statusMessage).position("top right").hideDelay(2700));
              console.warn(statusMessage + " this is the status message");
            }
          }, function (error) {
            $mdToast.show($mdToast.simple().content(statusMessage).position("top right").hideDelay(2700));
            console.warn("this is an API error from save fingerprint transaction");
          });
        });
      }
    }; // transaction function ending

    $scope.updateFingerprintSocialTransaction = function (fID) {
      var fiD = fID;
      var productID = locker.driver("session").namespace("fingerprintCreate").get("activeFingerprintSocialTransactionId");
      var timeNow = moment().format("YYYY-MM-DD hh:mm:ss");

      if (!ShouldSaveSocialTransaction) {
        $scope.updateFingerprintCauseTransaction(fID);
      } else {
        (function () {
          var product = $scope.conBuysSocialLists[0].sfilter.productCat.selected;
          var productCat = $scope.conBuysSocialLists[0].sfilter.productCat.selected.productCategory;
          var fingerprintUpdateSocialTransactions = $scope.conBuysSocialLists;
          var count = 0;
          fingerprintUpdateSocialTransactions.forEachCat(function (updateFilter) {

            var updateSocialProduct = {
              MerchantFingerprintId: fID,
              Date: timeNow,
              ProductName: Object.keys(updateFilter.sfilter.productName.selected).length > 0 ? updateFilter.sfilter.productName.selected.productName : "ALL",
              BrandName: Object.keys(updateFilter.sfilter.productBrand.selected).length > 0 ? updateFilter.sfilter.productBrand.selected.brandName : "ALL",
              ProductType: Object.keys(updateFilter.sfilter.productName.selected).length > 0 ? updateFilter.sfilter.productName.selected.productType : "ALL",
              ProductCategory: Object.keys(updateFilter.sfilter.productCat.selected).length > 0 ? updateFilter.sfilter.productCat.selected.productCategory : "ALL",
              LogicalOperator: updateFilter.sfilter.logicOperator,
              LikeNotLike: updateFilter.sfilter.logicPurchased,
              MerchantFingerprintProductId: updateFilter.sfilter.id,
              MerchantToken: merchantToken
            };

            Fingerprint.updateSocialHistory(updateSocialProduct).then(function (response) {
              count++;
              var statusCode = response.FlikResponse.Status.StatusCode;
              var statusMessage = response.FlikResponse.Status.StatusMessage;
              if (statusCode == 0) {
                var _timeNow2 = moment().format("YYYY-MM-DD hh:mm:ss");
                var sProductID = response.FlikResponse.Data.MerchantFingerprintProductUpdate.MerchantFingerprintProductId;
                var lengthArray = fingerprintUpdateSocialTransactions.length;
                angular.forEach($rootScope.allData.fingerprints.socialTransactions.list, function (socialTransaction, index) {
                  if (socialTransaction.merchantFingerprintId == fID) {
                    $rootScope.allData.fingerprints.socialTransactions.list[index] = {
                      merchantFingerprintId: fID,
                      merchantFingerprintProductId: updateFilter.sfilter.id,
                      date: moment(updateFilter.sfilter.timeFrames.selected).format("YYYY-MM-DD hh:mm:ss"),
                      productName: Object.keys(updateFilter.sfilter.productName.selected).length > 0 ? updateFilter.sfilter.productName.selected.productName : "ALL",
                      brandName: Object.keys(updateFilter.sfilter.productBrand.selected).length > 0 ? updateFilter.sfilter.productBrand.selected.brandName : "ALL",
                      productType: Object.keys(updateFilter.sfilter.productName.selected).length > 0 ? updateFilter.sfilter.productName.selected.productType : "ALL",
                      productCategory: Object.keys(updateFilter.sfilter.productCat.selected).length > 0 ? updateFilter.sfilter.productCat.selected.productCategory : "ALL",
                      logicalOperator: updateFilter.sfilter.logicOperator,
                      likeNotLike: updateFilter.sfilter.logicPurchased
                    };
                  }
                });

                if (count === fingerprintUpdateSocialTransactions.length) {
                  locker.driver("session").namespace("fingerprintCreate").put("activeFingerprintProductId", sProductID);
                  $scope.toggleWizardLoader.showLoader = false;
                  //                $mdToast.show(
                  //                  $mdToast.simple()
                  //                    .content("fingerprint " + $scope.fingerprintData.fingerprint[0].fingerprintName + " and targeting info saved")
                  //                    .position("top right")
                  //                    .hideDelay(2700)
                  //                );
                }
                $scope.updateFingerprintCauseTransaction(fID);
              } else {
                $scope.toggleWizardLoader.showLoader = false;
                $mdToast.show($mdToast.simple().content(statusMessage).position("top right").hideDelay(2700));
              }
            }, function (error) {
              $scope.toggleWizardLoader.showLoader = false;
              $mdToast.show($mdToast.simple().content(statusMessage).position("top right").hideDelay(2700));
            });
          });
        })();
      }
    }; // social ending

    $scope.updateFingerprintCauseTransaction = function (fID) {
      var timeNow = moment().format("YYYY-MM-DD hh:mm:ss");
      var fingerprintUpdateCauseTransactions = $scope.conBuysCauseLists;
      var count = 0;

      if (!ShouldSaveCauseTransaction) {
        $scope.toggleWizardLoader.showLoader = false;
        $mdToast.show($mdToast.simple().content("Fingerprint " + $scope.fingerprintData.fingerprint[0].fingerprintName + " with all targeting Updated").position("top right").hideDelay(2700));
      } else {
        fingerprintUpdateCauseTransactions.forEachCat(function (updateCause) {
          var updateCauses = {
            MerchantFingerprintId: fID,
            Date: timeNow,
            CauseName: updateCause.cfilter.causeName.selected.causeName,
            LogicalOperator: updateCause.cfilter.logicOperator,
            LikeNotLike: updateCause.cfilter.logicPurchased,
            MerchantFingerprintCauseId: updateCause.cfilter.id,
            MerchantToken: merchantToken
          };

          Fingerprint.updateCause(updateCauses).then(function (response) {

            count++;

            var statusCode = response.FlikResponse.Status.StatusCode;
            var statusMessage = response.FlikResponse.Status.StatusMessage;
            if (statusCode == 0) {
              (function () {
                var timeNow = moment().format("YYYY-MM-DD hh:mm:ss");
                var cCauseID = response.FlikResponse.Data.MerchantFingerprintCauseUpdate.MerchantFingerprintCauseId;
                angular.forEach($rootScope.allData.fingerprints.causeTransactions.list, function (cause, index) {
                  if (cause.merchantFingerprintId == fID) {
                    $rootScope.allData.fingerprints.causeTransactions.list[index] = {
                      merchantFingerprintId: fID,
                      merchantFingerprintCauseId: cCauseID,
                      date: moment(updateCause.cfilter.timeFrames.selected).format("YYYY-MM-DD hh:mm:ss"),
                      causeName: updateCause.cfilter.causeName.selected.causeName,
                      logicalOperator: updateCause.cfilter.logicOperator,
                      likeNotLike: updateCause.cfilter.logicPurchased

                    };
                  }
                });

                if (count === fingerprintUpdateCauseTransactions.length) {
                  locker.driver("session").namespace("fingerprintCreate").put("activeFingerprintProductId", cCauseID);
                  $scope.toggleWizardLoader.showLoader = false;
                  $mdToast.show($mdToast.simple().content("fingerprint " + $scope.fingerprintData.fingerprint[0].fingerprintName + " and targeting info updated").position("top right").hideDelay(2700));
                }
              })();
            } else {
              $scope.toggleWizardLoader.showLoader = false;
              $mdToast.show($mdToast.simple().content(statusMessage).position("top right").hideDelay(2700));
            }
          }, function (error) {
            $scope.toggleWizardLoader.showLoader = false;
            $mdToast.show($mdToast.simple().content("error saving Fingerprint transaction please try again").position("top right").hideDelay(2700));
          });
        });
      }
    }; // cause function ending

    /**
    *  Beacon fingerprint transaction get updated
    *
    */

    $scope.updateFingerprintBeaconTransaction = function (fID) {
      var timeNow = moment().format("YYYY-MM-DD hh:mm:ss");
      var beaconUpdateData = $scope.fingerprintBeaconAddresses.selected;
      var storeUpdateData = $scope.fingerprintStoreAddresses.selected;
      var merchantFingerprintBeaconId = locker.driver("session").namespace("fingerprintCreate").get("activeFingerprintBeaconTransactionId");
      var updateBeacon = {
        MerchantFingerprintBeaconsId: merchantFingerprintBeaconId,
        FingerprintId: fID,
        StoreId: storeUpdateData.storeId,
        BeaconUUID: beaconUpdateData.beaconUUID,
        BeaconId: beaconUpdateData.beaconId,
        Latitude: storeUpdateData.storeLatitude,
        Longitude: storeUpdateData.storeLongitude,
        ZipCode: storeUpdateData.storeZipCode,
        Date: timeNow,
        StreetAddress: storeUpdateData.storeStreetAddress,
        State: storeUpdateData.storeState,
        City: storeUpdateData.storeCity,
        Country: storeUpdateData.storeCountry,
        MerchantToken: merchantToken
      };

      Fingerprint.beaconUpdate(updateBeacon).then(function (response) {
        var statusCode = response.FlikResponse.Status.StatusCode;
        var statusMessage = response.FlikResponse.Status.StatusMessage;
        if (statusCode == 0) {
          (function () {
            var beaconTransactionAll = $rootScope.allData.fingerprints.beaconTransactions.list;
            var beaconUpdatedData = {
              merchantFingerprintId: fID,
              merchantFingerprintBeaconId: merchantFingerprintBeaconId,
              storeId: $scope.fingerprintStoreAddresses.selected.storeId,
              beaconUUID: beaconUpdateData.beaconUUID,
              beaconId: beaconUpdateData.beaconId,
              latitude: storeUpdateData.storeLatitude,
              longitude: storeUpdateData.storeLongitude,
              zipCode: storeUpdateData.storeZipCode,
              date: timeNow,
              streetAddress: storeUpdateData.storeStreetAddress,
              state: storeUpdateData.storeState,
              city: storeUpdateData.storeCity,
              country: storeUpdateData.storeCountry
            };
            angular.forEach(beaconTransactionAll, function (beaconInfo, index) {
              if (merchantFingerprintBeaconId == beaconInfo.merchantFingerprintBeaconId) {
                $rootScope.allData.fingerprints.beaconTransactions.list[index] = beaconUpdatedData;
              }
            });
            $scope.updateFingerprintTransaction(fID);
          })();
        }
      });
    }; // beacon function end
  }; //main function ending
}]);
//# sourceMappingURL=core.fingerprint.update.js.map