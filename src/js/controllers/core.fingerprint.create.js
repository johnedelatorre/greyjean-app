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

app.controller("CoreFingerprintCreateCtrl", ["$scope", "$rootScope",  "locker",  "Fingerprint", "$http", "$filter", "$state", "$stateParams", "$mdToast", "$timeout","Cause","Store","Product",
  function(                                   $scope,   $rootScope,    locker,    Fingerprint,   $http,  $filter,   $state,   $stateParams,   $mdToast,   $timeout, Cause, Store, Product) {

    $scope.allData = $rootScope.allData;
    //$scope.causes = $scope.allData.causes.list;
      $scope.causes = {};
      $scope.stores = {};
      $scope.allProductCategories = {};
      $scope.allProductBrands = {};
      $scope.allProductNames = {};
      $scope.productCategory = '';
      $scope.productName = '';
      var start = 0;
      var limit = 30;
      var productCategory = '';
      var productBrand = '';
      var paginationVariable = 1;
      var paginationCategoryVariable = 1;
      var paginationBrandVariable = 1;
      var paginationNameVariable = 1;
      var productName = '';
      var productCategorySearch = '';
      var productBrandSearch = '';

      $scope.cList =
      {
          filter: {
              productCat: {
                  selected: {}
              }
          }
      }

    /**
     * get merchantMe and merchantToken from Locker
     *
     */

    let merchantMe = locker.driver("local").namespace("core").get("me");
    let merchantToken = locker.driver("local").namespace("core").get("merchantToken");

      Cause.CauseAllData(merchantToken).then(function() {
          $scope.causes = Cause.getCauseAllData();
      });
      Store.StoreAllData(merchantToken).then(function() {
          $scope.stores = Store.getStoreAllData();
      });
      Product.ProductCategoryPaginateAllData(start,limit,productCategory,merchantToken).then(function() {
          $scope.allProductCategories = Product.getProductCategoryPaginateAllData();
      });
      Product.ProductBrandPaginateAllData(start,limit,productCategory,productBrand,merchantToken).then(function() {
          $scope.allProductBrands = Product.getProductBrandPaginateAllData();

      });

      Product.ProductNamePaginateAllData(start,limit,productCategory,productName,productBrand,merchantToken).then(function() {
          $scope.allProductNames = Product.getProductNamePaginateAllData();
      });

    if (!$stateParams.id) {
      locker.namespace("fingerprintCreate")
        .bind($scope, "fingerprintName");
      $scope.fingerprintName = "";
      locker.namespace("fingerprintCreate")
        .bind($scope, "rangeIncome.minIncome");
      locker.namespace("fingerprintCreate")
        .bind($scope, "rangeIncome.maxIncome");
      $scope.rangeIncome = {
        minIncome: 1,
        maxIncome: 1000000
      };
      locker.namespace("fingerprintCreate")
        .bind($scope, "rangeAge.minAge");
      locker.namespace("fingerprintCreate")
        .bind($scope, "rangeAge.maxAge");
      $scope.rangeAge = {
        minAge: 16,
        maxAge: 60
      };
      locker.namespace("fingerprintCreate")
        .bind($scope, "gender.filter");
      $scope.gender = {
        filter: "BOTH"
      }
    }
    /**
     * limits fingerprintName to a-z 0-9 and spaces only
     *
     * @type {RegExp}
     */
    $scope.wordsOnly = /^[a-zA-Z0-9 ]*$/;

    $scope.currencyFormatting = value => {
      return"$"+value.toString();
    }

    $scope.toggleWizardLoader = {
      showLoader: false
    }

    $scope.rangeAge = {
      minAge: 18,
      maxAge: 60
    };

    $scope.rangeIncome = {
      minIncome: 20000,
      maxIncome: 150000
    };

    // $scope.dateTimeNow = function() {
    //     $scope.date = new Date();
    //   };
    // $scope.dateTimeNow();

    $scope.toggleMinDate = function() {
      $scope.minDate = $scope.minDate ? null : new Date();
    };
      $scope.addMoreProductCategoryItems = function() {

          var start = limit*paginationCategoryVariable;

          Product.ProductCategoryPaginateAllData(start,limit,productCategory,merchantToken).then(function() {
              $scope.allProductCategories = $scope.allProductCategories.concat(Product.getProductCategoryPaginateAllData());

          });

          paginationCategoryVariable = paginationCategoryVariable+1;

      }
      $scope.addMoreProductBrandItems = function() {

          var start = limit*paginationBrandVariable;
                productCategory = $scope.productCategory

          Product.ProductBrandPaginateAllData(start,limit,productCategory,productBrand,merchantToken).then(function() {
              $scope.allProductBrands = $scope.allProductBrands.concat(Product.getProductBrandPaginateAllData());

          });
          paginationBrandVariable = paginationBrandVariable+1;
      }

      $scope.addMoreProductNameItems = function() {

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
             }else if(productCategory == undefined ) {
                 productCategory = '';
             }
                 Product.ProductNamePaginateAllData(start, limit, productCategory,productName, productBrand, merchantToken).then(function () {
                     var products = Product.getProductNamePaginateAllData();
                     if(products == []) {
                         $scope.productName = '';
                         productName = '';
                         $scope.productCategory = '';
                         productCategory = '';

                     }
                     $scope.allProductNames = $scope.allProductNames.concat(Product.getProductNamePaginateAllData());

                 });
          //if($scope.productName != '' && $scope.productName != undefined && $scope.allProductNames == {}) {
          //    console.log(" in $scope");
          //    console.log($scope.productName);
          //    $scope.productName = '';
          //    productName = '';
          //}
          //if($scope.productCategory != '' && $scope.productCategory != undefined && $scope.allProductNames == {}) {
          //    $scope.productCategory = '';
          //    productCategory = ''
          //}

          paginationNameVariable = paginationNameVariable + 1;
      }

//$scope.productNameDelete = function() {
//    cList.filter.productCat.selected = {};
//    console.log(" hello ------------------------");
//}
      $scope.ProductNamesWithCategories = function(productCategory) {
          var start = 0;
           $scope.productCategory = productCategory;
          Product.ProductNamePaginateAllData(start,limit,productCategory,productName,productBrand,merchantToken).then(function() {
              $scope.allProductNames= Product.getProductNamePaginateAllData();
          });

      }

    $scope.maxDate = new Date('2014-06-22');
    $scope.toggleMinDate();

    $scope.dateOptions = {
      startingDay: 1,
      showWeeks: false
    };

    // Disable weekend selection
    // $scope.disabled = function(calendarDate, mode) {
    //   return mode === 'day' && ( calendarDate.getDay() === 0 || calendarDate.getDay() === 6 );
    // };

    $scope.hourStep = 1;
    $scope.minuteStep = 5;

    $scope.timeOptions = {
      hourStep: [1, 2, 3],
      minuteStep: [1, 5, 10, 15, 25, 30]
    };

    $scope.showMeridian = true;
    $scope.timeToggleMode = function() {
      $scope.showMeridian = !$scope.showMeridian;
    };

    $scope.resetHours = function() {
      $scope.date.setHours(1);
    };

    /**
     * use _. get unique product categories
     *
     * @uniqProductCats  {array}  $scope.productList array filtered for unique key
     */
    $scope.uniqProductCats   = $filter('unique')($scope.productsList, 'ProductCategory');
    $scope.uniqProductTypes  = $filter('unique')($scope.productsList, 'ProductType');
    $scope.uniqProductBrands = $filter('unique')($scope.productsList, 'BrandName');

    $scope.productsList = [
      {
        ProductId                  : 1,
        ProductName                : "Chcken",
        ProductDescription         : "Chicken",
        ProductPrice               : 23334333,
        BrandName                  : "TGIF",
        BrandId                    : 45,
        Product_SKU_Number         : 324343543,
        ProductType                : "Chicken",
        ProductTypeDescription     : "Chicken",
        ProductCategory            : "Chicken",
        ProductCategoryDescription : "Chicken",
        ProductQuantity            : 12,
        FinalSalePrice             : 13.79
      }
    ];

      /**
       * radius
       *
       */
      $scope.radius =[
          {radius:"1"},
          {radius:"5"},
          {radius:"10"},
          {radius:"15"},
          {radius:"20"}
      ];

      $scope.campaignRadius = {};


      if (!$stateParams.id) {
      locker.namespace("fingerprintCreate")
          .bind($scope, "radius.selected");
      $scope.radius.selected = {};
      $scope.radius.selected = {radius:"10"};

      }


    /**
     * transaction history filters jamz
     *
     */
    $scope.transactionFilter = {
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
          selected: new Date()
        },
        logicOperator  : "AND",
        logicPurchased : "NOTBOUGHT",
        logicProduct : "NAME"
      }
    }

    $scope.stransactionFilter = {
      sfilter: {
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
          selected: new Date()
        },
        logicOperator  : "AND",
        logicPurchased : "NOTLIKE",
        logicProduct : "NAME"
      }
    }

    $scope.ctransactionFilter = {
      cfilter: {
        id: 1,
        causeName: {
          selected: {}
        },
        timeFrames: {
          selected: new Date()
        },
        logicOperator  : "AND",
        logicPurchased : "NOTBOUGHT",
        logicProduct : "NAME"
      }
    }

    let tFilter = $scope.transactionFilter;
    let sFilter = $scope.stransactionFilter;
    let cFilter = $scope.ctransactionFilter;

    locker.namespace("fingerprintCreate")
      .bind($scope, "conBuysLists");
    $scope.conBuysLists = [tFilter];

    locker.namespace("fingerprintCreate")
      .bind($scope, "conBuysSocialLists");
    $scope.conBuysSocialLists = [sFilter];

    locker.namespace("fingerprintCreate")
      .bind($scope, "conBuysCauseLists");
    $scope.conBuysCauseLists = [cFilter];

    $scope.createConBuyList = () => {
      let filterId = $scope.conBuysLists.length + 1;
      if ($scope.conBuysLists.length < 5) {
        $scope.conBuysLists.push({
          filter: {
            id: filterId,
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
              selected: new Date()
            },
            logicOperator  : "AND",
            logicPurchased : "NOTBOUGHT",
            logicProduct : "NAME"
          }
        });
      } else {
        $mdToast.show(
          $mdToast.simple()
            .content("maximum 5 transaction filters allowed")
            .position("top right")
            .hideDelay(2700)
        );
      }
    }

    /**
     * social filter list
     */

    $scope.createConBuySocialList = () => {
      let filterId = $scope.conBuysSocialLists.length + 1;
      if ($scope.conBuysSocialLists.length < 5) {
        $scope.conBuysSocialLists.push({
          sfilter: {
            id: filterId,
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
              selected: new Date()
            },
            logicOperator  : "AND",
            logicPurchased : "NOTLIKE",
            logicProduct : "NAME"
          }
        });
      } else {
        $mdToast.show(
          $mdToast.simple()
            .content("maximum 5 transaction filters allowed")
            .position("top right")
            .hideDelay(2700)
        );
      }
    }

    /**
     * Cause filter
     */

    $scope.createConBuyCauseList = () => {
      let filterId = $scope.conBuysCauseLists.length + 1;
      if ($scope.conBuysCauseLists.length < 5) {
        $scope.conBuysCauseLists.push({
          cfilter: {
            id: filterId,
            causeName: {
              selected: {}
            },
            timeFrames: {
              selected: new Date()
            },
            logicOperator  : "AND",
            logicPurchased : "NOTBOUGHT",
            logicProduct : "NAME"
          }
        });
      } else {
        $mdToast.show(
          $mdToast.simple()
            .content("maximum 5 transaction filters allowed")
            .position("top right")
            .hideDelay(2700)
        );
      }
    }

    $scope.trashConBuySocialList = index => {
      $scope.conBuysSocialLists.splice(index, 1);
    }

    $scope.trashConBuyCauseList = index => {
      $scope.conBuysCauseLists.splice(index, 1);
    }

    $scope.trashConBuyList = index => {
      $scope.conBuysLists.splice(index, 1);
    }

    $scope.fingerprintLocationAddresses = {};
    $scope.fingerprintStoreAddresses = {};
    $scope.fingerprintBeaconAddresses = {};

    if (!$stateParams.id) {
      locker.namespace("fingerprintCreate")
        .bind($scope, "fingerprintLocationAddresses.selected");
      $scope.fingerprintLocationAddresses.selected = {};
    }
    if (!$stateParams.id) {
      locker.namespace("fingerprintCreate")
          .bind($scope, "fingerprintStoreAddresses.selected");
      $scope.fingerprintStoreAddresses.selected = {};
    }

    if (!$stateParams.id) {
      locker.namespace("fingerprintCreate")
          .bind($scope, "fingerprintBeaconAddresses.selected");
      $scope.fingerprintBeaconAddresses.selected = {};
    }

    $scope.address = {};
    $scope.refreshAddresses = address => {
      let params = {address: address, sensor: false};
      return $http.get(
        'http://maps.googleapis.com/maps/api/geocode/json',
        {params: params}
      ).then(response => {
        let originalAddresses = response.data.results;
        if(response.data.results.length > 0){
          $scope.addressFormate(originalAddresses);
        }
      });
    };

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
$scope.refreshProductBrand = productBrandSearch => {
    var startLimitForRefreshBrand = 0;
    var endLimitForRefreshBrand = 30;
    Product.ProductBrandPaginateAllData(startLimitForRefreshBrand,endLimitForRefreshBrand,productCategory,productBrandSearch,merchantToken).then(function() {
        $scope.allProductBrands = Product.getProductBrandPaginateAllData();
        paginationBrandVariable = 1;

    });
};


    var temp_zip = " ";
    $scope.addressFormate = function(address){
      let sepratedAdress = address[0].formatted_address.split(',');
      let city ;
      let state;
      let country;
      let street;
      var addlen = sepratedAdress.length;
      country = sepratedAdress[addlen - 1];
      var tempcountry = angular.lowercase(country);
      tempcountry = tempcountry.trim();
      if (angular.equals(tempcountry,'france') || angular.equals(tempcountry,'germany')){
        state = "";
        if (addlen == 3){
          street = sepratedAdress[0];
          city = sepratedAdress[1];
        }
        else if(addlen == 2){
            street = "";
          city = sepratedAdress[0];
        }
      }else if(addlen == 4){
        street = sepratedAdress[0];
        city = sepratedAdress[1];
        state = sepratedAdress[2];
          if(state.replace(/\D/g,'')!= "") {
              temp_zip = state.replace(/\D/g, '');
          }
          temp_zip = '12345';
      }else if(addlen == 3){
        street ="";
        city = sepratedAdress[0];
        state = sepratedAdress[1];
          if(state.replace(/\D/g,'')!= "") {
              temp_zip = state.replace(/\D/g, '');
          }
          temp_zip = '12345';
      }else if(addlen == 2){
	    street = "";
        city   = "";
        state = sepratedAdress[0];
          if(state.replace(/\D/g,'')!= "") {
              temp_zip = state.replace(/\D/g, '');
          }
          temp_zip = '12345';
      }else {
        street = "";
        city   = "";
        state  = "";
        temp_zip = "";
      }
      if (angular.equals(tempcountry,'usa') ){
          state = state.replace(/[0-9]/g, '');
      }
      if (temp_zip.length != 5){
            temp_zip = "";
      }
        let addressData = {
        formatted_address : address[0].formatted_address,
        latitude          : address[0].geometry.location.lat.toString(),
        longitude         : address[0].geometry.location.lng.toString(),
        street            : street,
        city              : city,
        state             : state,
        country           : country
      };
      $scope.addresses = [];
      $scope.addresses.push(addressData);
    };
    $scope.clearFingerprintForm = () => {
      $scope.fingerprintName = "";
      $scope.gender = {
        filter: "BOTH"
      }
      $scope.rangeAge = {
        minAge: 18,
        maxAge: 60
      };
      $scope.rangeIncome = {
        minIncome: 0,
        maxIncome: 1000000
      };
      $scope.fingerprintLocationAddresses.selected = {};
      $scope.conBuysLists = [
        {
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
              selected: new Date()
            },
            logicOperator  : "AND",
            logicPurchased : "NOTBOUGHT",
            logicProduct : "NAME"
          }
        }
      ];
      $scope.conBuysSocialLists = [
        {
          sfilter: {
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
              selected: new Date()
            },
            logicOperator  : "AND",
            logicPurchased : "NOTLIKE",
            logicProduct : "NAME"
          }
        }
      ];
      $scope.conBuysCauseLists = [
        {
          cfilter: {
            id: 1,
            causeName: {
              selected: {}
            },
            timeFrames: {
              selected: new Date()
            },
            logicOperator  : "AND",
            logicPurchased : "NOTBOUGHT",
            logicProduct : "NAME"
          }
        }
      ];
    }

    /**
     * save our fingerprint
     * and continue to create offer
     */
    $scope.saveFingerprintNextStep = () => {
      let goToOffer = true;
      $scope.saveFingerprint(goToOffer);
    }

    /**
     * save our fingerprint to API
     *
     * @return {object} saved fingerprint
     */
    $scope.saveFingerprint = goNext => {
      $scope.toggleWizardLoader.showLoader = true;
      let fName = $scope.fingerprintName;

      if (!fName) {
        $scope.toggleWizardLoader.showLoader = false;
        $mdToast.show(
          $mdToast.simple()
            .content("Please enter a Fingerprint name")
            .position("top right")
            .hideDelay(2700)
        );
        return;
      }

      let timeNow = moment().format("YYYY-MM-DD hh:mm:ss");

      /**
       * this is what we send to the API to save fingerprint
       * from create screen.
       *
       * @fingerprint  {Object}
       */

      let fingerprint = {
            FingerprintName : fName,
            Gender          : $scope.gender.filter,
            MinAge          : $scope.rangeAge.minAge,
            MaxAge          : $scope.rangeAge.maxAge,
            MinIncome       : $scope.rangeIncome.minIncome,
            MaxIncome       : $scope.rangeIncome.maxIncome,
            Radius          : $scope.radius.selected.radius,
            MerchantToken   : merchantToken
          };

      Fingerprint.create(fingerprint).then(response => {
        let statusCode    = response.FlikResponse.Status.StatusCode;
        let statusMessage = response.FlikResponse.Status.StatusMessage;

        if (statusCode == 0) {
          let timeNow   = moment().format("YYYY-MM-DD hh:mm:ss");
          let fID       = response.FlikResponse.Data.FingerPrint.FingerPrintId;
          let goToOffer = true;

          $rootScope.allData.fingerprints.list.push({
            fingerprintId   : fID,
            fingerprintName : fName,
            gender          : $scope.gender.filter,
            minAge          : $scope.rangeAge.minAge,
            maxAge          : $scope.rangeAge.maxAge,
            minIncome       : $scope.rangeIncome.minIncome,
            maxIncome       : $scope.rangeIncome.maxIncome,
            radius          : $scope.radius.selected.radius
          });
          $rootScope.allData.fingerprints.count = $rootScope.allData.fingerprints.list.length;
          locker.driver("session")
            .namespace("fingerprintCreate")
            .put("activeFingerprintId", fID);
          console.info("saved fingerprint " + fName + " with ID " + fID);
          if (goNext) {
            $scope.saveFingerprintLocation(fID, goNext);
          } else {
            $scope.saveFingerprintLocation(fID);
          }
        } else if (statusCode == 1 && statusMessage == "Fingerprint name must be unique") {
          $scope.toggleWizardLoader.showLoader = false;
          $mdToast.show(
            $mdToast.simple()
              .content(statusMessage)
              .position("top right")
              .hideDelay(2700)
          );
        } else if (statusCode == 3) {
          $state.go("access.signin");
          console.group("and the status is " + statusCode);
          console.warn( response + " token not valid - need to login again" );
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
            .content("error saving Fingerprint " + fName + " please try again")
            .position("top right")
            .hideDelay(2700)
        );
        console.warn(" this is an error from the API");
      });

    /**
     * save fingerprint location
     *
     * @fingerprintId  {int}  passed from $scope.saveFingerprint()
     * @return  {object}  save fingerprint success or fail
     */
    $scope.saveFingerprintLocation = (fID, goNext) => {
      let timeNow            = moment().format("YYYY-MM-DD hh:mm:ss");
      let fullLocation       = $scope.fingerprintLocationAddresses.selected;
      let shouldSaveLocation = Object.keys(fullLocation).length > 0;

      if (!shouldSaveLocation) {
        console.log(`no locations to save`);
        if (goNext) {
          //$scope.saveFingerprintTransactions(fID, goNext);
          $scope.saveStore(fID,goNext);
        } else {
          //$scope.saveFingerprintTransactions(fID);
          $scope.saveStore(fID);
        }
      } else {
        /**
         * this is what we send to the API to update offer if already saved
         * from create screen.
         *
         * @fingerprintLocation  {Object}
         */
        let fingerprintLocation = {
              MerchantFingerprintId : fID,
              Latitude              : fullLocation.latitude,
              Longitude             : fullLocation.longitude,
              ZipCode               : temp_zip,
              Date                  : timeNow,
              StreetAddress         : fullLocation.street,
              City                  : fullLocation.city,
              State                 : fullLocation.state,
              Country               : fullLocation.country,
              MerchantToken         : merchantToken
            };
        Fingerprint.createLocation(fingerprintLocation).then(response => {
          let statusCode = response.FlikResponse.Status.StatusCode;
          let statusMessage = response.FlikResponse.Status.StatusMessage;
          if (statusCode == 0) {
            let timeNow = moment().format("YYYY-MM-DD hh:mm:ss");
            let fLocationID = response.FlikResponse.Data.MerchantFingerprintLocation.FingerprintLocationId;
            console.info( JSON.stringify(fID, null, 4));

            locker.driver("session")
              .namespace("fingerprintCreate")
              .put("activeFingerprintLocationId", fLocationID);
            console.info("saved fingerprint Location with ID " + fLocationID);
            $rootScope.allData.fingerprints.locations.list.push({
              merchantFingerprintId         : fID,
              merchantFingerprintLocationId : fLocationID,
              latitude                      : fullLocation.latitude,
              longitude                     : fullLocation.longitude,
              zipCode                       : temp_zip,
              date                          : timeNow,
              streetAddress                 : fullLocation.street,
              city                          : fullLocation.city,
              state                         : fullLocation.state,
              country                       : fullLocation.country,
              formattedAddress              : fullLocation.formatted_address
            });
            $rootScope.allData.fingerprints.locations.count = $rootScope.allData.fingerprints.locations.list.length;
            if (goNext) {
             // $scope.saveFingerprintTransactions(fID, goNext);
              $scope.saveStore(fID,goNext);
            } else {
             // $scope.saveFingerprintTransactions(fID);
              $scope.saveStore(fID);
            }
          } else if (statusCode == 1) {
            $scope.toggleWizardLoader.showLoader = false;
            $mdToast.show(
              $mdToast.simple()
                .content(statusMessage)
                .position("top right")
                .hideDelay(2700)
            );
          } else if (statusCode == 3) {
            /**
             * if we reach here merchantToken is no longer valid
             * we boot user back to signin
             *
             * TODO: add modal to reauth without back to signin page
             */
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
              .content("there was an error saving Fingerprint location please try again " + error)
              .position("top right")
              .hideDelay(2700)
          );
          console.warn("this is a API error from fingerprint save location");
        });
      }
    }

    /**
     * save fingerprint transactions
     *
     * @offerId  {number}  passed from $scope.saveOffer()
     * @return  {object}  save offer success or fail
     */
    $scope.saveFingerprintTransactions = (fID, goNext) => {
      let timeNow                 = moment().format("YYYY-MM-DD hh:mm:ss");
      let fingerprintTransactions = $scope.conBuysLists;
      let shouldSaveTransaction   = Object.keys(fingerprintTransactions[0].filter.productCat.selected).length > 0 ? true : false;

      if (!shouldSaveTransaction) {
        console.log(`no transactions to save`);
        if (goNext) {
          $scope.saveSocialHistoryTransactions(fID, goNext);
        } else {
          
          $scope.saveSocialHistoryTransactions(fID);
        }
      }else{
        fingerprintTransactions.forEachCat(fFilter => {
          $timeout(() => {
            let fingerprintTransaction = {
              MerchantFingerprintId      : fID,
              TransactionDate            : moment(fFilter.filter.timeFrames.selected).format("YYYY-MM-DD hh:mm:ss"),
              ProductId                  : Object.keys(fFilter.filter.productName.selected).length > 0 ? fFilter.filter.productName.selected.productId : 3,
              ProductName                : Object.keys(fFilter.filter.productName.selected).length > 0 ? fFilter.filter.productName.selected.productName : "ALL",
              ProductQuantity            : 7,
              ProductDescription         : Object.keys(fFilter.filter.productName.selected).length > 0 ? fFilter.filter.productName.selected.productDescription : "ALL",
              ProductPrice               : Object.keys(fFilter.filter.productName.selected).length > 0 ? fFilter.filter.productName.selected.price : 9,
              FinalSalePrice             : 7,
              BrandName                  : Object.keys(fFilter.filter.productBrand.selected).length > 0 ? fFilter.filter.productBrand.selected.brandName : "ALL",
              BrandId                    : Object.keys(fFilter.filter.productBrand.selected).length > 0 ? fFilter.filter.productBrand.selected.brandId : 3,
              Product_SKU_Number         : Object.keys(fFilter.filter.productName.selected).length > 0 ? fFilter.filter.productName.selected.product_SKU_Number : 777,
              ProductType                : Object.keys(fFilter.filter.productName.selected).length > 0 ? fFilter.filter.productName.selected.productType : "ALL",
              //ProductTypeDescription     : Object.keys(fFilter.filter.productName.selected).length > 0 ? fFilter.filter.productName.selected.productTypeDescription : "ALL",
                ProductTypeDescription     : "ALL",

                ProductCategory            : Object.keys(fFilter.filter.productCat.selected).length > 0 ? fFilter.filter.productCat.selected.productCategory : "ALL",
              //ProductCategoryDescription : Object.keys(fFilter.filter.productCat.selected).length > 0 ? fFilter.filter.productCat.selected.productCategoryDescription : "ALL",
                ProductCategoryDescription : "ALL",

                LogicalOperator            : fFilter.filter.logicOperator,
              BuyNotBuy                  : fFilter.filter.logicPurchased,
              MerchantToken              : merchantToken
            };
            Fingerprint.createTransaction(fingerprintTransaction).then(response => {
              let statusCode = response.FlikResponse.Status.StatusCode;
              let statusMessage = response.FlikResponse.Status.StatusMessage;
              if (statusCode == 0) {
                let timeNow = moment().format("YYYY-MM-DD hh:mm:ss");
                let fTransactionID = response.FlikResponse.Data.MerchantFingerprintTransactionId[0];
                console.info( JSON.stringify(fTransactionID, null, 4));
                $rootScope.allData.fingerprints.transactions.list.push({
                  merchantFingerprintId            : fID,
                  merchantFingerprintTransactionId : fTransactionID,
                  transactionDate                  : moment(fFilter.filter.timeFrames.selected).format("YYYY-MM-DD hh:mm:ss"),
                  productId                        : Object.keys(fFilter.filter.productName.selected).length > 0 ? fFilter.filter.productName.selected.productId : 3,
                  productName                      : Object.keys(fFilter.filter.productName.selected).length > 0 ? fFilter.filter.productName.selected.productName : "ALL",
                  productQuantity                  : 7,
                  productDescription               : Object.keys(fFilter.filter.productName.selected).length > 0 ? fFilter.filter.productName.selected.productDescription : "ALL",
                  productPrice                     : Object.keys(fFilter.filter.productName.selected).length > 0 ? fFilter.filter.productName.selected.price : 9,
                  finalSalePrice                   : 7,
                  brandName                        : Object.keys(fFilter.filter.productBrand.selected).length > 0 ? fFilter.filter.productBrand.selected.brandName : "ALL",
                  brandId                          : Object.keys(fFilter.filter.productBrand.selected).length > 0 ? fFilter.filter.productBrand.selected.brandId : 3,
                  product_SKU_Number               : Object.keys(fFilter.filter.productName.selected).length > 0 ? fFilter.filter.productName.selected.product_SKU_Number : 777,
                  productType                      : Object.keys(fFilter.filter.productName.selected).length > 0 ? fFilter.filter.productName.selected.productType : "ALL",
                  productTypeDescription           : Object.keys(fFilter.filter.productName.selected).length > 0 ? fFilter.filter.productName.selected.productTypeDescription : "ALL",
                  productCategory                  : Object.keys(fFilter.filter.productCat.selected).length > 0 ? fFilter.filter.productCat.selected.productCategory : "ALL",
                  productCategoryDescription       : Object.keys(fFilter.filter.productCat.selected).length > 0 ? fFilter.filter.productCat.selected.productCategoryDescription : "ALL",
                  logicalOperator                  : fFilter.filter.logicOperator,
                  buyNotBuy                        : fFilter.filter.logicPurchased
                });
                $rootScope.allData.fingerprints.transactions.count = $rootScope.allData.fingerprints.transactions.list.length;
                if (fFilter.filter.id === fingerprintTransactions.length) {
                  if (goNext) {
                    $scope.saveSocialHistoryTransactions(fID, goNext);
                  } else {
                    $scope.saveSocialHistoryTransactions(fID);
                  }
                }
              } else if (statusCode == 3) {
                /**
                 * if we reach here merchantToken is no longer valid
                 * we boot user back to signin
                 *
                 * TODO: add modal to reauth without back to signin page
                 */
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
                  .content("error saving Fingerprint transaction please try again")
                  .position("top right")
                  .hideDelay(2700)
              );
              console.warn("this is an error from the API " + JSON.stringify(error, null, 4));
            });
          }, 1200);
        });
      }
    }

    $scope.saveSocialHistoryTransactions = (fID, goNext) =>{
      let timeNow                       = moment().format("YYYY-MM-DD hh:mm:ss");
      let fingerprintSocialTransactions = $scope.conBuysSocialLists;
      let shouldSaveSocialTransaction   = Object.keys(fingerprintSocialTransactions[0].sfilter.productCat.selected).length > 0 ? true:false;;

      if (!shouldSaveSocialTransaction) {
        console.log(`no social transactions to save`);
        if (goNext) {
          $scope.saveCauseHistoryTransactions(fID, goNext);
        } else {
          $scope.saveCauseHistoryTransactions(fID);
        }
      } else { 
        fingerprintSocialTransactions.forEachCat(sFilter => {
          $timeout(() => {
            console.info(`this is the sFilter from loop ${JSON.stringify(sFilter, null, 4)} and canz haz id ${sFilter.sfilter.id}`);
            console.warn(`can haz logic prurchase ${sFilter.sfilter.logicPurchased}
            can haz logic ${sFilter.sfilter.logicOperator}`);

            let fingerprintSocialTransaction = {
              MerchantFingerprintId      : fID,
              Date                       : moment(sFilter.sfilter.timeFrames.selected).format("YYYY-MM-DD hh:mm:ss"),
              ProductName                : Object.keys(sFilter.sfilter.productName.selected).length > 0 ? sFilter.sfilter.productName.selected.productName : "ALL",
              BrandName                  : Object.keys(sFilter.sfilter.productBrand.selected).length > 0 ? sFilter.sfilter.productBrand.selected.brandName : "ALL",
              ProductType                : Object.keys(sFilter.sfilter.productName.selected).length > 0 ? sFilter.sfilter.productName.selected.productType : "ALL",
              ProductCategory            : Object.keys(sFilter.sfilter.productCat.selected).length > 0 ? sFilter.sfilter.productCat.selected.productCategory : "ALL",
              LogicalOperator            : sFilter.sfilter.logicOperator,
              LikeNotLike                : sFilter.sfilter.logicPurchased,
              MerchantToken              : merchantToken
            };

            Fingerprint.saveSocialHistory(fingerprintSocialTransaction).then(response =>{
              let statusCode = response.FlikResponse.Status.StatusCode;
              let statusMessage = response.FlikResponse.Status.StatusMessage;
              if(statusCode == 0){
                let sTransactionID = response.FlikResponse.Data.MerchantFingerprintProductNew.MerchantFingerprintProductId;

                $rootScope.allData.fingerprints.socialTransactions.list.push({
                  merchantFingerprintId        : fID,
                  merchantFingerprintProductId : sTransactionID,
                  date                         : moment(sFilter.sfilter.timeFrames.selected).format("YYYY-MM-DD hh:mm:ss"),
                  productName                  : Object.keys(sFilter.sfilter.productName.selected).length > 0 ? sFilter.sfilter.productName.selected.productName : "ALL",
                  brandName                    : Object.keys(sFilter.sfilter.productBrand.selected).length > 0 ? sFilter.sfilter.productBrand.selected.brandName : "ALL",
                  productType                  : Object.keys(sFilter.sfilter.productName.selected).length > 0 ? sFilter.sfilter.productName.selected.productType : "ALL",
                  productCategory              : Object.keys(sFilter.sfilter.productCat.selected).length > 0 ? sFilter.sfilter.productCat.selected.productCategory : "ALL",
                  logicalOperator              : sFilter.sfilter.logicOperator,
                  likeNotLike                  : sFilter.sfilter.logicPurchased
                });
                $rootScope.allData.fingerprints.socialTransactions.count = $rootScope.allData.fingerprints.socialTransactions.list.length;
                if (sFilter.sfilter.id === fingerprintSocialTransactions.length){
                  locker.driver("session")
                    .namespace("fingerprintCreate")
                    .put("activeFingerprintSocialTransactionId", sTransactionID);
                  if (goNext) {
                    $scope.saveCauseHistoryTransactions(fID, goNext);
                  } else {
                    $scope.saveCauseHistoryTransactions(fID);
                  }
                }
              } else if (statusCode == 3) {
                /**
                 * if we reach here merchantToken is no longer valid
                 * we boot user back to signin
                 *
                 * TODO: add modal to reauth without back to signin page
                 */
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
              }
            }, error =>{
              $scope.toggleWizardLoader.showLoader = false;
              $mdToast.show(
                $mdToast.simple()
                  .content("error saving Fingerprint transaction please try again")
                  .position("top right")
                  .hideDelay(2700)
              );
            });
          },1200);
        });
      }
    }

    $scope.saveCauseHistoryTransactions = (fID, goNext) =>{
      let timeNow                      = moment().format("YYYY-MM-DD hh:mm:ss");
      let fingerprintCauseTransactions = $scope.conBuysCauseLists;
      let shouldSaveCauseTransaction   = Object.keys(fingerprintCauseTransactions[0].cfilter.causeName.selected).length > 0 ? true:false;

      if (!shouldSaveCauseTransaction) {
        console.log(`no cause transactions to save`);
        $scope.toggleWizardLoader.showLoader = false;
        $scope.clearFingerprintForm();
        $mdToast.show(
          $mdToast.simple()
            .content("Fingerprint " + $scope.fingerprintName + " with all targeting Saved")
            .position("top right")
            .hideDelay(2700)
        );
        if (goNext) {
          $state.go('core.home.offer');
        }
      } else {
        fingerprintCauseTransactions.forEachCat(cFilter => {
          $timeout(() => {
            let fingerprintCauseTransaction = {
                  MerchantFingerprintId : fID,
                  Date                  : moment(cFilter.cfilter.timeFrames.selected).format("YYYY-MM-DD hh:mm:ss"),
                  CauseName             : cFilter.cfilter.causeName.selected.causeName,
                  LogicalOperator       : cFilter.cfilter.logicOperator,
                  LikeNotLike           : cFilter.cfilter.logicPurchased,
                  MerchantToken         : merchantToken
                };

            Fingerprint.saveCauseHistory(fingerprintCauseTransaction).then(response =>{
              let statusCode = response.FlikResponse.Status.StatusCode;
              let statusMessage = response.FlikResponse.Status.StatusMessage;
              if (statusCode == 0){
                let cTransactionID = response.FlikResponse.Data.MerchantFingerprintCauseNew.MerchantFingerprintCauseId;

                $rootScope.allData.fingerprints.causeTransactions.list.push({
                  merchantFingerprintId      : fID,
                  merchantFingerprintCauseId : cTransactionID,
                  date                       : moment(cFilter.cfilter.timeFrames.selected).format("YYYY-MM-DD hh:mm:ss"),
                  causeName                  : cFilter.cfilter.causeName.selected.causeName,
                  logicalOperator            : cFilter.cfilter.logicOperator,
                  likeNotLike                : cFilter.cfilter.logicPurchased
                });
                $rootScope.allData.fingerprints.causeTransactions.count = $rootScope.allData.fingerprints.causeTransactions.list.length;
                if (cFilter.cfilter.id === fingerprintCauseTransactions.length) {
                  $scope.toggleWizardLoader.showLoader = false;
                  $mdToast.show(
                    $mdToast.simple()
                      .content("Fingerprint saved")
                      .position("top right")
                      .hideDelay(2700)
                  );
                  locker.driver("session")
                    .namespace("fingerprintCreate")
                    .put("activeFingerprintCauseTransactionId", cTransactionID);
                  $scope.clearFingerprintForm();
                  if (goNext) {
                    $state.go('core.home.offer');
                  }
                }
              } else if (statusCode == 3) {
                /**
                 * if we reach here merchantToken is no longer valid
                 * we boot user back to signin
                 *
                 * TODO: add modal to reauth without back to signin page
                 */
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
              }
            }, error => {
              $scope.toggleWizardLoader.showLoader = false;
              $mdToast.show(
                $mdToast.simple()
                  .content("error saving Fingerprint transaction please try again")
                  .position("top right")
                  .hideDelay(2700)
              );
            });
          },1200);
        });
      }
    }

    $scope.saveStore = (fID, goNext) =>{
      let timeNow = moment().format("YYYY-MM-DD hh:mm:ss");
      let storeLocation       = $scope.fingerprintStoreAddresses.selected;
      let beacon              = $scope.fingerprintBeaconAddresses.selected;
      let shouldSaveStoreLocation = Object.keys(storeLocation).length > 0;
      let shouldSaveBeacon          = Object.keys(beacon).length > 0;

      if(!shouldSaveStoreLocation){
        if (goNext) {
          $scope.saveFingerprintTransactions(fID, goNext);
        } else {
          $scope.saveFingerprintTransactions(fID);
        }
      }else if(shouldSaveBeacon){
        if (goNext) {
          $scope.beaconSave(fID, goNext);
        } else {
          $scope.beaconSave(fID);
        }

      }else{
        let storeInfo = {
          MerchantFingerprintId : fID,
          StoreId               : $scope.fingerprintStoreAddresses.selected.storeId,
          Latitude              : $scope.fingerprintStoreAddresses.selected.storeLatitude,
          Longitude             : $scope.fingerprintStoreAddresses.selected.storeLongitude,
          ZipCode               : $scope.fingerprintStoreAddresses.selected.storeZipCode,
          Date                  : timeNow,
          StreetAddress         : $scope.fingerprintStoreAddresses.selected.storeStreetAddress,
          State                 : $scope.fingerprintStoreAddresses.selected.storeState,
          City                  : $scope.fingerprintStoreAddresses.selected.storeCity,
          Country               : $scope.fingerprintStoreAddresses.selected.storeCountry,
          MerchantToken         : merchantToken

        };

        Fingerprint.storeSave(storeInfo).then(response =>{
          let statusCode = response.FlikResponse.Status.StatusCode;
          let statusMessage = response.FlikResponse.Status.StatusMessage;
          if(statusCode == 0){
            let storeID = response.FlikResponse.Data.MerchantFingerprintStore.MerchantFingerprintStoreId;
            locker.driver("session")
              .namespace("fingerprintCreate")
              .put("activeFingerprintStoreTransactionId", storeID);
            $scope.selectedStoreId = $scope.fingerprintStoreAddresses.selected.storeId;
            $rootScope.allData.fingerprints.storeTransactions.list.push({
              merchantFingerprintId : fID,
              merchantFingerprintStoreId : storeID,
              storeId               : $scope.fingerprintStoreAddresses.selected.storeId,
              latitude              : $scope.fingerprintStoreAddresses.selected.storeLatitude,
              longitude             : $scope.fingerprintStoreAddresses.selected.storeLongitude,
              zipCode               : $scope.fingerprintStoreAddresses.selected.storeZipCode,
              date                  : timeNow,
              streetAddress         : $scope.fingerprintStoreAddresses.selected.storeStreetAddress,
              state                 : $scope.fingerprintStoreAddresses.selected.storeState,
              city                  : $scope.fingerprintStoreAddresses.selected.storeCity,
              country               : $scope.fingerprintStoreAddresses.selected.storeCountry
            });
            $rootScope.allData.fingerprints.storeTransactions.count = $rootScope.allData.fingerprints.storeTransactions.list.length;
            if (goNext) {
              $scope.saveFingerprintTransactions(fID, goNext);
            } else {
              $scope.saveFingerprintTransactions(fID);
            }

            //locker.driver("session")
            //   .namespace("fingerprintCreate")
            //  .put("activeFingerprintCauseTransactionId", cTransactionID);
          }else if(statusCode == 3){
            $state.go("access.signin");
          }else{
            $scope.toggleWizardLoader.showLoader = false;
            $mdToast.show(
              $mdToast.simple()
                  .content(statusMessage)
                  .position("top right")
                  .hideDelay(2700)
            );
          }

        },error =>{
          $scope.toggleWizardLoader.showLoader = false;
          $mdToast.show(
            $mdToast.simple()
                .content("error saving Fingerprint transaction please try again")
                .position("top right")
                .hideDelay(2700)
          );
        });
      }
    }

    $scope.beaconSave = (fID, goNext) =>{
      let timeNow = moment().format("YYYY-MM-DD hh:mm:ss");
      let beaconInfo = {
          MerchantFingerprintId : fID,
          StoreId               : $scope.fingerprintStoreAddresses.selected.storeId,
          BeaconUUID            : $scope.fingerprintBeaconAddresses.selected.beaconUUID,
          BeaconId              : $scope.fingerprintBeaconAddresses.selected.beaconId,
          Latitude              : $scope.fingerprintStoreAddresses.selected.storeLatitude,
          Longitude             : $scope.fingerprintStoreAddresses.selected.storeLongitude,
          ZipCode               : $scope.fingerprintStoreAddresses.selected.storeZipCode,
          Date                  : timeNow,
          StreetAddress         : $scope.fingerprintStoreAddresses.selected.storeStreetAddress,
          State                 : $scope.fingerprintStoreAddresses.selected.storeState,
          City                  : $scope.fingerprintStoreAddresses.selected.storeCity,
          Country               : $scope.fingerprintStoreAddresses.selected.storeCountry,
          MerchantToken         : merchantToken

      };
      Fingerprint.beaconSave(beaconInfo).then(response => {
        let statusCode = response.FlikResponse.Status.StatusCode;
        let statusMessage = response.FlikResponse.Status.StatusMessage;
        if(statusCode == 0){
          let beaconID = response.FlikResponse.Data.Beacons.MerchantFingerprintBeaconsId;
          locker.driver("session")
            .namespace("fingerprintCreate")
            .put("activeFingerprintBeaconTransactionId", beaconID);
          $rootScope.allData.fingerprints.beaconTransactions.list.push({
              merchantFingerprintId : fID,
              merchantFingerprintBeaconId              : beaconID,
              storeId               : $scope.fingerprintStoreAddresses.selected.storeId,
              beaconUUID            : $scope.fingerprintBeaconAddresses.selected.beaconUUID,
              beaconId              : $scope.fingerprintBeaconAddresses.selected.beaconId,
              latitude              : $scope.fingerprintStoreAddresses.selected.storeLatitude,
              longitude             : $scope.fingerprintStoreAddresses.selected.storeLongitude,
              zipCode               : $scope.fingerprintStoreAddresses.selected.storeZipCode,
              date                  : timeNow,
              streetAddress         : $scope.fingerprintStoreAddresses.selected.storeStreetAddress,
              state                 : $scope.fingerprintStoreAddresses.selected.storeState,
              city                  : $scope.fingerprintStoreAddresses.selected.storeCity,
              country               : $scope.fingerprintStoreAddresses.selected.storeCountry
          });
          let storeTransactionId = locker.driver("session")
            .namespace("fingerprintCreate")
            .get("activeFingerprintStoreTransactionId", beaconID);
          $rootScope.allData.fingerprints.storeTransactions.list.push({
            merchantFingerprintId : fID,
            merchantFingerprintStoreId : storeTransactionId,
            storeId               : $scope.fingerprintStoreAddresses.selected.storeId,
            latitude              : $scope.fingerprintStoreAddresses.selected.storeLatitude,
            longitude             : $scope.fingerprintStoreAddresses.selected.storeLongitude,
            zipCode               : $scope.fingerprintStoreAddresses.selected.storeZipCode,
            date                  : timeNow,
            streetAddress         : $scope.fingerprintStoreAddresses.selected.storeStreetAddress,
            state                 : $scope.fingerprintStoreAddresses.selected.storeState,
            city                  : $scope.fingerprintStoreAddresses.selected.storeCity,
            country               : $scope.fingerprintStoreAddresses.selected.storeCountry
          });
          $rootScope.allData.fingerprints.storeTransactions.count = $rootScope.allData.fingerprints.storeTransactions.list.length;
          $rootScope.allData.fingerprints.beaconTransactions.count = $rootScope.allData.fingerprints.beaconTransactions.list.length;

          if (goNext) {
            $scope.saveFingerprintTransactions(fID, goNext);
          } else {
            $scope.saveFingerprintTransactions(fID);
          }

            //locker.driver("session")
            //   .namespace("fingerprintCreate")
            //  .put("activeFingerprintCauseTransactionId", cTransactionID);
        }else if(statusCode == 3){
          $state.go("access.signin");
        }else{
          $scope.toggleWizardLoader.showLoader = false;
          $mdToast.show(
            $mdToast.simple()
                .content(statusMessage)
                .position("top right")
                .hideDelay(2700)
          );
        }

      },error =>{
        $scope.toggleWizardLoader.showLoader = false;
        $mdToast.show(
          $mdToast.simple()
              .content("error saving Fingerprint transaction please try again")
              .position("top right")
              .hideDelay(2700)
        );
      });
    }
  }
}]);
