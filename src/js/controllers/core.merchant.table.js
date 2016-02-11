"use strict";

app.controller("CoreMerchantTableCtrl", ["$scope", "$rootScope", "FileUploader",
	"$http", "locker", "$filter", "Restangular", "$state",  "$window", "$stateParams",
	"$mdToast", "$animate", "Beacon", "Store", "Offer","Product", "Cause","Analytics","Campaign",
	function($scope, $rootScope, FileUploader, $http, locker, $filter,
		Restangular, $state, $window, $stateParams, $mdToast, $animate, Beacon, Store, Offer, Product, Cause, Analytics,Campaign) {

		/**
		 * get Dexie dbCore
		 *
		 */
		let dbCore = $rootScope.dbCore;
		/**
		 * get merchantMe and merchantToken from Locker
		 *
		 */
		let merchantMe = locker.driver("local").namespace("core").get("me");
		let merchantToken = locker.driver("local").namespace("core").get("merchantToken");

		// MERCHANT TABLES
        $scope.allProductRows = [];
        $scope.allProducts = [];
        $scope.allCampaigns = [];
        $scope.allCauses = [];
        $scope.allStores = [];
        $scope.allBeacons = [];



		  $scope.checkName = function(data, id) {
		    if (id === 2 && data !== 'awesome') {
		      return "Username 2 should be `awesome`";
		    }
		  };
        var result;
        var base64Image;

        $scope.onLoad = function (index,e, reader, file, fileList, fileOjects, fileObj) {
            var filesSelected = document.getElementById("productUploadId-"+index).files;

            if (filesSelected.length > 0) {

                var reader = new FileReader();
                reader.onload = function (e) {

                    var canvas = document.createElement("canvas");
                    $('#product-img-'+index).attr('src', e.target.result);
                    var imageElement = document.createElement("img");

                    imageElement.setAttribute('src', e.target.result);
                    canvas.width = imageElement.width;
                    canvas.height = imageElement.height;
                    var context = canvas.getContext("2d");
                    context.drawImage(imageElement, 0, 0);
                    base64Image = canvas.toDataURL("image/jpeg");
                    result = base64Image.replace(/data:image\/jpeg;base64,/g, '');
                }

                //Renders Image on Page
                reader.readAsDataURL(filesSelected[0]);
            }
        };


        //Product.ProductAllData(merchantToken).then(function() {
        //    $scope.allProducts = Product.getProductAllData();
        //});
        //
        //Campaign.CampaignAllData(merchantToken).then(function() {
        //    $scope.allCampaigns = Campaign.getCampaignAllData();
        //});
        //
        //Cause.CauseAllData(merchantToken).then(function() {
        //    $scope.allCauses = Cause.getCauseAllData();
        //});
        //
        //Store.StoreAllData(merchantToken).then(function() {
        //    $scope.allStores = Store.getStoreAllData();
        //});
        //
        //Beacon.BeaconAllData(merchantToken).then(function() {
        //    $scope.allBeacons = Beacon.getBeaconAllData();
        //
        //});


        $scope.saveAllProductRows = function(data, index) {
            let productLength = $scope.productRows.allProductRows.length;
            let productinfo = {
                ProductName                 : data.productName,
                ProductDescription          : data.productDescription,
                Price                       : data.price,
                BrandName                   : data.brandName,
                BrandId                     : data.brandId,
                Product_SKU_Number          : data.product_SKU_Number,
                ProductType                 : data.productType,
                ProductTypeDescription      : data.productTypeDescription,
                ProductCategory             : data.productCategory,
                ProductCategoryDescription  : data.productCategoryDescription,
                ProductImage                : result,
                MerchantToken               : merchantToken
            };
            let productData = productinfo;
            if($scope.productRows.allProductRows[index].productId != undefined){
                let productID = $scope.productRows.allProductRows[index].productId;
                angular.extend(productinfo,{ProductId:productID});
                Product.update(productData).then(resp =>{
                    $scope.productRows.allProductRows[index] = angular.extend(data,{productId:productID});
                let productList = $scope.allProducts.MerchantProductAll.ProductList;
                //$rootScope.allData.products.count            = productList.length;
                //$rootScope.allData.products.categories.list  = productList.length > 0 ? $filter('unique')(productList, 'productCategory') : [];
                //$rootScope.allData.products.categories.count = $rootScope.allData.products.categories.list.length;
                //$rootScope.allData.products.types.list       = productList.length > 0 ? $filter('unique')(productList, 'productType') : [];
                //$rootScope.allData.products.types.count      = $rootScope.allData.products.types.list.length;
                //$rootScope.allData.products.name.list        = productList.length > 0 ? $filter('unique')(productList, 'productName') : [];
                //$rootScope.allData.products.name.count       = $rootScope.allData.products.types.list.length;
                //$rootScope.allData.products.brands.list      = productList.length > 0 ?  $filter('unique')(productList, 'brandName') : [];
                //$rootScope.allData.products.brands.count     = $rootScope.allData.products.brands.list.length;
                $scope.productRows.allProductRows[index].productImage = base64Image;
            });

        }else{
            Product.create(productData).then(resp => {
                $scope.productRows.allProductRows.pop($scope.inserted);
            let productID = resp.FlikResponse.Data.Product.ProductId;
            let productId = {productId:productID};
            angular.extend(data,productId);
            $scope.productRows.allProductRows.push(data);
            let productList = $scope.productRows.allProductRows;
            //$rootScope.allData.products.count            = productList.length;
            //$rootScope.allData.products.categories.list  = productList.length > 0 ? $filter('unique')(productList, 'productCategory') : [];
            //$rootScope.allData.products.categories.count = $rootScope.allData.products.categories.list.length;
            //$rootScope.allData.products.types.list       = productList.length > 0 ? $filter('unique')(productList, 'productType') : [];
            //$rootScope.allData.products.types.count      = $rootScope.allData.products.types.list.length;
            //$rootScope.allData.products.name.list        = productList.length > 0 ? $filter('unique')(productList, 'productName') : [];
            //$rootScope.allData.products.name.count       = $rootScope.allData.products.types.list.length;
            //$rootScope.allData.products.brands.list      = productList.length > 0 ?  $filter('unique')(productList, 'brandName') : [];
            //$rootScope.allData.products.brands.count     = $rootScope.allData.products.brands.list.length;
            $scope.productRows.allProductRows[index].productImage = base64Image;

        });
    }
};

        //saveAllCauseRows
        $scope.saveAllCauseRows = function(data,index){
            let causeLength =  $scope.causeRows.allCauseRows.length;
            let causeinfo = {
                MerchantToken : merchantToken,
                CauseName         : data.causeName
            };

            if($scope.causeRows.allCauseRows[index].merchantCauseId != undefined){
                let causeID = $scope.causeRows.allCauseRows[index].merchantCauseId;
                angular.extend(causeinfo,{MerchantCauseId:causeID});
                Cause.causeUpdate(causeinfo).then( resp =>{
                    $scope.causeRows.allCauseRows[index] =  angular.extend(data,{merchantCauseId:causeID});
            });
        }else{
            Cause.causeAdd(causeinfo).then(resp =>{
                $scope.causeRows.allCauseRows.pop($scope.inserted);
            let causeID = resp.FlikResponse.Data.MerchantCause.MerchantCauseId;
            let causeId = {merchantCauseId:causeID};
            angular.extend(data,causeId);
    $scope.causeRows.allCauseRows.push(data);
            //$rootScope.allData.causes.count = $rootScope.allData.causes.list.length;
        });
        }
        };

        //saveAllBeaconRows
        $scope.saveAllBeaconRows = function(data,index) {
            $scope.allBeacons = Beacon.getBeaconAllData();
          let beaconLength = $scope.beaconRows.allBeaconRows.length;

          let beaconinfo = {
            BeaconUUID       : data.beaconUUID,
            BeaconIdentifier : data.beaconIdentifier,
            MerchantToken    : merchantToken
          };

          if ($scope.beaconRows.allBeaconRows[index].beaconId != undefined ) {
            let beaconID = $scope.beaconRows.allBeaconRows[index].beaconId;
            angular.extend(beaconinfo,{BeaconId:beaconID});
            Beacon.beaconUpdate(beaconinfo).then(response =>{
                $scope.beaconRows.allBeaconRows[index] =  angular.extend(data,{beaconId:beaconID});
            });

          } else {
            Beacon.beaconAdd(beaconinfo).then(resp =>{

              $scope.beaconRows.allBeaconRows.pop($scope.inserted);
              let beaconID = resp.FlikResponse.Data.Beacons.MerchantBeaconsId;
              let beaconId = {beaconId:beaconID};
              angular.extend(data,beaconId);

    $scope.beaconRows.allBeaconRows.push(data);
              //$rootScope.allData.beacons.count = $rootScope.allData.beacons.list.length;
             });
          }
        };

//saveAllCampaignRows
$scope.saveAllCampaignRows = function(data,index) {
    let campaignLength = $scope.campaignRows.allCampaignRows.length;
    let campaigninfo = {
        CampaignName  : data.campaignName,
        FingerprintId : data.fingerprintId,
        OfferId       : data.offerId,
        DateStart     : data.dateStart,
        DateEnd       : data.dateEnd,
        MerchantToken : merchantToken,
        MerchantId    : $rootScope.merchantID
    };
    if ($scope.campaignRows.allCampaignRows[index].campaignId != undefined) {

        let campaignID =   $scope.campaignRows.allCampaignRows[index].campaignId;
        angular.extend(campaigninfo,{CampaignId:campaignID});
        Campaign.update(campaigninfo).then(response =>{
            $scope.campaignRows.allCampaignRows[index] =  angular.extend(data,{CampaignId:campaignID});
    });

} else {
    Campaign.create(campaigninfo).then(resp =>{
        $scope.campaignRows.allCampaignRows.pop($scope.inserted);
    let campaignID = resp.FlikResponse.Data.Campaigns.campaignId;
    let campaignId = {campaignId:campaignID};
    angular.extend(data,campaignId);
    $scope.campaignRows.allCampaignRows.push(data);
    //$rootScope.allData.campaigns.count = $rootScope.allData.campaigns.list.length;
});
}
};


        //saveAllStoreRows
        $scope.saveAllStoreRows = function(data,index){
          let storeLength =  $scope.allStores = [] ? 0 : $scope.allStores.StoreList.length;

          let storeinfo = {
            StoreName           : data.storeName,
            StoreLongitude      : data.storeLongitude,
            StoreLatitude       : data.storeLatitude,
            StoreZipCode        : data.storeZipCode,
            StoreStreetAddress  : data.storeStreetAddress,
            StoreState          : data.storeState,
            StoreCity           : data.storeCity,
            StoreCountry        : data.storeCountry,
            MerchantToken       : merchantToken
          };

          if(index < storeLength){
            let storeID = $scope.allStores = [] ? undefined :  $scope.allStores.StoreList[index].storeId;
            angular.extend(storeinfo,{StoreId:storeID});
            Store.storeUpdate(storeinfo).then(response =>{
                $scope.allStores.StoreList[index] =  angular.extend(data,{storeId:storeID});
            });
          }else{
            Store.storeAdd(storeinfo).then(resp =>{
              $scope.storesRows.allStoreRows.pop($scope.inserted);
              let storeID = resp.FlikResponse.Data.Store.StoreId;
              let storeId = {storeId:storeID};
              angular.extend(data,storeId);
    $scope.allStores.StoreList.push(data);
              //$rootScope.allData.stores.count = $rootScope.allData.stores.list.length;
            });
          }
        };
        $scope.saveAllLoyaltyRows = function(data,index){
            let loyaltyLength =   $rootScope.allData.loyalty.count;
            let loyaltyinfo = {
                BaseLoyaltyPointsAmount       : data.baseLoyaltyPointsAmount,
                IncrementLoyaltyPointsAmount  : data.incrementLoyaltyPointsAmount,
                DollarPurchaseAmount          : data.dollarPurchaseAmount,
                RewardAmount                  : data.rewardAmount,
                ThresholdLoyaltyPointsAmount  : data.thresholdLoyaltyPointsAmount,
                MerchantToken                 : merchantToken
            };
            if(index < loyaltyLength){
                let merchantOfferLoyaltyID = $rootScope.allData.loyalty.list[index].merchantOfferLoyaltyId;
                angular.extend(loyaltyinfo,{ MerchantOfferLoyaltyId: merchantOfferLoyaltyID });
                Offer.updateloyalty(loyaltyinfo).then(response =>{
                    $rootScope.allData.loyalty.list[index] =  angular.extend(data,{merchantOfferLoyaltyId:merchantOfferLoyaltyID});
                });
            } else {
            Offer.createloyalty(loyaltyinfo).then(resp =>{
            $scope.loyaltyRows.allLoyaltyRows.pop($scope.inserted);
            let merchantOfferLoyaltyID = resp.FlikResponse.Data.MerchantOfferLoyaltyNew.MerchantOfferLoyaltyId;
            let merchantOfferLoyaltyId = {merchantOfferLoyaltyId:merchantOfferLoyaltyID};
            angular.extend(data,merchantOfferLoyaltyId);
            $rootScope.allData.loyalty.list.push(data);
            $rootScope.allData.loyalty.count = $rootScope.allData.loyalty.list.length;
        });
        }
        };
$scope.productRows = {
    allProductRows: []
}

        // Save consumer
        $scope.saveAllConsumerRow = function(data,index){
          let consumerId = $scope.ConsumerRows.allConsumerRows[index].consumerId;
          let consumerInfo = {
            FirstName     : data.firstName,
            LastName      : data.lastName,
            MobileNumber  : data.mobileNumber,
            ConsumerId    : consumerId,
            MerchantToken : merchantToken
          };

          Analytics.consumerUpdate(consumerInfo).then(response =>{
            let statusCode = response.FlikResponse.Status.StatusCode;
            let statusmessage = response.FlikResponse.Status.StatusMessage;
            if(statusCode == 0){
              $mdToast.show(
                $mdToast.simple()
                  .content("Consumer Is Updated")
                  .position("top right")
                  .hideDelay(2700)
              );
            }else{
              $mdToast.show(
                $mdToast.simple()
                  .content(statusmessage)
                  .position("top right")
                  .hideDelay(2700)
              );
            }

          });
        };
$scope.allProducts = function(){
    var start = 0;
    var limit = $scope.product.range

    Product.ProductPaginateAllData(start,limit,merchantToken).then(function() {

        $scope.productRows.allProductRows = Product.getProductPaginateAllData();


    });

};
			  //removeAllProductRows
			  $scope.removeAllProductRows = function(index) {
          let productID = $scope.productRows.allProductRows[index].productId;
          let productinfo = {
              ProductId : productID,
              MerchantToken : merchantToken
          };
          if(productID != undefined){
            Product.trash(productinfo).then(response =>{
              let statusCode = response.FlikResponse.Status.StatusCode;
              let statusMessage = response.FlikResponse.Status.StatusMessage;
              if(statusCode == 0){
                $scope.productRows.allProductRows.splice(index, 1);
                $mdToast.show(
                  $mdToast.simple()
                      .content("Product Is Deleted")
                      .position("top right")
                      .hideDelay(2700)
                );
              }else{
                  $mdToast.show(
                    $mdToast.simple()
                    .content(statusMessage)
                    .position("top right")
                    .hideDelay(2700)
                );
              }
            });
          }else{
              $scope.productRows.allProductRows.splice(index, 1);
          }
			};

      //removeCauseRows
      $scope.removeAllCauseRows = function(index) {

        let causeID = $scope.causeRows.allCauseRows[index].merchantCauseId;
        let causeinfo = {
            MerchantCauseId : causeID,
            MerchantToken : merchantToken
        };
        if(causeID != undefined){
          Cause.causeDelete(causeinfo).then(response => {
            let statusCode = response.FlikResponse.Status.StatusCode;
            let statusMessage = response.FlikResponse.Status.StatusMessage;
            if(statusCode == 0){
              $scope.causeRows.allCauseRows.splice(index, 1);
              $mdToast.show(
                $mdToast.simple()
                    .content("Cause Is Deleted")
                    .position("top right")
                    .hideDelay(2700)
              );
            }else{

                $mdToast.show(
                $mdToast.simple()
                    .content(statusMessage)
                    .position("top right")
                    .hideDelay(2700)
              );
            }

          });
        }else{
            $scope.causeRows.allCauseRows.splice(index, 1);
        };

      };

      //removeStoreRows
      $scope.removeAllStoreRows = function(index) {
          console.log(" in remove store ");
        let storeID = $scope.allStores = [] ? undefined : $scope.allStores.StoreList[index].storeId;
        let storeinfo = {
          StoreId : storeID,
          MerchantToken : merchantToken
        };
        if(storeID != undefined){
          Store.storeDelete(storeinfo).then(response =>{
            let statusCode = response.FlikResponse.Status.StatusCode;
            let statusMessage = response.FlikResponse.Status.StatusMessage;
            if(statusCode == 0){
              $scope.storesRows.allStoreRows.splice(index, 1);
              $window.location.reload();
              $mdToast.show(
                  $mdToast.simple()
                      .content("Store Is Deleted")
                      .position("top right")
                      .hideDelay(2700)
              );
            }else{
                $window.location.reload();
                $mdToast.show(
                $mdToast.simple()
                    .content(statusMessage)
                    .position("top right")
                    .hideDelay(2700)
              );
            }

          });
        }else{
          $scope.storesRows.allStoreRows.splice(index, 1);
        }

      };
        //removeLoyaltyRows
        $scope.removeAllLoyaltyRows = function(index) {
            let merchantOfferLoyaltyID = $rootScope.allData.loyalty.list[index].merchantOfferLoyaltyId;
            let loyaltyinfo = {
                MerchantOfferLoyaltyId : merchantOfferLoyaltyID,
                MerchantToken : merchantToken
            };
            if(merchantOfferLoyaltyID != undefined){
                Offer.trashloyalty(loyaltyinfo).then(response =>{
                let statusCode = response.FlikResponse.Status.StatusCode;
                let statusMessage = response.FlikResponse.Status.StatusMessage;
                if(statusCode == 0){
                    $scope.loyaltyRows.allLoyaltyRows.splice(index, 1);
                    $window.location.reload();
                    $mdToast.show(
                        $mdToast.simple()
                            .content("Merchant Offer Loyalty Is Deleted")
                            .position("top right")
                            .hideDelay(2700)
                    );
                }else{
                    $window.location.reload();
                    $mdToast.show(
                        $mdToast.simple()
                            .content(statusMessage)
                            .position("top right")
                            .hideDelay(2700)
                    );
                }

            });
        }else{
            $scope.loyaltyRows.allLoyaltyRows.splice(index, 1);
        }

      };

      //removeBeaconRows
      $scope.removeAllBeaconRows = function(index) {
        let beaconID =  $scope.beaconRows.allBeaconRows[index].beaconId;
        let beaconinfo = {
          BeaconId      : beaconID,
          MerchantToken : merchantToken
        };
        if(beaconID != undefined){
          Beacon.beaconDelete(beaconinfo).then(response =>{
            let statusCode = response.FlikResponse.Status.StatusCode;
            let statusMessage = response.FlikResponse.Status.StatusMessage;
            if(statusCode == 0){
              $scope.beaconRows.allBeaconRows.splice(index, 1);
              $mdToast.show(
                $mdToast.simple()
                    .content("Beacon Is Deleted")
                    .position("top right")
                    .hideDelay(2700)
              );
            }else{

                $mdToast.show(
                $mdToast.simple()
                    .content(statusMessage)
                    .position("top right")
                    .hideDelay(2700)
              );
            }
          });
        }else{
            $scope.beaconRows.allBeaconRows.splice(index, 1);
        };
      };
$scope.allBeacons =()=>{
    Beacon.beaconGetAll(mPass).then(response =>{
        let beaconList = response.FlikResponse.Data.MerchantBeacons.GetAll;
    //$rootScope.allData.beacons.list = beaconList;
    //$rootScope.allData.beacons.count = beaconList.length;
    $scope.beaconRows = {
        allBeaconRows:beaconList
    };
});
};
//removeCampaign
$scope.removeAllCampaignRows = function(index) {

    let campaignID = $scope.campaignRows.allCampaignRows[index].campaignId;
    let campaigninfo = {
        CampaignId      : campaignID,
        MerchantToken : merchantToken
    };
    if(campaignID != undefined){
        Campaign.trash(campaigninfo).then(response =>{
            let statusCode = response.FlikResponse.Status.StatusCode;
        let statusMessage = response.FlikResponse.Status.StatusMessage;
        if(statusCode == 0){
            $scope.campaignRows.allCampaignRows.splice(index, 1);

            $mdToast.show(
                $mdToast.simple()
                    .content("Campaign Is Deleted")
                    .position("top right")
                    .hideDelay(2700)
            );
        }else{

            $mdToast.show(
                $mdToast.simple()
                    .content(statusMessage)
                    .position("top right")
                    .hideDelay(2700)
            );
        }
    });
}else{
    $scope.campaignRows.allCampaignRows.splice(index, 1);
};
};
      // removeConsumer
      $scope.removeAllConsumerRows = function(index){
        let consumerId = $scope.ConsumerRows.allConsumerRows[index].consumerId;
        let consumerInfo = {
          ConsumerId    : consumerId,
          MerchantToken : merchantToken
        };
        Analytics.consumerDelete(consumerInfo).then(response =>{
          $scope.ConsumerRows.allConsumerRows.splice(index, 1);
          let statusCode = response.FlikResponse.Status.StatusCode;
          let statusMessage = response.FlikResponse.Status.StatusMessage;
          if(statusCode == 0){
              $mdToast.show(
              $mdToast.simple()
                .content("Consumer Is Deleted")
                .position("top right")
                .hideDelay(2700)
            );
          }else{
            $mdToast.show(
              $mdToast.simple()
                .content(statusMessage)
                .position("top right")
                .hideDelay(2700)
            );
          }
        });

      };

      // removeConsumerTransaction
      $scope.removeAllConsumerTransactionRows = function(index){
        $scope.ConsumerTransactionRows.allConsumerTransactionRows.splice(index, 1);

      }
			//addAllProductRows
			$scope.addAllProductRows = function() {
				$scope.inserted = {

				};
                if(!$scope.productRows){
                    $scope.productRows = {
                        allProductRows: []
                    };
                }
				    $scope.productRows.allProductRows.push($scope.inserted);

			};

      //addAllCauseRows
      $scope.addAllCauseRows = function() {
        $scope.inserted = {
        };
          if(!$scope.causeRows){
              $scope.causeRows = {
                  allCauseRows: []
              };
          }
        $scope.causeRows.allCauseRows.push($scope.inserted);
      };

//addAllCampaignRows
$scope.addAllCampaignRows = function() {
    $scope.inserted = {
    };
    if(!$scope.campaignRows){
        $scope.campaignRows = {
            allCampaignRows: []
        };
    }
    $scope.campaignRows.allCampaignRows.push($scope.inserted);
};

      //addAllStoreRows
      $scope.addAllStoreRows = function() {
        $scope.inserted = {
        };
          if(!$scope.storesRows){
              $scope.storesRows = {
                  allStoreRows: []
              };
          }
        $scope.storesRows.allStoreRows.push($scope.inserted);
      };
        $scope.addAllLoyaltyRows = function() {
            $scope.inserted = {
            };
            $scope.loyaltyRows.allLoyaltyRows.push($scope.inserted);
        };
      //addAllBeaconRows
      $scope.addAllBeaconRows = function() {
        $scope.inserted = {
        };
          if(!$scope.beaconRows) {
              $scope.beaconRows = {
                  allBeaconRows: []
              };
          }
        $scope.beaconRows.allBeaconRows.push($scope.inserted);


      };

      //addAllConsumerRows
      $scope.addAllConsumerRows = function() {
        $scope.inserted = {
        };
          if(!$scope.ConsumerRows){
              $scope.ConsumerRows = {
                  allConsumerRows: []
              };
          }
        $scope.ConsumerRows.allConsumerRows.push($scope.inserted);

      };

      //addAllConsumerTransactionRows
      $scope.addAllConsumerTransactionRows = function() {
        $scope.inserted = {
        };
          if(!$scope.ConsumerTransactionRows){
              $scope.ConsumerTransactionRows = {
                  allConsumerTransactionRows: []
              };
          }
        $scope.ConsumerTransactionRows.allConsumerTransactionRows.push($scope.inserted);

      };

	}
]);
