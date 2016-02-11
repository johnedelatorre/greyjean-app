'use strict';

// signin controller
app.controller('SigninFormController',  ['$scope', '$rootScope', 'Auth', 'Fingerprint', 'Offer', 'Campaign', 'Product', '$filter', '$state', 'locker', 'Cause', 'Store', 'Beacon','Analytics','$cookies',
    function(                             $scope,   $rootScope,   Auth,   Fingerprint,   Offer,   Campaign,   Product,   $filter,   $state,   locker, Cause, Store, Beacon,Analytics,$cookies) {

      $scope.toggleWizardLoader = {
        showLoader: false
      }

      $scope.login = () => {
        $scope.toggleWizardLoader.showLoader = true;
        let merchantCreds = {
          email    : $scope.user.email,
          password : $scope.user.password
        }

        Auth.login(merchantCreds).then(function(response) {
          let statusCode    = response.FlikResponse.Status.StatusCode;
          let statusMessage = response.FlikResponse.Status.StatusMessage;
          if (statusCode == 0) {
            let merchantToken = response.FlikResponse.Data.MerchantToken.Token;
            locker.driver('local')
              .namespace('core')
              .put('merchantToken', merchantToken);
            //console.info('this is merchantToken ' +merchantToken);
            Auth.getMe(merchantToken).then(response => {
              if (statusCode == 0) {
              let me = response.FlikResponse.Data.Merchant.Me;
              //console.info('this is me ' + JSON.stringify(me, null, 4));
              let merchantInfo = {
                merchantId     : me.merchantId,
                loginId        : me.loginId,
                email          : me.email,
                firstName      : me.firstName,
                lastName       : me.lastName,
                mobileNo       : me.mobileNo,
                applicationKey : me.applicationKey,
                developerKey   : me.developerKey
              }
              console.warn('and the status is on get me is '+statusCode);
              locker.driver('local')
                .namespace('core')
                .put('me', merchantInfo);

              let mPass = {
                MerchantToken: merchantToken
              }
                  //console.log("the token is"+merchantToken);
                  //$cookies.merchantToken = merchantToken;
              //console.time('fetch all FOC');
              //console.time('fetch all fingerprints');

              //Fingerprint.getAllData(mPass).then(response => {
              //  let fingerprintData = response.FlikResponse.Data;
              //  $rootScope.allData.fingerprints.list                      = fingerprintData.MerchantFingerprintAll;
              //  $rootScope.allData.fingerprints.count                     = fingerprintData.MerchantFingerprintAll.length;
              //  $rootScope.allData.fingerprints.locations.list            = fingerprintData.FingerprintLocationAll;
              //  $rootScope.allData.fingerprints.locations.count           = fingerprintData.FingerprintLocationAll.length;
              //  $rootScope.allData.fingerprints.transactions.list         = fingerprintData.FingerprintTransactionAll;
              //  $rootScope.allData.fingerprints.transactions.count        = fingerprintData.FingerprintTransactionAll.length;
              //  $rootScope.allData.fingerprints.socialTransactions.list   = fingerprintData.FingerprintProductAll;
              //  $rootScope.allData.fingerprints.socialTransactions.count  = fingerprintData.FingerprintProductAll.length;
              //  $rootScope.allData.fingerprints.beaconTransactions.list   = fingerprintData.FingerprintBeaconsAll;
              //  $rootScope.allData.fingerprints.beaconTransactions.count  = fingerprintData.FingerprintBeaconsAll.length;
              //  $rootScope.allData.fingerprints.causeTransactions.list    = fingerprintData.FingerprintCauseAll;
              //  $rootScope.allData.fingerprints.causeTransactions.count   = fingerprintData.FingerprintCauseAll.length;

                //console.timeEnd('fetch all fingerprints');
                //console.time('fetch all offers');

                //Offer.getAllData(mPass).then(response => {
                //  let offerData = response.FlikResponse.Data;
                //
                //  $rootScope.allData.offers.list               = offerData.MerchantOfferAll;
                //  $rootScope.allData.offers.count              = offerData.MerchantOfferAll.length;
                //  $rootScope.allData.offers.locations.list     = offerData.OfferLocationAll;
                //  $rootScope.allData.offers.locations.count    = offerData.OfferLocationAll.length;
                //  $rootScope.allData.offers.transactions.list  = offerData.OfferTransactionAll;
                //  $rootScope.allData.offers.transactions.count = offerData.OfferTransactionAll.length;

                  //console.timeEnd('fetch all offers');
                  //console.time('fetch all campaigns');

                  //Campaign.getAll(mPass).then(response => {
                  //  let campaignList = response.FlikResponse.Data.MerchantCampaign.CampaignList;
                  //
                  //  $rootScope.allData.campaigns.list  = campaignList;
                  //  $rootScope.allData.campaigns.count = campaignList.length;
                  //
                  //  //console.timeEnd('fetch all campaigns');
                  //  //console.time('for loop campaign');
                  //  Product.getAll(mPass).then(response => {
                  //    let productList = response.FlikResponse.Data.MerchantProductAll.ProductList;
                  //
                  //    $rootScope.allData.products.list             = productList;
                  //    $rootScope.allData.products.count            = productList.length;
                  //    $rootScope.allData.products.categories.list  = productList.length > 0 ? $filter('unique')(productList, 'productCategory') : [];
                  //    $rootScope.allData.products.categories.count = $rootScope.allData.products.categories.list.length;
                  //    $rootScope.allData.products.types.list       = productList.length > 0 ? $filter('unique')(productList, 'productType') : [];
                  //    $rootScope.allData.products.types.count      = $rootScope.allData.products.types.list.length;
                  //    $rootScope.allData.products.name.list        = productList.length > 0 ? $filter('unique')(productList, 'productName') : [];
                  //    $rootScope.allData.products.name.count       = $rootScope.allData.products.types.list.length;
                  //    $rootScope.allData.products.brands.list      = productList.length > 0 ?  $filter('unique')(productList, 'brandName') : [];
                  //    $rootScope.allData.products.brands.count     = $rootScope.allData.products.brands.list.length;
                  //Analytics.getProductWithTransactionAll(mPass).then(response =>{
                  //    let productsWithTransactionList = response.FlikResponse.Data.MerchantProduct.ProductGet;
                  //$rootScope.allData.productsWithTransaction.list  = productsWithTransactionList;
                  //});
                      //Cause.causeGetAll(mPass).then(response => {
                      //  let causeList = response.FlikResponse.Data.MerchantCauseAllAll.CauseAllList;
                      //  //console.log(`this is allData ${JSON.stringify($rootScope.allData, null, 4)}`);
                      //
                      //  $rootScope.allData.causes.list  = causeList;
                      //  $rootScope.allData.causes.count = causeList.length;
                      //
                      // Store.storeGetAll(mPass).then(response =>{
                      //    let storeList = response.FlikResponse.Data.MerchantStoreAll.StoreList;
                      //    $rootScope.allData.stores.list = storeList;
                      //    $rootScope.allData.stores.count = storeList.length;
                      //
                      //Beacon.beaconGetAll(mPass).then(response =>{
                      //
                          if(response.FlikResponse.Status.StatusCode == 0 ){
                      //    let beaconList = response.FlikResponse.Data.MerchantBeacons.GetAll;
                      //    $rootScope.allData.beacons.list = beaconList;
                      //
                      //    $rootScope.allData.beacons.count = beaconList.length;


                          $scope.toggleWizardLoader.showLoader = false;
                          $state.go('core.home');
                        }
                         else{$scope.toggleWizardLoader.showLoader = false;
                           $state.go('core.home');
                         }
                      //},
            //error =>{
            //              console.info(JSON.stringify(error, null, 4));
            //          });

                      //},
            //error =>{
            //              console.info(JSON.stringify(error, null, 4));
            //
            //          });
            //
            //
            //          },
            //error => {
            //            console.info(JSON.stringify(error, null, 4));
            //          });
            //        }, error => {
            //          console.info(JSON.stringify(error, null, 4));
            //        });
            //      },
    //error => {
    //                console.info(JSON.stringify(error, null, 4));
    //              });
    //            }, error => {
    //              console.info(JSON.stringify(error, null, 4));
    //            });
    //          }, error => {
    //            console.info(JSON.stringify(error, null, 4));
    //          });
            }
      else if (statusCode == 1) {
              $scope.toggleWizardLoader.showLoader = false;
              console.warn('and the status is '+statusCode);
              console.warn( response+' token not valid - need to login again' );
              locker.driver('local')
                .namespace('core')
                .forget(['merchantToken', 'me']);
              $state.go('access.signin');
            }
          }, error => {
              $scope.toggleWizardLoader.showLoader = false;
              console.info( 'cannot validate token -- the error is ' + JSON.stringify(error, null, 4));
          });
        } else if (statusCode == 1) {
            $scope.toggleWizardLoader.showLoader = false;
            console.warn( 'no bueno' + JSON.stringify(response, null, 4));
            $scope.authError = statusMessage;
        } else {
            $scope.toggleWizardLoader.showLoader = false;
            console.warn( 'no bueno' + JSON.stringify(response, null, 4));
            $scope.authError = statusMessage;
        }
      }, error => {
          $scope.toggleWizardLoader.showLoader = false;
          $scope.authError = "There was an error logging in.. Please contact support.";
          console.error('epic fail ' + JSON.stringify(error, null, 4));
      });
    };
  }]);
