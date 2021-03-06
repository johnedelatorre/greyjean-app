"use strict";

app.filter("propsFilter", function() {
  return function(items, props) {
    let out = [];

    if (angular.isArray(items)) {
      items.forEach(function(item) {
        let itemMatches = false;

        let keys = Object.keys(props);
        for (let i = 0; i < keys.length; i++) {
          let prop = keys[i];
          let text = props[prop].toLowerCase();
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
})

app.controller("CoreOfferUpdateCtrl", ["$scope", "$rootScope", "$state", "$stateParams", "$filter",  "Offer",  "locker", "$mdToast", "$mdDialog", "$timeout","Product",
  function(                             $scope,   $rootScope,   $state,   $stateParams,   $filter,    Offer,    locker,   $mdToast,   $mdDialog,   $timeout,Product) {

    $scope.allData = $rootScope.allData;
      $scope.allProductCategories = {};
      $scope.allProductBrands = {};
      $scope.allProductNames = {};
      var start = 0;
      var limit = 30;
      var productCategory = '';
      var productBrand = '';
      var paginationCategoryVariable = 1;
      var paginationBrandVariable = 1;
      var paginationNameVariable = 1;
      var productCategorySearch = '';
      var productName = '';

    /**
     * get merchantMe and merchantToken from Locker
     *
     */
    let merchantMe = locker.driver("local").namespace("core").get("me");
    let merchantToken = locker.driver("local").namespace("core").get("merchantToken");

    /**
     * update our offer if offer already exists
     *
     * @return {object} updated offer
     */
    $scope.transactionMainFilter = {
        filter: {
            id: 1,
            productCat: {
                selected: {}
            },
            productBrand: {
                selected: {}
            },
            productName: {
                selected: {}
            },
            timeFrames: {
                selected: {}
            },
            offerAmount: {}
            //logicOperator  : "AND",
            //logicPurchased : "NOTBOUGHT",
            //logicTransaction : "GETS",
            //logicProductBuys : "ANY",
            //logicOfferType: "CREDIT"
        }
  };


  let productName        = Object.keys($scope.transactionMainFilter.filter.productName.selected).length > 0 ?
    $scope.transactionMainFilter.filter.productName.selected.productName : "ALL";
let productPrice       = Object.keys($scope.transactionMainFilter.filter.productName.selected).length > 0 ?
    $scope.transactionMainFilter.filter.productName.selected.price : 5;
let productId          = Object.keys($scope.transactionMainFilter.filter.productName.selected).length > 0 ?
    $scope.transactionMainFilter.filter.productName.selected.productId : 3;


Product.ProductCategoryPaginateAllData(start,limit,productCategorySearch,merchantToken).then(function() {
        $scope.allProductCategories = Product.getProductCategoryPaginateAllData();
    });
      Product.ProductBrandPaginateAllData(start,limit,productCategory,productBrand,merchantToken).then(function() {
          $scope.allProductBrands = Product.getProductBrandPaginateAllData();
      });
      Product.ProductNamePaginateAllData(start,limit,productCategory,productName,productBrand,merchantToken).then(function() {
          $scope.allProductNames = Product.getProductNamePaginateAllData();
      });

      $scope.addMoreProductCategoryItems = function() {
          var start = limit*paginationCategoryVariable;

          Product.ProductCategoryPaginateAllData(start,limit,productCategorySearch,merchantToken).then(function() {
              $scope.allProductCategories = $scope.allProductCategories.concat(Product.getProductCategoryPaginateAllData());

          });
          paginationCategoryVariable = paginationCategoryVariable+1;
      }
      $scope.addMoreProductBrandItems = function() {
          console.log("in scroll");
          var start = limit*paginationBrandVariable;

          Product.ProductBrandPaginateAllData(start,limit,productCategory,productBrand,merchantToken).then(function() {
              $scope.allProductBrand = $scope.allProductBrand.concat(Product.getProductBrandPaginateAllData());

          });
          paginationBrandVariable = paginationBrandVariable+1;
      }


      $scope.addMoreProductNameItems = function() {
          console.log("in scroll");
          var start = limit*paginationNameVariable;
          if($scope.productName != '' && $scope.productName != undefined) {
              productName = $scope.productName;
          } else if($scope.productName == undefined) {
              productName = '';
          }
          if($scope.productBrand == undefined) {
              $scope.productBrand = '';
          }
          if($scope.productCategory != '' && $scope.productCategory != undefined) {
              var productCategory = $scope.productCategory;
          } else if ($scope.productCategory == undefined) {
              productCategory = '';

          }
          Product.ProductNamePaginateAllData(start,limit,productCategory,productName,productBrand,merchantToken).then(function() {
              $scope.allProductNames= $scope.allProductNames.concat(Product.getProductNamePaginateAllData());

          });
          paginationNameVariable = paginationNameVariable+1;
      }
      //$scope.ProductBrandsWithCategories = function(productCategory) {
      //    console.log("in ng change");
      //    paginationVariable = 0;
      //    var start = limit*paginationVariable;
      //
      //    Product.ProductBrandPaginateAllData(start,limit,productCategory,merchantToken).then(function() {
      //        $scope.allProductBrands= $scope.allProductBrands.concat(Product.getProductBrandPaginateAllData());
      //        if($scope.allProductBrands.length == 0) {
      //            $scope.ProductNamesWithCategories(productCategory,productBrand);
      //        }
      //
      //    });
      //    paginationVariable = paginationVariable+1;
      //}

      $scope.ProductNamesWithCategories = function(productCategory) {
          var start = 0;
          $scope.productCategory = productCategory;
          Product.ProductNamePaginateAllData(start,limit,productCategory,productBrand,merchantToken).then(function() {
              $scope.allProductNames= Product.getProductNamePaginateAllData();
          });

      }

      $scope.refreshProductName = productName => {
          var startLimitForRefreshName = 0;
          var endLimitForRefreshName = 30;
          var productCategory = '';
          var productBrand = '';
          Product.ProductNamePaginateAllData(startLimitForRefreshName,endLimitForRefreshName,productCategory,productName,productBrand,merchantToken).then(function() {
              $scope.allProductNames = Product.getProductNamePaginateAllData();
              $scope.productName = productName;
              paginationNameVariable = 1;
          });
      };

      $scope.refreshProductCategory = productCategorySearch => {
          var startLimitForRefreshCategory = 0;
          var endLimitForRefreshCategory = 30;
          Product.ProductCategoryPaginateAllData(startLimitForRefreshCategory,endLimitForRefreshCategory,productCategorySearch,merchantToken).then(function() {
              $scope.allProductCategories = Product.getProductCategoryPaginateAllData();
              paginationCategoryVariable = 1;

          });
      };

    $scope.updateOffer = goNext => {
      $scope.toggleWizardLoader.showLoader = true;
      let oName           = $scope.offerData.offer[0].offerName;
      let timeNow         = moment().format("YYYY-MM-DD hh:mm:ss");
      let oStartDate      = moment($scope.offerStartDate).format("YYYY-MM-DD");
      let oEndDate        = moment($scope.offerEndDate).format("YYYY-MM-DD");
      let merchantId      = merchantMe.merchantId;
      let offerAmount     = "100";
      /**
       * this is what we send to the API to update offer if already saved
       * from create screen.
       *
       * @offer  {Object}
       */
      let offer = {
            OfferName        : $scope.offerData.offer[0].offerName,
            //OfferId          : currentOfferId,
          OfferId:           $scope.offerData.offer[0].offerId,
            BrandName        :"All",
            BrandId          : 0,
           ProductName      : $scope.transactionMainFilter.filter.productName.selected.productName,
          //ProductName: productName,
            ProductPrice     : $scope.transactionMainFilter.filter.productName.selected.price,
            ProductId        : $scope.transactionMainFilter.filter.productName.selected.productId,
            Amount           : offerAmount,
            ZipCode          : "10011",
            OfferType        : "All",
            OfferDescription : "All",
            DateStart        : oStartDate,
            DateEnd          : oEndDate,
            MerchantId       : merchantMe.merchantId,
            MerchantToken    : merchantToken
          };
      console.info(merchantMe);

      Offer.update(offer).then(response => {
        let statusCode    = response.FlikResponse.Status.StatusCode;
        let statusMessage = response.FlikResponse.Status.StatusMessage;
        if (statusCode == 0) {
          let timeNow = moment().format("YYYY-MM-DD hh:mm:ss");
          let oID     = response.FlikResponse.Data.MerchantOfferUpdate.MerchantOfferId;

          locker.driver("session").namespace("fingerprintCreate")
            .put("activeOfferId", oID);
          if (goNext) {
            $scope.updateOfferLocation(oID, true);
          } else {
            $scope.updateOfferLocation(oID);
          }
        } else if (statusCode == 1 && statusMessage == "Offer name must be unique") {
          $scope.toggleWizardLoader.showLoader = false;
          $mdToast.show(
            $mdToast.simple()
              .content("Cannot Update Offer " + oName + " Please try from the view/edit screen")
              .position("top right")
              .hideDelay(2700)
          );
        } else if (statusCode == 3) {
          /**
           * if we reach here merchantToken is no longer valid
           * we boot user back to signin
           *
           * TODO:   =>   add modal to reauth without back to signin page
           */
          console.warn("and the status is " + statusCode);
          console.warn(JSON.stringify(response, null, 4)+" token not valid - need to login again");
          locker.driver("local")
            .namespace("core")
            .forget("merchantToken");
          $state.go("access.signin");
          console.info("bye -- see you soon");
        } else {
          $mdToast.show(
            $mdToast.simple()
              .content("Cannot Update Offer " + oName + " Please try from the view/edit screen")
              .position("top right")
              .hideDelay(2700)
          );
        }
      }, error => {
        $scope.toggleWizardLoader.showLoader = false;
        $mdToast.show(
          $mdToast.simple()
            .content("Error updating " + oName)
            .position("top right")
            .hideDelay(2700)
        );
      });
    }

    /**
     * update offer location
     *
     * @offerId  {number}  passed from $scope.updateOffer()
     * @return  {object}  updated offer in success response from API or fail
     */
    $scope.updateOfferLocation = (offerId, goNext) => {
      /**
       * param passed to function
       * @oID {string} offerId from API on $scope.saveOffer()
       */
      let oID               = offerId;
      let oLocationID       = locker.driver("session").namespace("offerCreate").get("activeOfferLocationId");
      let oLocationUUID     = locker.driver("session").namespace("offerCreate").get("activeOfferLocationUUID");
      let thisOfferLocation = locker.driver("local").namespace("offerLocations").get(oLocationUUID);
      let timeNow           = moment().format("YYYY-MM-DD hh:mm:ss");
      /**
       * this is what we send to the API to update offer if already saved
       * from create screen.
       *
       * @offerLocation  {Object}
       */
      let offerLocation = {
            MerchantOfferId            : oID,
            MerchantFingerprintOfferId : oLocationID,
            Latitude                   : offerLocationLat.toString(),
            Longitude                  : offerLocationLng.toString(),
            ZipCode                    : "86336",
            Date                       : "2015-12-06 00:00:00.0",
            StreetAddress              : "1302 McCollum St, Los Angeles",
            City                       : "Los Angeles",
            State                      : "CA",
            Country                    : "United States",
            MerchantId                 : merchantMe.merchantId,
            MerchantToken              : merchantToken
          };

      Offer.updateLocation(offerLocation).then(response => {
        let statusCode = response.FlikResponse.Status.StatusCode;
        let statusMessage = response.FlikResponse.Status.StatusMessage;
        if (statusCode == 0) {
          let timeNow = moment().format("YYYY-MM-DD hh:mm:ss");
          oLocationID = response.FlikResponse.Data.OfferLocationUpdate.OfferLocationId;
          console.info( JSON.stringify(oID, null, 4));

          $scope.toggleWizardLoader.showLoader = false;
          $mdToast.show(
            $mdToast.simple()
              .content("offer " + $scope.offerName + " and locations updated")
              .position("top right")
              .hideDelay(2700)
          );
          if (goNext) {
            $state.go('core.home.campaign');
          }
          locker.driver("session")
            .namespace("offerCreate")
            .put("activeOfferLocationId", oLocationID);
          console.info("saved offer location with ID " + oLocationID);
        } else if (statusCode == 3) {
          /**
           * if we reach here merchantToken is no longer valid
           * we boot user back to signin
           *
           * TODO: add modal to reauth without back to signin page
           */
          locker.driver("local")
            .namespace("core")
            .forget("merchantToken");
          $state.go("access.signin");
          console.group("and the status is " + statusCode);
          console.warn( JSON.stringify(response, null, 4) + " token not valid - need to login again" );
          console.info("bye -- see you soon");
          console.groupEnd();
        } else {
          $scope.toggleWizardLoader.showLoader = false;
          $mdToast.show(
            $mdToast.simple()
              .content(statusMessage)
              .position("top right")
              .hideDelay(2700)
          );
          console.warn(statusMessage+" this is the status message");
        }
      }, error => {
        $scope.toggleWizardLoader.showLoader = false;
        $mdToast.show(
          $mdToast.simple()
            .content("error updating Offer location please try again")
            .position("top right")
            .hideDelay(2700)
        );
        console.warn("this is an error from the API " + JSON.stringify(error, null, 4));
      });
    }
  }]);
