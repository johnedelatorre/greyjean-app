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

app.controller("CoreOfferCreateCtrl", ["$scope", "$rootScope", "$state", "$stateParams", "$filter", "$http",  "Offer",  "locker", "$mdToast", "$mdDialog", "$timeout",  "$animate","Product",
  function(                             $scope,   $rootScope,   $state,   $stateParams,   $filter,   $http,    Offer,    locker,   $mdToast,   $mdDialog,   $timeout,    $animate,Product) {

    /**
     * get merchantMe allData and merchantToken from Locker
     *
     */
    $scope.allData = angular.copy($rootScope.allData);



    let merchantMe    = locker.driver("local").namespace("core").get("me");
    let merchantToken = locker.driver("local").namespace("core").get("merchantToken");
    let todayNow      = new Date();

      $scope.allProductCategories = {};
      $scope.allProductBrands = {};
      $scope.allProductNames = {};
      var start = 0;
      var limit = 30;
      var productCategory = '';
      var productBrand = '';
      var productName = '';
      var paginationVariable = 1;
      var paginationCategoriesVariable = 1;
      var paginationBrandsVariable = 1;
      var paginationNamesVariable = 1;
      var productCategorySearch = '';
      var productBrandSearch = '';

    locker.namespace("offerCreate")
      .bind($scope, "offerName");
    $scope.offerName = "";
    locker.namespace("offerCreate")
      .bind($scope, "offerAmount");
    $scope.offerAmount = 40;
    locker.namespace("offerCreate")
      .bind($scope, "offerZipcode");
    $scope.offerZipcode = 91604;
    locker.namespace("offerCreate")
      .bind($scope, "offerStartDate");
    $scope.offerStartDate = moment(todayNow).format("DD-MMMM-YYYY");
    locker.namespace("offerCreate")
      .bind($scope, "offerEndDate");
    $scope.offerEndDate     = moment($scope.offerStartDate).add(1, "months").format("DD-MMMM-YYYY");
    $scope.offerType = "";
    locker.namespace("offerCreate")
      .bind($scope, "offerDescription");
    $scope.offerDescription = "";
    $scope.initDate         = $scope.offerStartDate;
    $scope.minStartDate     = todayNow;
    $scope.maxStartDate     = moment($scope.offerEndDate).add(1, "years");
    $scope.minEndDate       = moment($scope.offerStartDate).add(1, "days");
    $scope.maxEndDate       = moment($scope.offerEndDate).add(6, "months");
    locker.namespace("offerCreate")
      .bind($scope, "offer");
    $scope.offer = {};
    locker.namespace("offerCreate")
      .bind($scope, "offerType");
    $scope.offerType = {};

    $scope.toggleWizardLoader = {
      showLoader: false
    }

    $scope.creditAmounts = [
      {amount: "1"},
      {amount: "2"},
      {amount: "3"},
      {amount: "4"},
      {amount: "5"}
    ]

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
        offerAmount: {},
        logicOperator  : "AND",
        logicPurchased : "NOTBOUGHT",
        logicTransaction : "GETS",
        logicProductBuys : "ANY",
        logicOfferType: "CREDIT"
      }
    }

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
          selected: {}
        },
        offerAmount: {},
        logicOperator  : "AND",
        logicPurchased : "NOTBOUGHT",
        logicTransaction : "GETS",
        logicProductBuys : "ANY",
        logicOfferType: "CREDIT"
      }
    }

    let tFilter = $scope.transactionFilter;

    $scope.conBuysLists = [tFilter];

      Product.ProductCategoryPaginateAllData(start,limit,productCategorySearch,merchantToken).then(function() {
          $scope.allProductCategories = Product.getProductCategoryPaginateAllData();
      });
      Product.ProductBrandPaginateAllData(start,limit,productCategory,productName,merchantToken).then(function() {
          $scope.allProductBrands = Product.getProductBrandPaginateAllData();
      });
      Product.ProductNamePaginateAllData(start,limit,productCategory,productBrand,merchantToken).then(function() {
          $scope.allProductNames = Product.getProductNamePaginateAllData();
      });

      $scope.addMoreProductCategoryItems = function() {
          var start = limit*paginationCategoriesVariable;
          Product.ProductCategoryPaginateAllData(start,limit,productCategorySearch,merchantToken).then(function() {
              $scope.allProductCategories = $scope.allProductCategories.concat(Product.getProductCategoryPaginateAllData());
          });
          paginationCategoriesVariable = paginationCategoriesVariable+1;
      }
      $scope.addMoreProductBrandItems = function() {
          var start = limit*paginationBrandsVariable;

          Product.ProductBrandPaginateAllData(start,limit,productCategory,productName,productBrand,merchantToken).then(function() {
              $scope.allProductBrands = $scope.allProductBrands.concat(Product.getProductBrandPaginateAllData());
          });
          paginationBrandsVariable = paginationBrandsVariable+1;
      }

      $scope.addMoreProductNameItems = function() {
          var start = limit*paginationNamesVariable;
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
          } else if($scope.productCategory == undefined) {
              productCategory = '';
          }
          Product.ProductNamePaginateAllData(start,limit,productCategory,productName,productBrand,merchantToken).then(function() {

              $scope.allProductNames= $scope.allProductNames.concat(Product.getProductNamePaginateAllData());

          });
          paginationNamesVariable = paginationNamesVariable+1;
      }

          $scope.ProductNamesWithCategories = function(productCategory) {
              var start = 0;
              $scope.productCategory = productCategory;
              Product.ProductNamePaginateAllData(start,limit,productCategory,productName,productBrand,merchantToken).then(function() {
                  $scope.allProductNames= Product.getProductNamePaginateAllData();
              });

          }
      //$scope.refreshProductName = productNameRefresh => {
      //    var startLimitForRefreshName = 0;
      //    var endLimitForRefreshName = 30;
      //    Product.ProductAllSearchedData(startLimitForRefreshName,endLimitForRefreshName,productNameRefresh,merchantToken).then(function() {
      //        $scope.allProductNames = Product.getProductAllSearchedData();
      //    });
      //};
      //$scope.refreshProductCategory = productCategoryRefresh => {
      //    var startLimitForRefreshCategory = 0;
      //    var endLimitForRefreshCategory = 30;
      //    Product.ProductAllSearchedData(startLimitForRefreshCategory,endLimitForRefreshCategory,productCategoryRefresh,merchantToken).then(function() {
      //        $scope.allProductCategories = Product.getProductAllSearchedData();
      //
      //    });
      //};

      $scope.refreshProductName = productName => {
          var startLimitForRefreshName = 0;
          var endLimitForRefreshName = 30;
          var productCategory = '';
          var productBrand = '';
          Product.ProductNamePaginateAllData(startLimitForRefreshName,endLimitForRefreshName,productCategory,productName,productBrand,merchantToken).then(function() {
              $scope.allProductNames = Product.getProductNamePaginateAllData();
              $scope.productName = productName;
              paginationNamesVariable = 1;
          });
      };

      $scope.refreshProductCategory = productCategorySearch => {
          var startLimitForRefreshCategory = 0;
          var endLimitForRefreshCategory = 30;
          Product.ProductCategoryPaginateAllData(startLimitForRefreshCategory,endLimitForRefreshCategory,productCategorySearch,merchantToken).then(function() {
              $scope.allProductCategories = Product.getProductCategoryPaginateAllData();
              paginationCategoriesVariable = 1;

          });
      };

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
            productFilterReceives: {
              selected: {}
            },
            timeFrames: {
              selected: {}
            },
            offerAmount: {},
            logicOperator  : "AND",
            logicTransaction : "GETS",
            logicPurchased : "NOTBOUGHT",
            logicProductBuys : "ANY",
            logicOfferType: "CREDIT"
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
      console.info("this are ze con lists" + JSON.stringify($scope.conBuysLists, null, 4));
    }

    $scope.trashConBuyList = index => {
      $scope.conBuysLists.splice(index, 1);
    }

    $scope.productsList = [
      {
        ProductId                  : 1,
        ProductName                : "Chicken",
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
     * use filter to get unique product lists based on unique key
     *
     * @uniqProductCats  {array}  $scope.productList array filtered for unique key
     */
    $scope.uniqProductCats   = $filter('unique')($scope.productsList, 'ProductCategory');
    $scope.uniqProductTypes  = $filter('unique')($scope.productsList, 'ProductType');
    $scope.uniqProductBrands = $filter('unique')($scope.productsList, 'BrandName');

    locker.namespace("offerCreate")
      .bind($scope, "productCategories.selected");
    $scope.productCategories = {};
    $scope.productCategories.selected = [];

    locker.namespace("offerCreate")
      .bind($scope, "productBrands.selected");
    $scope.productBrands = {};
    $scope.productBrands.selected = [];

    locker.namespace("offerCreate")
      .bind($scope, "productTypes.selected");
    $scope.productTypes = {};
    $scope.productTypes.selected = [];

    let oneDayAgo   = moment().subtract(1, "days").startOf("day").format("YYYY-MM-DD hh:mm:ss");
    let oneWeekAgo  = moment().subtract(1, "weeks").startOf("day").format("YYYY-MM-DD hh:mm:ss");
    let oneMonthAgo = moment().subtract(1, "months").startOf("day").format("YYYY-MM-DD hh:mm:ss");
    let oneYearAgo  = moment().subtract(1, "years").startOf("day").format("YYYY-MM-DD hh:mm:ss");

    $scope.timeFramesList = [
      {
        name: "1 Day",
        actualTime: oneDayAgo
      },
      {
        name: "1 Week",
        actualTime: oneWeekAgo
      },
      {
        name: "1 Month",
        actualTime: oneMonthAgo
      },
      {
        name: "1 Year",
        actualTime: oneYearAgo
      }
    ];

    console.info("time frames list " + JSON.stringify($scope.timeFramesList, null, 4));

    locker.namespace("offerCreate")
      .bind($scope, "timeFrames.selected");
    $scope.timeFrames = {};
    $scope.timeFrames.selected = [];

    /**
     * stub offers and offerTypes for now
     *
     */
    $scope.offers = [
      {
        Name             : "Coffee",
        Offer            : "MaxwellHouseGenderOffer",
        BrandName        : "MaxwellHouse",
        ProductId        : 1,
        ProductPrice     : 5,
        BrandId          : 1,
        OfferDescription : "wow alot wow can haz wow",
        OfferZipcode     : 91604
      },
      {
        Name             : "Cats",
        Offer            : "CatsOffer",
        BrandName        : "Cats",
        ProductId        : 2,
        ProductPrice     : 5,
        BrandId          : 2,
        OfferDescription : "wow alot wow can haz wow",
        OfferZipcode     : 91604
      },
      {
        Name             : "Snacks",
        Offer            : "SnacksOffer",
        BrandName        : "Snacks",
        ProductId        : 3,
        ProductPrice     : 5,
        BrandId          : 3,
        OfferDescription : "wow alot wow can haz wow",
        OfferZipcode     : 91604
      }
    ];

    $scope.offerTypes = [
      {
        Name      : "In Store",
        Type      : "Redeem",
        OfferCode : "catsunicorns777ohjoy"
      },
      {
        Name      : "Web",
        Type      : "Monthly",
        OfferCode : "catsunicorns777ohyep"
      },
      {
        Name      : "Kiosk",
        Type      : "Daily",
        OfferCode : "catsunicorns777ohmeow"
      }
    ];

    $scope.typeSwitches = {
      credit : false,
      gift   : false
    }

    $scope.offerAmount = 4;

    /**
    * clear offer date picker
    *
    **/
    $scope.clear = () => {
      $scope.offerStartDate = null;
    };

    $scope.openStartDateCalendar = $event => {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.calendarStartDateOpened = true;
    };

    $scope.openEndDateCalendar = $event => {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.calendarEndDateOpened = true;
    };

    $scope.offerDateOptions = {
      formatYear  : "yy",
      startingDay : 1,
      class       : "datepicker"
    };

    $scope.offerDateFormat = "dd-MMMM-yyyy";
    /**
    * these are regex for limiting
    * offerName and offerZipcode
    **/
    /**
     * limits offerName to a-z 0-9 and spaces only
     *
     * @type {RegExp}
     */
    $scope.wordsOnly = /^[a-zA-Z0-9 ]*$/;
    /**
     * only allows zipcode format
     * five numbers for offerZipcode
     *
     * @type {RegExp}
     */
    $scope.zipcodeOnly = /^(\d{5}(-\d{4})?|[A-Z]\d[A-Z] *\d[A-Z]\d)$/;
    /**
    * for offerAmount
    *
    **/
    $scope.val = 5;
    let updateModel = val => {
      $scope.$apply(() => {
          $scope.val = val;
      });
    };

    $scope.typeSwitches = {
      credit : false,
      gift   : false
    }

    $scope.currencyFormatting = value => {
      return "$" + value.toString();
    }

    $scope.offerLocationStatesList = [
      {"name": "Alabama"},
      {"name": "Alaska"},
      {"name": "Arizona"},
      {"name": "Arkansas"},
      {"name": "California"},
      {"name": "Colorado"},
      {"name": "Connecticut"},
      {"name": "Delaware"},
      {"name": "Florida"},
      {"name": "Georgia"},
      {"name": "Hawaii"},
      {"name": "Idaho"},
      {"name": "Illinois"},
      {"name": "Indiana"},
      {"name": "Iowa"},
      {"name": "Kansas"},
      {"name": "Kentucky"},
      {"name": "Louisiana"},
      {"name": "Maine"},
      {"name": "Maryland"},
      {"name": "Massachusetts"},
      {"name": "Michigan"},
      {"name": "Minnesota"},
      {"name": "Mississippi"},
      {"name": "Missouri"},
      {"name": "Montana"},
      {"name": "Nebraska"},
      {"name": "Nevada"},
      {"name": "New Hampshire"},
      {"name": "New Jersey"},
      {"name": "New Mexico"},
      {"name": "New York"},
      {"name": "North Dakota"},
      {"name": "North Carolina"},
      {"name": "Ohio"},
      {"name": "Oklahoma"},
      {"name": "Oregon"},
      {"name": "Pennsylvania"},
      {"name": "Rhode Island"},
      {"name": "South Carolina"},
      {"name": "South Dakota"},
      {"name": "Tennessee"},
      {"name": "Texas"},
      {"name": "Utah"},
      {"name": "Vermont"},
      {"name": "Virginia"},
      {"name": "Washington"},
      {"name": "West Virginia"},
      {"name": "Wisconsin"},
      {"name": "Wyoming"}
    ];

    locker.namespace("offerCreate")
      .bind($scope, "offerLocationStates.selectedStates");
    $scope.offerLocationStates = {};
    $scope.offerLocationStates.selectedStates = [];

    locker.namespace("offerCreate")
      .bind($scope, "offerLocationZipcodes");
    $scope.offerLocationZipcodes = [];

    if (!$stateParams.id) {
      locker.namespace("fingerprintCreate")
        .bind($scope, "offerLocationAddresses.selected");
      $scope.offerLocationAddresses.selected = {};
    }

    $scope.address = {};
    $scope.refreshAddresses = address => {
      let params = {address: address, sensor: false};
      return $http.get(
        'http://maps.googleapis.com/maps/api/geocode/json',
        {params: params}
      ).then(response => {
        $scope.addresses = response.data.results;
      });
    };

    /**
    * for back to fingerprint function
    *
    **/
    $scope.goBackToFingerprint = ev => {
      let confirm = $mdDialog.confirm()
        .title("Do you want to edit your last fingerprint?")
        .content("You can create a new fingerprint if you like.")
        .ariaLabel("Lucky day")
        .ok("Edit my last fingerprint")
        .cancel("Create a new fingerprint")
        .targetEvent(ev);
      $mdDialog.show(confirm).then(() => {
        $scope.editLastFingerprint = true;
        locker.driver("session")
          .namespace("offerCreate")
          .put("editLastFingerprint", $scope.editLastFingerprint);
        $state.go("core.home.fingerprint");
      }, () => {
        $scope.editLastFingerprint = false;
        locker.driver("session").namespace("offerCreate")
          .put("editLastFingerprint", $scope.editLastFingerprint);
        $state.go("core.home.fingerprint");
      });
    };

    $scope.clearOfferForm = () => {
    $scope.offerName = "";
    $scope.offerDescription = "";
    $scope.typeSwitches = {
        credit : false,
        gift   : false
      }
      $scope.offerAmount = 4;
      $scope.asyncSelected = "";
      $scope.offerLocationAddresses.selected = [];
      $scope.offerLocationFullAddresses = [];
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
              selected: {}
            },
            offerAmount: {},
            logicOperator  : "AND",
            logicPurchased : "NOTBOUGHT",
            logicTransaction : "GETS",
            logicProductBuys : "ANY",
            logicOfferType: "CREDIT"
          }
        }
      ];
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
          offerAmount: {},
          logicOperator  : "AND",
          logicPurchased : "NOTBOUGHT",
          logicTransaction : "GETS",
          logicProductBuys : "ANY",
          logicOfferType: "CREDIT"
        }
      };
    }

    /**
     * save our offer to DB on error save to Dexie and Locker
     * if name not unique then update offer instead
     *
     * @return {object} saved offer
     */
    $scope.saveOffer = goNext => {
      let oName = $scope.offerName;
      let hasMultipleTransactions = !isNaN($scope.conBuysLists[0].filter.offerAmount) ||
                                    Object.keys($scope.conBuysLists[0].filter.offerAmount).length > 0 ||
                                     $scope.conBuysLists[0].filter.logicTransaction == "BUYS" ? true : false;
      let hasOfferTransaction = !isNaN($scope.transactionMainFilter.filter.offerAmount) ||
                                Object.keys($scope.transactionMainFilter.filter.offerAmount).length > 0 ||
                                hasMultipleTransactions ? true : false;
      console.warn(`the offer transaction haz? ${hasOfferTransaction}
                    offer amount ${JSON.stringify($scope.transactionMainFilter.filter.offerAmount, null, 4)}`);
      console.warn(`multiplez haz? ${hasMultipleTransactions} the listaz ${JSON.stringify($scope.conBuysLists, null, 4)}`);
      $scope.toggleWizardLoader.showLoader = true;
      if (!oName) {
        $scope.toggleWizardLoader.showLoader = false;
        $mdToast.show(
          $mdToast.simple()
            .content("Please enter a Offer name")
            .position("top right")
            .hideDelay(2700)
        );
        return;
      }
      if (!hasOfferTransaction) {
        $scope.toggleWizardLoader.showLoader = false;
        $mdToast.show(
          $mdToast.simple()
            .content("Please Select Offer Amount")
            .position("top right")
            .hideDelay(2700)
        );
        return;
      }
      $scope.offerType = $scope.transactionMainFilter.filter.logicOfferType;
      if($scope.transactionMainFilter.filter.logicTransaction == 'BUYS'){
        angular.forEach($scope.conBuysLists, function(selectedOfferData, index){
          if(selectedOfferData.filter.logicTransaction == 'GETS'){
            $scope.getsAmount = selectedOfferData.filter.offerAmount.amount === undefined ? selectedOfferData.filter.offerAmount : selectedOfferData.filter.offerAmount.amount;
            $scope.offerType = selectedOfferData.filter.logicOfferType;
          }
        })
      }
      let shouldSaveLocation = Object.keys($scope.offerLocationAddresses.selected).length > 0 ? true : false;
      console.warn("should save location " + shouldSaveLocation);
      let timeNow            = moment().format("YYYY-MM-DD hh:mm:ss");
      let oStartDate         = moment($scope.offerStartDate).format("YYYY/MM/DD");
      let oEndDate           = moment($scope.offerEndDate).format("YYYY/MM/DD");
      let oID                = locker.driver("local").namespace("offers").count();
      let offerAmount        = isNaN($scope.transactionMainFilter.filter.offerAmount) ?
                               $scope.transactionMainFilter.filter.offerAmount.amount === undefined ?
                                $scope.getsAmount : $scope.transactionMainFilter.filter.offerAmount.amount :      $scope.transactionMainFilter.filter.offerAmount;
      let brandId            = Object.keys($scope.transactionMainFilter.filter.productBrand.selected).length > 0 ?
                               $scope.transactionMainFilter.filter.productBrand.selected.brandId : 3;
      let brandName          = Object.keys($scope.transactionMainFilter.filter.productBrand.selected).length > 0 ?
                               $scope.transactionMainFilter.filter.productBrand.selected.brandName : "ALL";
      let productName        = Object.keys($scope.transactionMainFilter.filter.productName.selected).length > 0 ?
                               $scope.transactionMainFilter.filter.productName.selected.productName : "ALL";
      let productPrice       = Object.keys($scope.transactionMainFilter.filter.productName.selected).length > 0 ?
                               $scope.transactionMainFilter.filter.productName.selected.price : 5;
      let productId          = Object.keys($scope.transactionMainFilter.filter.productName.selected).length > 0 ?
                               $scope.transactionMainFilter.filter.productName.selected.productId : 3;
      /**
       * this is what we send to the API to create offer
       *
       * @offer  {Object}
       */
      let offer = {
            OfferName        : $scope.offerName,
            BrandName        : brandName,
            BrandId          : brandId,
            ProductName      : productName,
            ProductPrice     : productPrice,
            ProductId        : productId,
            Amount           : offerAmount,
            ZipCode          : $scope.offers[0].OfferZipcode,
            OfferType        : $scope.offerType,
            OfferDescription : $scope.offerDescription,
            DateStart        : oStartDate,
            DateEnd          : oEndDate,
            MerchantToken    : merchantToken
          };
      Offer.create(offer).then(response => {
        let statusCode    = response.FlikResponse.Status.StatusCode;
        let statusMessage = response.FlikResponse.Status.StatusMessage;
        if (statusCode == 0) {
          let timeNow = moment().format("YYYY-MM-DD hh:mm:ss");
          let oID     = response.FlikResponse.Data.MerchantOffer.MerchantOfferId;
          console.info( JSON.stringify(oID, null, 4));
          locker.driver("session")
            .namespace("offerCreate")
            .put("activeOfferId", oID);
          $rootScope.allData.offers.list.push({
            offerId          : oID,
            offerName        : $scope.offerName,
            brandName        : brandName,
            brandId          : brandId,
            productName      : productName,
            productPrice     : productPrice,
            productId        : productId,
            amount           : offerAmount,
            zipCode          : $scope.offers[0].OfferZipcode,
            offerType        : $scope.offerType,
            offerDescription : $scope.offerDescription,
            dateStart        : oStartDate,
            dateEnd          : oEndDate
          });
          $rootScope.allData.offers.count = $rootScope.allData.offers.list.length;

          if (shouldSaveLocation && !hasMultipleTransactions) {
            if (goNext) {
              let goToCampaign = true;
              $scope.saveOfferLocation(hasMultipleTransactions, oID, goToCampaign);
            } else {
              $scope.saveOfferLocation(hasMultipleTransactions, oID);
            }
          } else if (shouldSaveLocation && hasMultipleTransactions) {
            if (goNext) {
              let goToCampaign = true;
              $scope.saveOfferLocation(hasMultipleTransactions, oID, goToCampaign);
            } else {
              $scope.saveOfferLocation(hasMultipleTransactions, oID);
            }
          } else if (!shouldSaveLocation && hasMultipleTransactions) {
            if (goNext) {
              let goToCampaign = true;
              $scope.saveOfferTransactions(oID, goToCampaign);
            } else {
              $scope.saveOfferTransactions(oID);
            }
          } else {
            $scope.toggleWizardLoader.showLoader = false;
            $mdToast.show(
              $mdToast.simple()
                .content("offer " + $scope.offerName + " Saved")
                .position("top right")
                .hideDelay(2700)
            );
            $scope.clearOfferForm();
            if (goNext) {
              $state.go('core.home.campaign');
            }
          }
        } else if (statusCode == 1 && statusMessage == "Offer name already exists") {
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
          console.warn("and the status is " + statusCode);
          console.warn( response + " token not valid - need to login again" );
          locker.driver("local")
            .namespace("core")
            .forget("merchantToken");
          $state.go("access.signin");
          console.info("bye -- see you soon");
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
      }, function(error) {
          $scope.toggleWizardLoader.showLoader = false;
          $mdToast.show(
            $mdToast.simple()
              .content("error saving Offer " + oName + " please try again")
              .position("top right")
              .hideDelay(2700)
          );
          console.warn(" this is an error from the API");
      });
    }

    /**
     * save offer location
     *
     * @offerId  {number}  passed from $scope.saveOffer()
     * @return  {object}  save offer success or fail
     */
    $scope.saveOfferLocation = (shouldSaveTransaction, offerId, goNext) => {
      /**
       * param passed to function
       *
       * @oID {string} offerId from API on $scope.saveOffer()
       */
      let oID                  = offerId;
      let timeNow              = moment().format("YYYY-MM-DD hh:mm:ss");
      let offerLocationLat     = $scope.offerLocationAddresses.selected.geometry.location.lat.toString();
      let offerLocationLng     = $scope.offerLocationAddresses.selected.geometry.location.lng.toString();
      let offerLocationAddress = $scope.offerLocationAddresses.selected.formatted_address;

      /**
       * this is what we send to the API to update offer if already saved
       * from create screen.
       *
       * @fingerprint  {Object}
       */
      let offerLocation = {
            MerchantOfferId : oID,
            Latitude        : offerLocationLat,
            Longitude       : offerLocationLng,
            ZipCode         : "86336",
            Date            : timeNow,
            StreetAddress   : offerLocationAddress,
            City            : "Brooklyn",
            State           : "NY",
            Country         : "United States",
            MerchantToken   : merchantToken
          };
      Offer.createLocation(offerLocation).then(response => {
        let statusCode = response.FlikResponse.Status.StatusCode;
        let statusMessage = response.FlikResponse.Status.StatusMessage;
        if (statusCode == 0) {
          let timeNow = moment().format("YYYY-MM-DD hh:mm:ss");
          let oLocationID = response.FlikResponse.Data.MerchantOfferLocation.OfferLocationId;
          console.info( JSON.stringify(oID, null, 4));

          locker.driver("session")
            .namespace("offerCreate")
            .put("activeOfferLocationId", oLocationID);
          console.info("saved offer Location with ID " + oLocationID);

          $rootScope.allData.offers.locations.list.push({
            merchantOfferId : oID,
            offerLocationId : oLocationID,
            latitude        : offerLocationLat,
            longitude       : offerLocationLng,
            zipCode         : "86336",
            date            : timeNow,
            streetAddress   : offerLocationAddress,
            city            : "Brooklyn",
            state           : "NY",
            country         : "United States"
          });
          $rootScope.allData.offers.locations.count = $rootScope.allData.offers.locations.list.length;
          if (shouldSaveTransaction) {
            if (goNext) {
              $scope.saveOfferTransactions(oID, goNext);
            } else {
              $scope.saveOfferTransactions(oID);
            }
          } else {
            $scope.toggleWizardLoader.showLoader = false;
            $mdToast.show(
              $mdToast.simple()
                .content("offer " + $scope.offerName + " and locations Saved")
                .position("top right")
                .hideDelay(2700)
            );
            $scope.clearOfferForm();
            if (goNext) {
              $state.go('core.home.campaign');
            }
          }
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
              .content("error saving Offer location please try again")
              .position("top right")
              .hideDelay(2700)
          );
          console.warn("this is an error from the API " + JSON.stringify(error, null, 4));
      });
    }

    /**
     * save offer transactions
     *
     * @offerId  {number}  passed from $scope.saveOffer()
     * @return  {object}  save offer success or fail
     */
    $scope.saveOfferTransactions = (offerId, goNext) => {
      /**
       * param passed to function
       *
       * @oID {string} offerId from API on $scope.saveOffer()
       */
      let oID                  = offerId;
      let timeNow              = moment().format("YYYY-MM-DD hh:mm:ss");
      let offerTransactions    = $scope.conBuysLists;
      console.warn(JSON.stringify(offerTransactions, null, 4));

      offerTransactions.forEachCat(oFilter => {
        $timeout(() => {
          console.info(`this is the oFilter from loop ${JSON.stringify(oFilter, null, 4)} and id is ${oFilter.filter.id}`);
          let offerTransaction = {
                MerchantOfferId            : oID,
                BuyNotBuy                  : oFilter.filter.logicTransaction,
                LogicalOperator            : oFilter.filter.logicOperator,
                TransactionDate            : timeNow,
                ProductId                  : Object.keys(oFilter.filter.productName.selected).length > 0 ? oFilter.filter.productName.selected.productId : 1,
                ProductName                : Object.keys(oFilter.filter.productName.selected).length > 0 ? oFilter.filter.productName.selected.productName : "ALL",
                ProductQuantity            : 3,
                ProductDescription         : Object.keys(oFilter.filter.productName.selected).length > 0 ? oFilter.filter.productName.selected.productDescription : "ALL",
                ProductPrice               : Object.keys(oFilter.filter.productName.selected).length > 0 ? oFilter.filter.productName.selected.price : 43,
                // FinalSalePrice             : Object.keys(oFilter.filter.productName.selected).length > 0 ? oFilter.filter.productName.selected.finalSalePrice : 41,
                FinalSalePrice             : 41,
                BrandName                  : Object.keys(oFilter.filter.productBrand.selected).length > 0 ? oFilter.filter.productBrand.selected.brandName : "ALL",
                Product_SKU_Number         : Object.keys(oFilter.filter.productName.selected).length > 0 ? oFilter.filter.productName.selected.product_SKU_Number : 777,
                BrandId                    : Object.keys(oFilter.filter.productBrand.selected).length > 0 ? oFilter.filter.productBrand.selected.brandId : 7,
                ProductType                : Object.keys(oFilter.filter.productBrand.selected).length > 0 ? oFilter.filter.productBrand.selected.productType : "ALL",
                ProductTypeDescription     : Object.keys(oFilter.filter.productName.selected).length > 0 ? oFilter.filter.productName.selected.productTypeDescription : "ALL",
                ProductCategory            : Object.keys(oFilter.filter.productCat.selected).length > 0 ? oFilter.filter.productCat.selected.productCategory : "ALL",
                ProductCategoryDescription : Object.keys(oFilter.filter.productCat.selected).length > 0 ? oFilter.filter.productCat.selected.productCategoryDescription : "ALL",
                Amount                     : isNaN($scope.transactionMainFilter.filter.offerAmount) ?
                                             $scope.transactionMainFilter.filter.offerAmount.amount === undefined ?
                                             $scope.getsAmount : $scope.transactionMainFilter.filter.offerAmount.amount : $scope.transactionMainFilter.filter.offerAmount,
                MerchantToken              : merchantToken
              };
          Offer.createTransaction(offerTransaction).then(response => {
            let statusCode    = response.FlikResponse.Status.StatusCode;
            let statusMessage = response.FlikResponse.Status.StatusMessage;

            if (statusCode == 0) {
              let timeNow        = moment().format("YYYY-MM-DD hh:mm:ss");
              let oTransactionID = response.FlikResponse.Data.MerchantOfferTransactionId[0];

              $rootScope.allData.offers.transactions.list.push({
                merchantOfferId            : oID,
                merchantOfferTransactionId : oTransactionID,
                buyNotBuy                  : oFilter.filter.logicTransaction,
                logicalOperator            : oFilter.filter.logicOperator,
                transactionDate            : timeNow,
                productId                  : Object.keys(oFilter.filter.productName.selected).length > 0 ? oFilter.filter.productName.selected.productId : 1,
                productName                : Object.keys(oFilter.filter.productName.selected).length > 0 ? oFilter.filter.productName.selected.productName : "ALL",
                productQuantity            : 3,
                productDescription         : Object.keys(oFilter.filter.productName.selected).length > 0 ? oFilter.filter.productName.selected.productDescription : "ALL",
                productPrice               : Object.keys(oFilter.filter.productName.selected).length > 0 ? oFilter.filter.productName.selected.price : 43,
                finalSalePrice             : 41,
                brandName                  : Object.keys(oFilter.filter.productBrand.selected).length > 0 ? oFilter.filter.productBrand.selected.brandName : "ALL",
                product_SKU_Number         : Object.keys(oFilter.filter.productName.selected).length > 0 ? oFilter.filter.productName.selected.product_SKU_Number : 777,
                brandId                    : Object.keys(oFilter.filter.productBrand.selected).length > 0 ? oFilter.filter.productBrand.selected.brandId : 7,
                productType                : Object.keys(oFilter.filter.productBrand.selected).length > 0 ? oFilter.filter.productBrand.selected.productType : "ALL",
                productTypeDescription     : Object.keys(oFilter.filter.productName.selected).length > 0 ? oFilter.filter.productName.selected.productTypeDescription : "ALL",
                productCategory            : Object.keys(oFilter.filter.productCat.selected).length > 0 ? oFilter.filter.productCat.selected.productCategory : "ALL",
                productCategoryDescription : Object.keys(oFilter.filter.productCat.selected).length > 0 ? oFilter.filter.productCat.selected.productCategoryDescription : "ALL",
                amount                     : isNaN($scope.transactionMainFilter.filter.offerAmount) ?
                                             $scope.transactionMainFilter.filter.offerAmount.amount === undefined ?
                                             3 : $scope.transactionMainFilter.filter.offerAmount.amount : $scope.transactionMainFilter.filter.offerAmount
              });
              $rootScope.allData.offers.transactions.count = $rootScope.allData.offers.transactions.list.length;
              if (oFilter.filter.id === offerTransactions.length) {
                $scope.toggleWizardLoader.showLoader = false;
                $mdToast.show(
                  $mdToast.simple()
                    .content("offer " + $scope.offerName + " and redemtion filters saved")
                    .position("top right")
                    .hideDelay(2700)
                );
                $scope.clearOfferForm();
                if (goNext) {
                  $state.go('core.home.campaign');
                }
              }
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
                  .content("error saving Offer transaction please try again")
                  .position("top right")
                  .hideDelay(2700)
              );
              console.warn("this is an error from the API " + JSON.stringify(error, null, 4));
          });
        }, 1200);
      });
    }

    /**
    * save offer next step
    * go to create campaign route
    *
    **/
    $scope.saveOfferNextStep = () => {
      $scope.saveOffer(true);
      // $state.go("core.home.campaign");
    };
    /**
     * filterTime for wating filterByCategory call after 1 second so prodductCat.selected get upadted in that time
     *
     */
    $scope.filterTime = (isWhat) =>{
      if(isWhat === "category"){
        $timeout( function(){ $scope.filterByProductCategory(); }, 1000);
      }else{
        $timeout( function(){ $scope.filterByProductBrand(); }, 1000);
      }

     };

    $scope.filterByProductCategory = () =>{
      let productBrands = [];
      let selectedCategory = $scope.transactionMainFilter.filter.productCat.selected;
      let productBrand     = $rootScope.allData.products.list;
      angular.forEach(productBrand,function(product,index){
        if(product.productCategory === selectedCategory.productCategory){
          productBrands.push(product);
        }

        $scope.allData.products.brands.list = productBrands;

      });


    };

    $scope.filterByProductBrand = () =>{
        let productNames = [];
        let selectedCategoryName = $scope.transactionMainFilter.filter.productBrand.selected;
        let productName     = $rootScope.allData.products.list;
        angular.forEach(productName,function(name,index){
            if(name.brandName == selectedCategoryName.brandName){
                productNames.push(name);
            }
            $scope.allData.products.name.list = productNames;

        });


    };

  }]);
