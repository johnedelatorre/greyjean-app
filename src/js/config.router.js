"use strict";

/**
 * Config for the router
 */
angular.module("app")
  .run(
    [          "$rootScope", "$state", "locker",  "Auth",  "Restangular",  "$stateParams", "editableOptions",
      function ($rootScope,   $state,   locker,    Auth,    Restangular,    $stateParams,   editableOptions) {

        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        /**
         * devCore settings
         * only for dev
         */
        $rootScope.devcode = "meow";
        $rootScope.devcodeAPI = "meow";
        $rootScope.devcodeLocker = "meow from locker";
        /**
         * this is how we set whether or not to use runscope
         * to inspect our API traffic
         *
         * @type  {Boolean}  if true using runscope API url
         */
        var runCoreAPI = false;
        /**
         * end dev settings
         */

        $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
          if (toState.data.authenticate && !Auth.isLoggedIn()){
            // User isn’t authenticated
            console.group(Auth.isLoggedIn());
            console.info( "nope from router auth ");
            console.groupEnd();
            $state.transitionTo("access.signin");
            event.preventDefault();
          }
        });


        // set our theme for xeditable
        editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'

        /**
         * Multithread Init
         *
         * waiting to perf test against Operative
         */
        // var num_threads = 2;
        // $rootScope.MT = new Multithread(num_threads);

        if (locker.driver("local").namespace("core").has("allData")) {
          locker.driver("local")
            .namespace("core")
            .bind($rootScope, "allData");
          $rootScope.allData = locker.driver("local").namespace("core").get("allData");
        } else {
          locker.driver("local").namespace("core").bind($rootScope, "allData");
          $rootScope.allData = {
            fingerprints: {
              count: 0,
              list: [],
              locations: {
                count: 0,
                list: []
              },
              transactions: {
                count: 0,
                list: []
              },
              socialTransactions: {
                count: 0,
                list: []
              },
              causeTransactions : {
                count: 0,
                list: []
              },
              storeTransactions:{
                  count: 0,
                  list:[]
              },
              beaconTransactions:{
                  count:0,
                  list:[]
              }
            },
            offers: {
              count: 0,
              list: [],
              locations: {
                count: 0,
                list: []
              },
              transactions: {
                count: 0,
                list: []
              }
            },
            campaigns: {
              count: 0,
              list: [],
              socialCampaigns: {
                list: [],
                count: 0
              }
            },
            products: {
              count: 0,
              list: [],
              categories: {
                count: 0,
                list: []
              },
              types: {
                count: 0,
                list: []
              },
              brands: {
                count: 0,
                list: []
              },
              name:{
                count:0,
                list:[]
              }

            },
              productsWithTransaction: {
                  count: 0,
                  list: [],
                  categories: {
                      count: 0,
                      list: []
                  },
                  types: {
                      count: 0,
                      list: []
                  },
                  brands: {
                      count: 0,
                      list: []
                  },
                  name:{
                      count:0,
                      list:[]
                  }

              },
            stores:{
              count: 0,
              list:[]
            },
            loyalty:{
              count: 0,
              list:[]
            },
            beacons:{
              count: 0,
              list: []
            },
            causes:{
                count: 0,
                list:[]
            }
          }
        }


        /**
         * delete all the merchant data
         */
        $rootScope.trashMerchantData = () => {
          locker.driver("local")
            .namespace("core")
            .forget(["merchantToken", "me", "allData"]);
          console.log(`merchant data trashed`);
        }
          let mPass = {
              MerchantToken: merchantToken
          }

        // fired when a new item is added to storage
        $rootScope.$on('locker.item.added', function (e, payload) {
          //console.log('++ locker item added ++ \n' + JSON.stringify(payload, null, 4) );
          $rootScope.devcodeLocker = payload;
        });

        // fired when an item is removed from storage
        $rootScope.$on('locker.item.forgotten', function (e, payload) {
          //console.log('-- locker item forgotten -- \n' + JSON.stringify(payload, null, 4));
          $rootScope.devcodeLocker = payload;
        });

        // fired when an item's value changes to something new
        $rootScope.$on('locker.item.updated', function (e, payload) {
          //console.log('+- locker item updated +- \n' + JSON.stringify(payload, null, 4 ));
          $rootScope.devcodeLocker = payload;
        });

        $rootScope.merchantID = 1; //hardcoded for now
        var merchant = locker.driver('local').namespace('core').has('auth');
        if (merchant) {
          var merchantToken = locker.driver('local').namespace('core').get('auth').MerchantToken;
          $rootScope.merchantToken = merchantToken;
        }
        if (!runCoreAPI) {
          Restangular.setBaseUrl('http://66.228.114.178/genie/api/');
        } else {
          /**
           * here we are using Runscope to inspect our API calls
           * go and check it out most awesome
           */
          Restangular.setBaseUrl('http://54-148-81-103-o70xsfwi43pg.runscope.net/flik_api/api/');
          Restangular.setDefaultHeaders({'Runscope-Request-Port': 8080});
        }
        // Restangular.configuration.getIdFromElem = function(elem) {
        //   // if route is customers ==> returns customerID
        //   return elem[_.initial(elem.route).join('') + "Id"];
        // }
      }
    ]
  )
  /**
   * raven config
   *
   * use Raven like this to catch adn log specific errors
   *
   * HOWTO:  (1)  log raven error  ->  Raven.captureMessage('Error');
   */
  // .config(function(RavenProvider) {
  //   // This is a development flag to log errors rather than sending it to Sentry
  //   RavenProvider.development(true);
  // })
  /**
   * locker config
   */
  .config(function config(lockerProvider) {
      lockerProvider.setDefaultDriver('session')
                    .setDefaultNamespace('core')
                    .setEventsEnabled(true);
  })
  /**
   * http config
   */
  .config(['$httpProvider', function ($httpProvider) {
    // Use x-www-form-urlencoded Content-Type
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    $httpProvider.defaults.transformRequest.unshift(function (data, headersGetter) {
      var key, result = [];
      for (key in data) {
        if (data.hasOwnProperty(key)) {
          result.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
        }
      }
      return result.join("&");
    });
  }])

  /**
   * ui-router config
   */
  .config(  ['$stateProvider', '$urlRouterProvider',
    function ($stateProvider,   $urlRouterProvider) {
      $urlRouterProvider
        .otherwise('/access/signin');
      $stateProvider
        .state('core', {
          abstract: true,
          url: '',
          templateUrl: 'templates/layout.html',
          data: {
            authenticate: true
          }
        })
        .state('core.home', {
          url: '/dashboard',
          templateUrl: 'templates/app_dashboard.html',
          controller: function($scope, Analytics,locker,$filter,$mdToast){
              var tempcampall = [];
              $scope.analyticscampaigntype = {   "type": "select",
                  "name": "analyticscampaigntype",
                  "value": "Mobile",
                  "values": [ "Mobile", "Social"]
              };
            $scope.toggleWizardLoader = {};
            $scope.toggleWizardLoader.showLoader = true; //loader
            let merchantRef = {
              MerchantToken: locker.driver("local").namespace("core").get("merchantToken")
            };

            $scope.updatecampresponse = function(response,statusCode,statusMessage){
                if(statusCode == 0){
                    $scope.campaignInfo = response.FlikResponse.Data.MerchantCampaign.CampaignList;
                    $scope.filterdLists = $scope.campaignInfo;
                    $scope.campaign = [];
                    $scope.offer = [];
                    $scope.fingerprint = [];
                    $scope.initFilterData = function(){
                        angular.forEach($scope.campaignInfo, function (allInfo, index) {
                            let campaignData = {
                                campaignName: allInfo.campaignName,
                                campaignId: allInfo.campaignId
                            };
                            let offerData = {
                                offerName: allInfo.offerName,
                                offerId: allInfo.offerId
                            };
                            let fingerprintData = {
                                fingerprintName: allInfo.fingerprintName,
                                fingerprintId: allInfo.fingerprintId
                            };

                            $scope.campaign.push(campaignData);
                            $scope.offer.push(offerData);
                            $scope.fingerprint.push(fingerprintData);
                        });
                    };
                    $scope.initFilterData();
                    $scope.updatecampfilterresponse = function(tempcampall){
                        $scope.campaignAll = tempcampall;
                        $scope.toggleWizardLoader.showLoader = false;
                        $scope.isCampaignChecked = {};
                        $scope.isOfferChecked = {};
                        $scope.isFingerprintChecked = {};
                        $scope.ischecked = {};
                        $scope.ids = [];
                        let startDate;
                        let reCalculate = 0;
                        //$scope.campaignInfo = fetchCampaignAll.FlikResponse ? fetchCampaignAll.FlikResponse.Data.MerchantCampaign.CampaignList : [];
                        //$scope.campaignInfo = $rootScope.allData.campaigns.list;



                        //graph
                        $scope.camapignGraph = function(dayData){
                            let thirtyDayParticipantInformation = parseInt( dayData.thirtyDaysCampaignTotalParticipants);
                            let sixtyDayParticipantInformation =  parseInt( dayData.sixtyDaysCampaignTotalParticipants);
                            let nintyDayParticipantInformation = parseInt( dayData.nintyDaysCampaignTotalParticipants);
                            $scope.participantDays = [thirtyDayParticipantInformation,sixtyDayParticipantInformation,nintyDayParticipantInformation];

                            $scope.campaignOverview = {
                                options: {
                                    chart: {
                                        type: "area"
                                    }
                                },
                                series: [{
                                    name: "Participant",
                                    data: $scope.participantDays,
                                    color:"#608ECA"
                                }],
                                xAxis: {
                                    categories: [
                                        "30",
                                        "60",
                                        "90"

                                    ]
                                },
                                credits: {
                                    enabled: false
                                },
                                title: {
                                    style:{
                                        color:"#dddddd",
                                        fontSize:"17px"
                                    },
                                    text: "Total Participant"
                                },
                                loading: false
                            }
                        }

                        //redamption

                        $scope.redamptionGraph = function(dayData){
                            let thirtyDayRedemptionInformation = parseFloat(dayData.thirtyDaysCampaignTotalRedemptionRate);
                            let sixtyDayRedemptionInformation =  parseFloat(dayData.sixtyDaysCampaignTotalRedemptionRate);
                            let nintyDayRedemptionInformation =  parseFloat(dayData.nintyDaysCampaignTotalRedemptionRate);
                            $scope.redemptionDays = [thirtyDayRedemptionInformation,sixtyDayRedemptionInformation,nintyDayRedemptionInformation];

                            $scope.redamptionOverview = {
                                options: {
                                    chart: {
                                        type: "area"
                                    }
                                },
                                series: [{
                                    name: "Redemption",
                                    data: $scope.redemptionDays,
                                    color:'#C56331'
                                }],
                                xAxis: {
                                    categories: [
                                        "30",
                                        "60",
                                        "90"

                                    ]
                                },
                                credits: {
                                    enabled: false
                                },
                                title: {
                                    style:{
                                        color:"#dddddd",
                                        fontSize:"17px"
                                    },
                                    text: "Total Redemption"
                                },
                                loading: false
                            }
                        }
                        //sales graph
                        $scope.salesGraph = function(dayData)
                        {
                            let thirtyDaySalesInformation = parseInt( dayData.thirtyDaysCampaignTotalSalesAmountforAllRedemptions);
                            let sixtyDaySalesInformation =  parseInt( dayData.sixtyDaysCampaignTotalSalesAmountforAllRedemptions);
                            let nintyDaySalesInformation = parseInt( dayData.nintyDaysCampaignTotalSalesAmountforAllRedemptions);
                            $scope.salesDays = [thirtyDaySalesInformation,sixtyDaySalesInformation,nintyDaySalesInformation];

                            $scope.salesOverview = {
                                options: {
                                    chart: {
                                        type: "area",
                                    }
                                },
                                series: [{
                                    name: "Sales",
                                    data: $scope.salesDays,
                                    color:'#29A2B3'
                                }],
                                xAxis: {
                                    categories: [
                                        "30",
                                        "60",
                                        "90"

                                    ]
                                },
                                credits: {
                                    enabled: false
                                },
                                title: {
                                    style:{
                                        color:"#dddddd",
                                        fontSize:"17px"
                                    },
                                    text: "Total Sales"

                                },
                                loading: false
                            }
                        };

                        // uncheck all data
                        $scope.uncheck = function(unselect,whom){
                            if(unselect){
                                if(whom === "campaign"){
                                    $scope.isCampaignChecked.data = false;
                                    angular.forEach($scope.ids,function(camp,index){
                                        $scope.ischecked.data[camp] = false;
                                        $scope.filterByCampaign(camp);
                                    });
                                    $scope.campaignFilterApply();
                                }
                                else{
                                    if(whom ==="offer"){
                                        $scope.isOfferChecked.data = false;
                                        angular.forEach($scope.ids,function(camp,index){
                                            $scope.ischecked.data[camp] = false;
                                            $scope.filterByOffer(camp);

                                        });
                                        $scope.offerFilterApply();

                                    }
                                    else{
                                        $scope.isFingerprintChecked.data = false;
                                        angular.forEach($scope.ids,function(camp,index){
                                            $scope.ischecked.data[camp] = false;
                                            $scope.filterByFingerPrint(camp);
                                        });
                                        $scope.fingerprintFilterApply();
                                    }
                                }

                            }
                        };

                        // camapignFltering
                        $scope.applycampfilter = function(response){
                            $scope.offer = [];
                            $scope.fingerprint = [];
                            $scope.filterdLists = response.FlikResponse.Data.AnalyticsFiltering.AnalyticsResult;
                            let overallResponse = response.FlikResponse.Data.AnalyticsFiltering.TotalAnalyticsResult;
                            $scope.salesSummary = overallResponse[0];
                            $scope.camapignGraph( $scope.salesSummary);
                            $scope.redamptionGraph($scope.salesSummary);
                            $scope.salesGraph($scope.salesSummary);
                            angular.forEach( $scope.filterdLists,function(selectedCampaignInfo,index){
                                let selectedCampaignOffer = {
                                    offerName: selectedCampaignInfo.offerName,
                                    offerId:   selectedCampaignInfo.offerId
                                };

                                let selectedCampaignFingerprint = {
                                    fingerprintName: selectedCampaignInfo.fingerprintName,
                                    fingerprintId:   selectedCampaignInfo.fingerprintId
                                };
                                $scope.offer.push(selectedCampaignOffer);
                                $scope.fingerprint.push(selectedCampaignFingerprint);
                            });
                        }
                        $scope.campaignFilterApply = function(){
                            if($scope.isCampaignChecked.data) {
                                let idInString = $scope.ids.toString();
                                let merchantRefId = {
                                    MerchantToken: locker.driver("local").namespace("core").get("merchantToken"),
                                    CampaignId: idInString

                                };
                                if ($scope.analyticscampaigntype.value == 'Mobile'){
                                    Analytics.getFilterData(merchantRefId).then(response => {
                                        $scope.applycampfilter(response);
                                    });
                                }else if ($scope.analyticscampaigntype.value == 'Social'){
                                Analytics.getSocialFilterData(merchantRefId).then(response => {

                                    $scope.applycampfilter(response);
                            });
                            }
                        }
                        else{
                            let merchantRefId = {
                                MerchantToken: locker.driver("local").namespace("core").get("merchantToken")
                            };
                            $scope.filterdLists = $scope.campaignInfo;
                            let overallResponse= $scope.campaignAll;
                            $scope.salesSummary = overallResponse[0];
                            $scope.camapignGraph( $scope.salesSummary);
                            $scope.redamptionGraph($scope.salesSummary);
                            $scope.salesGraph($scope.salesSummary);
                            $scope.initFilterData();
                        }
                    }

                //offer filter
                $scope.applyofferfilter = function(response){
                    $scope.campaign = [];
                    $scope.fingerprint = [];
                    $scope.filterdLists = (response.FlikResponse.Data.AnalyticsFiltering.AnalyticsResult);
                    let overallResponse = (response.FlikResponse.Data.AnalyticsFiltering.TotalAnalyticsResult);
                    $scope.salesSummary = overallResponse[0];
                    $scope.camapignGraph( $scope.salesSummary);
                    $scope.redamptionGraph($scope.salesSummary);
                    $scope.salesGraph($scope.salesSummary);
                    angular.forEach( $scope.filterdLists,function(selectedOfferInfo,index){
                        let selectedOfferCampaign = {
                            campaignName: selectedOfferInfo.campaignName,
                            campaignId:   selectedOfferInfo.campaignId
                        };

                        let selectedOfferFingerprint = {
                            fingerprintName: selectedOfferInfo.fingerprintName,
                            fingerprintId:   selectedOfferInfo.fingerprintId
                        };
                        $scope.campaign.push(selectedOfferCampaign);
                        $scope.fingerprint.push(selectedOfferFingerprint);
                    });
                }
                    $scope.offerFilterApply = function(){
                        if($scope.isOfferChecked.data){
                            let idInString = $scope.ids.toString();
                            let merchantRefId = {
                                MerchantToken: locker.driver("local").namespace("core").get("merchantToken"),
                                OfferId: idInString

                            };
                            if ($scope.analyticscampaigntype.value == 'Mobile'){
                                Analytics.getFilterData(merchantRefId).then(response => {
                                    $scope.applyofferfilter(response);
                            });
                        }else if ($scope.analyticscampaigntype.value == 'Social'){
                            Analytics.getSocialFilterData(merchantRefId).then(response => {
                                $scope.applyofferfilter(response);
                        });
                        }
                    }
                else{
                        let merchantRefId = {
                            MerchantToken: locker.driver("local").namespace("core").get("merchantToken")
                        };
                        $scope.filterdLists = $scope.campaignInfo;
                        let overallResponse= $scope.campaignAll;
                        $scope.salesSummary = overallResponse[0];
                        $scope.camapignGraph( $scope.salesSummary);
                        $scope.redamptionGraph($scope.salesSummary);
                        $scope.salesGraph($scope.salesSummary);
                        $scope.initFilterData();

                    }

                };
        //fingerprint filter
                $scope.applyfingerfilter = function (response) {
                    $scope.campaign = [];
                    $scope.offer = [];
                    $scope.filterdLists = (response.FlikResponse.Data.AnalyticsFiltering.AnalyticsResult);
                    let overallResponse = (response.FlikResponse.Data.AnalyticsFiltering.TotalAnalyticsResult);
                    $scope.salesSummary = overallResponse[0];
                    $scope.camapignGraph( $scope.salesSummary);
                    $scope.redamptionGraph($scope.salesSummary);
                    $scope.salesGraph($scope.salesSummary);
                    angular.forEach( $scope.filterdLists,function(selectedFingerprintInfo,index){
                        let selectedFingerprintCampaign = {
                            campaignName: selectedFingerprintInfo.campaignName,
                            campaignId:   selectedFingerprintInfo.campaignId
                        };
                        let selectedFingerprintOffer = {
                            offerName: selectedFingerprintInfo.offerName,
                            offerId:   selectedFingerprintInfo.offerId
                        };
                        $scope.campaign.push(selectedFingerprintCampaign);
                        $scope.offer.push(selectedFingerprintOffer);
                    });
                }
                $scope.fingerprintFilterApply = function(){
                    if($scope.isFingerprintChecked.data) {
                        let idInString = $scope.ids.toString();
                        let merchantRefId = {
                            MerchantToken: locker.driver("local").namespace("core").get("merchantToken"),
                            FingerprintId: idInString

                        };
                        if ($scope.analyticscampaigntype.value == 'Mobile'){
                            Analytics.getFilterData(merchantRefId).then(response => {
                                $scope.applyfingerfilter(response);
                        });
                        }else if ($scope.analyticscampaigntype.value == 'Social'){
                        Analytics.getSocialFilterData(merchantRefId).then(response => {
                            $scope.applyfingerfilter(response);
                        });
                        }

                }
                else{
                    let merchantRefId = {
                        MerchantToken: locker.driver("local").namespace("core").get("merchantToken")
                    };
                    $scope.filterdLists = $scope.campaignInfo;
                    let overallResponse= $scope.campaignAll;
                    $scope.salesSummary = overallResponse[0];
                    $scope.camapignGraph( $scope.salesSummary);
                    $scope.redamptionGraph($scope.salesSummary);
                    $scope.salesGraph($scope.salesSummary);
                    $scope.initFilterData();

                }

            };

              $scope.startDate = function(selectedStartDate, isSelect){
                  if(isSelect){
                      startDate = $filter('date')(selectedStartDate,'yyyy-MM-dd');
                  }
              };
                $scope.applyenddate = function(response){
                    $scope.filterdLists = (response.FlikResponse.Data.AnalyticsFiltering.AnalyticsResult);
                    let overallResponse =  (response.FlikResponse.Data.AnalyticsFiltering.TotalAnalyticsResult);
                    $scope.salesSummary = overallResponse[0];
                    $scope.camapignGraph( $scope.salesSummary);
                    $scope.redamptionGraph($scope.salesSummary);
                    $scope.salesGraph($scope.salesSummary);
                }
              $scope.endDate = function(selectedEndDate, isSelect){
                  let endDate;
                  if(isSelect){
                      endDate = $filter('date')(selectedEndDate,'yyyy-MM-dd');
                  }
                  let merchantRefId = {
                      MerchantToken: locker.driver("local").namespace("core").get("merchantToken"),
                      DateStart: startDate,
                      DateEnd: endDate
                  };
                  if ($scope.analyticscampaigntype.value == 'Mobile'){
                      Analytics.getFilterData(merchantRefId).then(response => {
                          $scope.applyenddate(response);
                  });
              }else if ($scope.analyticscampaigntype.value == 'Social'){
                Analytics.getSocialFilterData(merchantRefId).then(response => {
                 $scope.applyenddate(response);
                });
                }
          };

        let merchantRefId = {
            MerchantToken: locker.driver("local").namespace("core").get("merchantToken")

        };
        if( $scope.campaignAll.length > 0) {
            let overallResponse = $scope.campaignAll;
            $scope.salesSummary = overallResponse[0];
            $scope.camapignGraph($scope.salesSummary);
            $scope.redamptionGraph($scope.salesSummary);
            $scope.salesGraph($scope.salesSummary);
        }

        $scope.filterByCampaign = function(Id) {
            if($scope.ischecked.data[Id])
            {
                $scope.ids.push(Id);
            }
            else
            {
                angular.forEach($scope.ids, function(uncheckedId,index){
                    if(Id === uncheckedId ){
                        $scope.ids.splice(index,1);

                    }
                });
            }

        };
        /*filter by offer */
        $scope.filterByOffer = function(Id) {
            if($scope.ischecked.data[Id]) {
                $scope.ids.push(Id);
            }
            else
            {
                angular.forEach($scope.ids, function(uncheckedId,index){
                    if(Id === uncheckedId ){
                        $scope.ids.splice(index,1);
                    }
                });
            }
        };

        /* filter by finger print */
        $scope.filterByFingerPrint = function(Id){

            if($scope.ischecked.data[Id]) {
                $scope.ids.push(Id);
            }
            else
            {
                angular.forEach($scope.ids, function(uncheckedId,index){
                    if(Id === uncheckedId ){
                        $scope.ids.splice(index,1);
                    }
                });
            }
        };


        /*  pdf generator*/
        $scope.printPdf = function(participant, redemption, sales){
            var participant = $filter('number')(participant.toString());
            var redemption  = $filter('percentage')(redemption.toString());
            var sales       = $filter('currency')(sales.toString(),'$',0);
            html2canvas($("#graphPdf").get(0), {
                onrendered: function(canvas) {

                    var imgData = canvas.toDataURL('image/png');
                    //console.log('Report Image URL: '+imgData);
                    var PDF = new jsPDF('p', 'pt');
                    PDF.setTextColor(67, 108, 155);
                    PDF.text("Overall",40,80);
                    PDF.text("Overall",270,80);
                    PDF.text("Overall",500,80);
                    PDF.text("Participant",40,150);
                    PDF.setTextColor(208, 138, 24);
                    PDF.text("Redemption",270,150);
                    PDF.setTextColor(43, 171, 179);
                    PDF.text("Sales",500,150);
                    PDF.setTextColor(100, 100, 100);
                    PDF.text(participant,40,110);
                    PDF.text(redemption,270,110);
                    PDF.text(sales,490,110);
                    PDF.setTextColor(100, 100, 100);
                    PDF.text("Analytics Report", 250,50);
                    PDF.addImage(imgData, 'PNG', 40, 200, 803,230);
                    var header = function (x, y, width, height, key, value, settings) {
                        PDF.setFillColor(26, 188, 156); // Asphalt
                        PDF.setTextColor(255, 255, 255);
                        PDF.setFontStyle('bold');
                        PDF.rect(x, y, width, height, 'F');
                        y += settings.lineHeight / 2 + PDF.internal.getLineHeight() / 2;
                        PDF.text(value, x + settings.padding, y);
                    };
                    var res = PDF.autoTableHtmlToJson(document.getElementById("CampaignTable"), true);
                    PDF.autoTable(res.columns, res.data, { startY: 500, renderHeaderCell: header, overflow: 'linebreak'});
                    PDF.save('Analytics.pdf');

                },
                width:2000,
                height:400,
                taintTest: true,
                logging:true,
                letterRendering:true,
                timeout: 60000,
                allowTaint:true
            });

            //var source = $('#graphPdf')[0];
            //var specialElementHandlers = {
            //  // element with id of "bypass" - jQuery style selector
            //  '#bypassme': function (element, renderer) {
            //    // true = "handled elsewhere, bypass text extraction"
            //    return true
            //  }
            //};
            //var margins = {
            //  top: 80,
            //  bottom: 60,
            //  left: 20,
            //  width: 522
            //
            //
            //};
            //PDF.fromHTML(
            //  source, // HTML string or DOM elem ref.
            //  margins.left, // x coord
            //  margins.top, { // y coord
            //    'width': margins.width, // max width of content on PDF
            //    'elementHandlers': specialElementHandlers
            //  });

        };
                    }

        if ($scope.analyticscampaigntype.value == 'Mobile'){
            Analytics.getFilterData(merchantRef).then(resp =>{
            $scope.campaignAll = resp.FlikResponse ? resp.FlikResponse.Data.AnalyticsFiltering.TotalAnalyticsResult : [];
            tempcampall = $scope.campaignAll;
            $scope.updatecampfilterresponse(tempcampall);

            },error => {
            $scope.toggleWizardLoader.showLoader = false;
            $mdToast.show(
                $mdToast.simple()
                    .content("Error in loading filter data")
                    .position("top right")
                    .hideDelay(2700)
            );

            });
        }else if ($scope.analyticscampaigntype.value == 'Social'){
            Analytics.getSocialFilterData(merchantRef).then(resp =>{
            $scope.campaignAll = resp.FlikResponse ? resp.FlikResponse.Data.AnalyticsFiltering.TotalAnalyticsResult : [];
            tempcampall = $scope.campaignAll;
            $scope.updatecampfilterresponse(tempcampall);

            },error => {
            $scope.toggleWizardLoader.showLoader = false;
            $mdToast.show(
                $mdToast.simple()
                    .content("Error in loading filter data")
                    .position("top right")
                    .hideDelay(2700)
            );

            });
        }

        }else{
            $scope.toggleWizardLoader.showLoader = false;
            $mdToast.show(
                $mdToast.simple()
                    .content(statusMessage)
                    .position("top right")
                    .hideDelay(2700)
            );
            }
    }

            $scope.updateanalytics = function(){
                if ($scope.analyticscampaigntype.value == 'Mobile'){
                    Analytics.getCampaignAll(merchantRef).then(response =>{
                        let statusCode = response.FlikResponse.Status.StatusCode;
                    let statusMessage = response.FlikResponse.Status.StatusMessage;
                    $scope.updatecampresponse(response,statusCode,statusMessage);
                },error =>{
                    $scope.toggleWizardLoader.showLoader = false;
                    $mdToast.show(
                        $mdToast.simple()
                            .content("Error in getting campaign Data")
                            .position("top right")
                            .hideDelay(2700)
                    );
                });

            }else if ($scope.analyticscampaigntype.value == 'Social'){
            Analytics.getSocialCampaignAll(merchantRef).then(response =>{
            let statusCode = response.FlikResponse.Status.StatusCode;
            let statusMessage = response.FlikResponse.Status.StatusMessage;
            $scope.updatecampresponse(response,statusCode,statusMessage);
            },error =>{
             $scope.toggleWizardLoader.showLoader = false;
            $mdToast.show(
            $mdToast.simple()
                .content("Error in getting campaign Data")
                .position("top right")
                .hideDelay(2700)
            );
            });
            }
            }
            $scope.updateanalytics();

          },
          resolve: {
            deps: ['$ocLazyLoad',
              function( $ocLazyLoad ) {
                return $ocLazyLoad.load(['vr.directives.slider','ui.select']).then(
                  function(){
                    return $ocLazyLoad.load('transpiled/js/controllers/core.dashboard.js');
                  });
              }
            ]
          }
        })
        .state('core.home.fingerprint', {
          url: '/fingerprint',
          controller: 'CoreFingerprintCreateCtrl',
          resolve: {

                //fetchCauses: function(Fingerprint, $stateParams, locker){
                //  let merchantToken ={
                //    MerchantToken: locker.driver("local").namespace("core").get("merchantToken")
                //  }
                //  return Fingerprint.causeGetAll(merchantToken).then(resp => {
                //    return resp;
                //  }, error => {
                //    return error;
                //  });
                //},

            deps: ['$ocLazyLoad',
              function( $ocLazyLoad ) {
                return $ocLazyLoad.load(['vr.directives.slider', 'ui.select']).then(
                  function() {
                    return $ocLazyLoad.load('transpiled/js/controllers/core.fingerprint.create.js');
                  }
                );
              }
            ]
          },
          views: {
            'dashboardFOC': {
              templateUrl: 'templates/blocks/fingerprint_create.html',
              controller: function($scope, $filter) {

                // let causeResp = fetchCauses ? fetchCauses.FlikResponse.Data.MerchantCauseAllAll : [];
                // $scope.causes     = causeResp;
              }
            }
          }
        })
        .state('core.home.offer', {
          url: '/offer',
          resolve: {
            deps: ['$ocLazyLoad',
              function( $ocLazyLoad ) {
                return $ocLazyLoad.load(['vr.directives.slider', 'ui.select']).then(
                  function() {
                    return $ocLazyLoad.load('transpiled/js/controllers/core.offer.create.js');
                  }
                );
              }
            ]
          },
          views: {
            'dashboardFOC': {
              templateUrl: 'templates/blocks/offer_create.html'
            }
          }
        })
        .state('core.home.campaign', {
          url: '/campaign',
          resolve: {
            deps: ['$ocLazyLoad',
              function( $ocLazyLoad ) {
                return $ocLazyLoad.load(['vr.directives.slider', 'ui.select']).then(
                  function() {
                    return $ocLazyLoad.load('transpiled/js/controllers/core.campaign.create.js');
                  }
                );
              }
            ]
          },
          views: {
            'dashboardFOC': {
              templateUrl: 'templates/blocks/campaign_create.html'
            }
          }
        })
        .state('core.profile', {
          url: '/profile',
          templateUrl: 'templates/core_profile.html',
          resolve: {
            //fetchProductRows:  function(Merchant, $stateParams, locker) {
            //    alert("re");
            //  let merchantRef = {
            //    MerchantToken: locker.driver("local").namespace("core").get("merchantToken")
            //  }
            //  console.log("this is the merchantRef " + JSON.stringify(merchantRef, null, 4));
            //  return Merchant.getAllProductRow(merchantRef).then(resp => {
            //    return resp;
            //  })
            //},
            deps: ['$ocLazyLoad',
              function( $ocLazyLoad ) {
                return $ocLazyLoad.load('angularFileUpload').then(
                  function() {
                    return $ocLazyLoad.load(['transpiled/js/controllers/core.profile.js', 'transpiled/js/controllers/core.merchant.table.js']);
                  }
                );
              }
            ]
          },
          controller: function($scope, $rootScope, Analytics,Product,Beacon,Cause,Store) {
            $scope.allData = $rootScope.allData;

            $scope.productWithTransactionRows = {
                allProductWithTransactionRows: $scope.allData.productsWithTransaction.list
            };

            $scope.loyaltyRows = {
              allLoyaltyRows:$scope.allData.loyalty.list
            };

            $scope.consumer = {};
            $scope.consumer_recommendations = {}
            /**
             * consumer get all function to get consumer
             *
             */
            $scope.allConsumer = function(){
              let numberOfConsumer = {
                NumberOfConsumer : $scope.consumer.range,
                MerchantToken    :locker.driver("local").namespace("core").get("merchantToken")
              };

              Analytics.getConsumerAll(numberOfConsumer).then(response =>{
                let statusCode = response.FlikResponse.Status.StatusCode;
                let statusMessage = response.FlikResponse.Status.StatusMessage;
                if(statusCode == 0){
                  $scope.ConsumerRows = {
                    allConsumerRows:response.FlikResponse.Data.Merchant.Consumers
                  }
                }

              });

            };
            $scope.allConsumerRecommendation = function(){
                let numberOfConsumer = {
                    NumberOfConsumer : $scope.consumer_recommendations.range,
                    MerchantToken    : locker.driver("local").namespace("core").get("merchantToken")
                };

                Analytics.getConsumerrecommendationsAll(numberOfConsumer).then(response =>{
                let statusCode = response.FlikResponse.Status.StatusCode;
                let statusMessage = response.FlikResponse.Status.StatusMessage;
                if(statusCode == 0){
                    $scope.ConsumerRecommendationRows = {
                        allConsumerRecommendationRows:response.FlikResponse.Data.Merchant.Consumers
                    }
                }
            });

            };

$scope.item_similarity = {};

$scope.itemSimilarity = function(){
    let numberOfItems = {
        ConsumerNumber : $scope.item_similarity.range,
        MerchantToken    : locker.driver("local").namespace("core").get("merchantToken")
    };

    Analytics.getItemSimilarityAll(numberOfItems).then(response =>{
        let statusCode = response.FlikResponse.Status.StatusCode;
    let statusMessage = response.FlikResponse.Status.StatusMessage;
    if(statusCode == 0){
        $scope.ItemSimilarityRows = {
            allConsumerRecommendationRows:response.FlikResponse.Data.Recommendation.ConsumerRecommendation
        }

    }
});

};

        $scope.product_correlations = {};
        $scope.allProductCorrelations = function(){
           let MerchantToken = {
              MerchantToken    : locker.driver("local").namespace("core").get("merchantToken")
        };
           Analytics.getProductCorrelationsAll(MerchantToken).then(response =>{
              let statusCode = response.FlikResponse.Status.StatusCode;
              let statusMessage = response.FlikResponse.Status.StatusMessage;
              if(statusCode == 0){
                 $scope.ProductCorrelationsRows = {
                 allProductCorrelationsRows:response.FlikResponse.Data.Merchant.Consumers
                 }
              }
           });

        };

        $scope.campaigns = {};
        $scope.allCampaigns = function(){
    let MerchantToken = {
        MerchantToken    : locker.driver("local").namespace("core").get("merchantToken")
    };
    Analytics.getCampaignAll(MerchantToken).then(response =>{
        let statusCode = response.FlikResponse.Status.StatusCode;
    let statusMessage = response.FlikResponse.Status.StatusMessage;
    if(statusCode == 0){
        $scope.campaignRows = {
            allCampaignRows:response.FlikResponse.Data.Merchant.Consumers
        }
    }
});

};

$scope.beacons = {};
$scope.allBeacons = function(){
    let MerchantToken = {
        MerchantToken    : locker.driver("local").namespace("core").get("merchantToken")
    };
    Beacon.beaconGetAll(MerchantToken).then(response =>{
        let statusCode = response.FlikResponse.Status.StatusCode;
    let statusMessage = response.FlikResponse.Status.StatusMessage;
    if(statusCode == 0){
        $scope.beaconRows = {
            allBeaconRows:$scope.allData.beacons.list
        };
    }
});

};

$scope.cause = {};
$scope.allCauses = function(){
    let MerchantToken = {
        MerchantToken    : locker.driver("local").namespace("core").get("merchantToken")
    };
    Cause.causeGetAll(MerchantToken).then(response =>{
        let statusCode = response.FlikResponse.Status.StatusCode;
    let statusMessage = response.FlikResponse.Status.StatusMessage;
    if(statusCode == 0){
        $scope.causeRows = {
            allCauseRows:$scope.allData.causes.list
        };
    }
});

};

$scope.store = {};
$scope.allStores = function(){
    let MerchantToken = {
        MerchantToken    : locker.driver("local").namespace("core").get("merchantToken")
    };
    Store.storeGetAll(MerchantToken).then(response =>{
        let statusCode = response.FlikResponse.Status.StatusCode;
    let statusMessage = response.FlikResponse.Status.StatusMessage;
    if(statusCode == 0){
        $scope.storesRows = {
            allStoreRows:$scope.allData.stores.list
        };
    }
});

};

$scope.product = {};
$scope.allProducts = function(){
    let MerchantToken = {
        MerchantToken    : locker.driver("local").namespace("core").get("merchantToken")
    };
    Product.getAll(MerchantToken).then(response =>{
        let statusCode = response.FlikResponse.Status.StatusCode;
    let statusMessage = response.FlikResponse.Status.StatusMessage;
    if(statusCode == 0){
        $scope.productRows = {
            allProductRows: $scope.allData.products.list
        };
    }
});

};
            /**
             * consumer transaction function to get transaction of consumer
             *
             */
            $scope.consumerTransaction = {};
            $scope.consumerTransaction = function(){
              let transactionData = {
                NumberOfTransactions: $scope.consumerTransaction.range,
                  MerchantToken    :locker.driver("local").namespace("core").get("merchantToken")
              };
              Analytics.getConsumerTransactionAll(transactionData).then(response =>{
                let statusCode = response.FlikResponse.Status.StatusCode;
                let statusMessage = response.FlikResponse.Status.StatusMessage;
                if(statusCode == 0){
                  $scope.ConsumerTransactionRows = {
                    allConsumerTransactionRows:response.FlikResponse.Data.Merchant.ConsumerTransactions
                  }
                }
              });
            };

$scope.productWithTransaction = {};
$scope.productWithTransaction = function(){

    let MerchantToken = {
        MerchantToken    : locker.driver("local").namespace("core").get("merchantToken")
    };
    Analytics.getProductWithTransactionAll(MerchantToken).then(response =>{
        let statusCode = response.FlikResponse.Status.StatusCode;
    let statusMessage = response.FlikResponse.Status.StatusMessage;
    if(statusCode == 0){
        $scope.productWithTransactionRows = {
            allProductWithTransactionRows:response.FlikResponse.Data.Merchant.ProductsWithTransactions
        }
    }
});
};


            //let productRowResp = fetchProductRows.FlikResponse.Data;
            //let pRowList = productRowResp.MerchantProductAll.ProductList;
            //console.log(JSON.stringify(pRowList, null, 4));

            //$scope.productRows = {
            //  allProductRows: pRowList
            //}

            //console.warn(`this is pList ${JSON.stringify($scope.productRows, null, 4)}`);
          }
        })
        .state('core.view', {
          url: '/view',
          abstract: true,
          template: '<div ui-view class="fade-in"></div>'
        })
        .state('core.view.fingerprints', {
          url: '/fingerprints',
          templateUrl: 'templates/core_fingerprints.html',
          resolve: {
            deps: ['$ocLazyLoad',
              function( $ocLazyLoad ) {
                return $ocLazyLoad.load(['vr.directives.slider', 'ui.select']).then(
                  function() {
                    return $ocLazyLoad.load('transpiled/js/app/fingerprints/fingerprints.js');
                  }
                );
              }
            ]
          }
        })
        .state('core.view.fingerprints.create', {
          url: '/create',
          resolve: {
            deps: ['$ocLazyLoad',
              function( $ocLazyLoad ) {
                return $ocLazyLoad.load(['vr.directives.slider', 'ui.select']).then(
                  function() {
                    return $ocLazyLoad.load('transpiled/js/controllers/core.fingerprint.create.js');
                  }
                );
              }
            ]
          },
          views: {
            'fingerprintWidget': {
              templateUrl: 'templates/blocks/fingerprint_create.html'
            }

          }
        })
        .state('core.view.fingerprints.update', {
          url: '/:id/update',
          resolve: {
            //fetchSocialData: function (Fingerprint, $stateParams, locker){
            //  let merchantRef = {
            //    MerchantToken: locker.driver("local").namespace("core").get("merchantToken"),
            //    MerchantFingerprintId:$stateParams.id
            //  }
            //  return Fingerprint.getSocialHistory(merchantRef).then(resp => {
            //    return resp;
            //  })
            //},
            fetchStoreData: function(Fingerprint, $stateParams,locker){
              let merchantRef = {
                MerchantToken: locker.driver("local").namespace("core").get("merchantToken")
              }
              return Fingerprint.storeGetAll(merchantRef).then(resp =>{
                return resp;
              })
            },
            deps: ['$ocLazyLoad',
              function( $ocLazyLoad ) {
                return $ocLazyLoad.load(['vr.directives.slider', 'ui.select']).then(
                  function() {
                    return $ocLazyLoad.load('transpiled/js/controllers/core.fingerprint.update.js');
                  }
                );
              }
            ]
          },
          views: {
            'fingerprintWidget': {
              templateUrl: 'templates/blocks/fingerprint_update.html',
              controller: function($scope, $rootScope, $stateParams, $filter, fetchStoreData, Fingerprint) {
                      $scope.allFingerprints = {};
                      $scope.allFingerprintLocations = {};
                      $scope.allFingerprintTransactions = {};
                $rootScope.allData.fingerprints.storeTransactions.list = fetchStoreData.FlikResponse.Status.StatusCode = 0 ? fetchStoreData.FlikResponse.Data.MerchantFingerPrintStore.GetAll : [];
                $rootScope.allData.fingerprints.storeTransactions.count = fetchStoreData.FlikResponse.Status.StatusCode = 0 ? fetchStoreData.FlikResponse.Data.MerchantFingerPrintStore.GetAll.length : 0;
                let socialTransactions    = $rootScope.allData.fingerprints.socialTransactions.list;
                let fingerprintId         = $stateParams.id;
                locker.driver("session").namespace("fingerprintCreate").put("activeFingerprintId", fingerprintId);
                      let merchantToken =  locker.driver("local").namespace("core").get("merchantToken");
                      Fingerprint.FingerprintAllData(merchantToken).then(function(resp) {

                          $scope.allFingerprints = resp.MerchantFingerprintAll;
                          $scope.allFingerprintLocations = resp.FingerprintLocationAll;
                          $scope.allFingerprintTransactions = resp.FingerprintTransactionAll;

                          $scope.toggleWizardLoader.showLoader = false;

                //let fingerprintList       = $rootScope.allData.fingerprints.list;
                //let locationList          = $rootScope.allData.fingerprints.locations.list;
                //let transactionList       = $rootScope.allData.fingerprints.transactions.list;
                      let fingerprintList       = $scope.allFingerprints;
                      let locationList          = $scope.allFingerprintLocations;
                      let transactionList       = $scope.allFingerprintTransactions;
                let causeList             = $rootScope.allData.fingerprints.causeTransactions.list;
                let productList           = $rootScope.allData.products.list;
                let productWithTransactionList = $rootScope.allData.productsWithTransaction.list;
                let storeTransactionList  = $rootScope.allData.fingerprints.storeTransactions.list;
                let storeList             = $rootScope.allData.stores.list;
                let beaconTransactionList = $rootScope.allData.fingerprints.beaconTransactions.list;
                let beaconList            = $rootScope.allData.beacons.list;

                $scope.causes = causeList;
                $scope.fingerprintData = {
                  fingerprint: $filter('where')(fingerprintList, {fingerprintId: fingerprintId}),
                  locations: $filter('where')(locationList, {merchantFingerprintId: fingerprintId}),
                  transactions: $filter('where')(transactionList, {merchantFingerprintId: fingerprintId})
                }
                let shouldShowLocation = Object.keys($scope.fingerprintData.locations).length > 0 ? true : false;
                let shouldShowTransaction = Object.keys($scope.fingerprintData.transactions).length > 0 ? true : false;
                if(shouldShowLocation){
                  locker.driver("session").namespace("fingerprintCreate").put("activeFingerprintLocationId",  $scope.fingerprintData.locations[0].merchantFingerprintLocationId);
                }else{
                  locker.driver("session").namespace("fingerprintCreate").forget("activeFingerprintLocationIds");
                }

                if(shouldShowTransaction){
                  locker.driver("session").namespace("fingerprintCreate").put("activeFingerprintTransactionId", $scope.fingerprintData.transactions[0].merchantFingerprintTransactionId);
                }else{
                  locker.driver("session").namespace("fingerprintCreate").forget("activeFingerprintTransactionId");
                }


                $scope.socialFingerprintData = {
                  transactions: $filter('where')(socialTransactions, {merchantFingerprintId: fingerprintId})
                }
                let shouldShowSocialTransaction = Object.keys($scope.socialFingerprintData.transactions).length > 0 ? true : false;
                if(shouldShowSocialTransaction){
                  locker.driver("session").namespace("fingerprintCreate").put("activeFingerprintSocialTransactionId", $scope.socialFingerprintData.transactions[0].merchantFingerprintProductId);
                }else{
                  locker.driver("session").namespace("fingerprintCreate").forget("activeFingerprintSocialTransactionId");
                }

                $scope.causeFingerprintData = {
                  transactions: $filter('where')(causeList, {merchantFingerprintId: fingerprintId})
                }
                let shouldShowCauseTransaction = Object.keys($scope.causeFingerprintData.transactions).length > 0 ? true : false;
                if(shouldShowCauseTransaction){
                  locker.driver("session").namespace("fingerprintCreate").put("activeFingerprintCauseTransactionId",  $scope.causeFingerprintData.transactions[0].merchantFingerprintCauseId);
                }else{
                  locker.driver("session").namespace("fingerprintCreate").forget("activeFingerprintCauseTransactionId");
                }


                $scope.storeFingerprintData = {
                  transactions: $filter('where')(storeTransactionList, {merchantFingerprintId: fingerprintId})
                }


                $scope.beaconFingerprintData = {
                  transactions : $filter('where')(beaconTransactionList,{merchantFingerprintId : fingerprintId})
                }

                let shouldShowBeacon = Object.keys($scope.beaconFingerprintData.transactions).length > 0 ? true : false;
                let shouldShowStore  = Object.keys($scope.storeFingerprintData.transactions).length > 0 ? true : false;
                if(shouldShowBeacon && !shouldShowStore){
                  locker.driver("session").namespace("fingerprintCreate").put("activeFingerprintBeaconTransactionId", $scope.beaconFingerprintData.transactions[0].merchantFingerprintBeaconsId);
                  locker.driver("session").namespace("fingerprintCreate").put("activeFingerprintStoreTransactionId", fingerprintId);
                  let beaconId = $scope.beaconFingerprintData.transactions[0].beaconId;
                  let storeId  = $scope.beaconFingerprintData.transactions[0].storeId;
                    $scope.fingerprintStoreAddresses = {
                      selected:$filter('where')(storeList,{storeId: storeId})[0]
                    }
                  locker.namespace("fingerprintCreate")
                    .bind($scope, "fingerprintBeaconAddresses.selected");
                  $scope.fingerprintBeaconAddresses = {
                    selected: $filter('where')(beaconList,{beaconId: beaconId})[0]
                  }
                
                }else if(!shouldShowBeacon && shouldShowStore){
                   locker.driver("session").namespace("fingerprintCreate").put("activeFingerprintStoreTransactionId", $scope.storeFingerprintData.transactions[0].merchantFingerprintStoreId);
                  locker.driver("session").namespace("fingerprintCreate").forget("activeFingerprintBeaconTransactionId");
                  let storeId = $scope.storeFingerprintData.transactions[0].storeId;
                  locker.namespace("fingerprintCreate")
                    .bind($scope, "fingerprintStoreAddresses.selected");
                  $scope.fingerprintStoreAddresses = {
                    selected:$filter('where')(storeList,{storeId: storeId})[0]
                  }
                }else if(!shouldShowBeacon && !shouldShowStore){
                  locker.driver("session").namespace("fingerprintCreate").forget("activeFingerprintBeaconTransactionId");
                  locker.driver("session").namespace("fingerprintCreate").forget("activeFingerprintStoreTransactionId");
                }
//                if(shouldShowBeacon){
//                  locker.driver("session").namespace("fingerprintCreate").put("activeFingerprintBeaconTransactionId", $scope.beaconFingerprintData.transactions[0].merchantFingerprintBeaconsId);
//                  locker.driver("session").namespace("fingerprintCreate").forget("activeFingerprintStoreTransactionId");
//                  let beaconId = $scope.beaconFingerprintData.transactions[0].beaconId;
//                  let storeId  = $scope.beaconFingerprintData.transactions[0].storeId;
//                    $scope.fingerprintStoreAddresses = {
//                      selected:$filter('where')(storeList,{storeId: storeId})[0]
//                    }
//                  locker.namespace("fingerprintCreate")
//                    .bind($scope, "fingerprintBeaconAddresses.selected");
//                  $scope.fingerprintBeaconAddresses = {
//                    selected: $filter('where')(beaconList,{beaconId: beaconId})[0]
//                  }
//                }else{
//                  locker.driver("session").namespace("fingerprintCreate").forget("activeFingerprintBeaconTransactionId");
//                }
//                if(shouldShowStore && !shouldShowBeacon){
//                  locker.driver("session").namespace("fingerprintCreate").put("activeFingerprintStoreTransactionId", $scope.storeFingerprintData.transactions[0].merchantFingerprintStoreId);
//                  let storeId = $scope.storeFingerprintData.transactions[0].storeId;
//                  locker.namespace("fingerprintCreate")
//                    .bind($scope, "fingerprintStoreAddresses.selected");
//                  $scope.fingerprintStoreAddresses = {
//                    selected:$filter('where')(storeList,{storeId: storeId})[0]
//                  }
//                }else{
//                  locker.driver("session").namespace("fingerprintCreate").forget("activeFingerprintStoreTransactionId");
//                }
                let thisFingerprint = $scope.fingerprintData.fingerprint[0];
                if( $scope.fingerprintData.locations. length > 0) {
                  let formattedAddresses = [$scope.fingerprintData.locations[0].streetAddress , $scope.fingerprintData.locations[0].city , $scope.fingerprintData.locations[0].state , $scope.fingerprintData.locations[0].country];
                  let formattedAddress = formattedAddresses.join(',');
                  let locationData = { 
                    formatted_address:formattedAddress,
                    latitude: $scope.fingerprintData.locations[0].latitude,
                    longitude: $scope.fingerprintData.locations[0].longitude,
                    street   : $scope.fingerprintData.locations[0].streetAddress,
                    city          : $scope.fingerprintData.locations[0].city,
                    state         : $scope.fingerprintData.locations[0].state,
                    country       : $scope.fingerprintData.locations[0].country
                  };
                  locker.namespace("fingerprintCreate")
                    .bind($scope, "fingerprintLocationAddresses.selected");
                  $scope.fingerprintLocationAddresses.selected =  locationData;
                }
                  
                 
                locker.namespace("fingerprintCreate")
                  .bind($scope, "radius.selected");
                 $scope.radius =[
                  {radius:"1"},
                  {radius:"5"},
                  {radius:"10"},
                  {radius:"15"},
                  {radius:"20"}
                ];

                let radius = (fingerprintList,{fingerprintId:fingerprintId})[0] = "undefined" ? " ": $filter('where')(fingerprintList,{fingerprintId:fingerprintId})[0].radius;
                $scope.radius.selected = {radius:radius};

                locker.namespace("fingerprintCreate")
                  .bind($scope, "gender.filter");
                $scope.gender = {
                  filter: thisFingerprint = "undefined" ? " " : thisFingerprint.gender
                }

                let filter = {
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
                  logicPurchased : "NOTBOUGHT"
                };

                locker.namespace("fingerprintCreate")
                  .bind($scope, "conBuysLists");
                //$scope.conBuysLists = $scope.fingerprintData.transactions.length > 0 ? [] : [filter];
                $scope.conBuysLists = [];
                $scope.fingerprintData.transactions.forEachCat(transaction => {
                  $scope.conBuysLists.push({
                    filter: {
                      id: transaction.merchantFingerprintTransactionId,
                      productCat: {
                        selected: $filter('where')(productList, {productCategory: transaction.productCategory})[0]
                      },
                      productBrand: {
                        selected: $filter('where')(productList, {brandName: transaction.brandName})[0]
                      },
                      productName: {
                        selected: $filter('where')(productList, {productType: transaction.productType})[0]
                      },
                      timeFrames: {
                        selected: new Date()
                      },
                      logicOperator  : transaction.logicalOperator,
                      logicPurchased : transaction.buyNotBuy
                    }
                  });
                })
                ///social
                locker.namespace("fingerprintCreate")
                  .bind($scope, "conBuysSocialLists");
                $scope.conBuysSocialLists = [];
                 $scope.socialFingerprintData.transactions.forEachCat(transaction => {
                   $scope.conBuysSocialLists.push({
                     sfilter: {
                       id: transaction.merchantFingerprintProductId,
                       productCat: {
                         selected: $filter('where')(productList, {productCategory: transaction.productCategory})[0]
                       },
                       productBrand: {
                         selected: $filter('where')(productList, {brandName: transaction.brandName})[0]
                       },
                       productName: {
                         selected: $filter('where')(productList, {productType: transaction.productType})[0]
                       },
                       timeFrames: {
                         selected: new Date()
                       },
                       logicOperator  : transaction.logicalOperator,
                       logicPurchased : transaction.likeNotLike
                     }
                   });
                 })


                ///cause
                locker.namespace("fingerprintCreate")
                  .bind($scope, "conBuysCauseLists");
                $scope.conBuysCauseLists = [];

                $scope.causeFingerprintData.transactions.forEachCat(transaction => {
                  $scope.conBuysCauseLists.push({
                    cfilter: {
                      id: transaction.merchantFingerprintCauseId,
                      causeName: {
                        selected: $filter('where')($scope.causes, {causeName: transaction.causeName})[0]
                      },
                      timeFrames: {
                        selected: new Date()
                      },
                      logicOperator  : transaction.logicalOperator,
                      logicPurchased : transaction.likeNotLike
                    }
                  });
                })
                $scope.rangeIncome = {
                  minIncome: thisFingerprint.minIncome,
                  maxIncome: thisFingerprint.maxIncome
                };
                $scope.rangeAge = {
                  minAge: thisFingerprint.minAge,
                  maxAge: thisFingerprint.maxAge
                };
                $scope.checkModel = {
                  male   : thisFingerprint.gender,
                  female : thisFingerprint.gender
                };
          });
          }
            }
          }
        })
        .state('core.view.offers', {
          url: '/offers',
          templateUrl: 'templates/core_offers.html',
          resolve: {
            deps: ['$ocLazyLoad',
              function( $ocLazyLoad ) {
                return $ocLazyLoad.load(['vr.directives.slider', 'ui.select']).then(
                  function() {
                    return $ocLazyLoad.load('transpiled/js/app/offers/offers.js');
                  }
                );
              }
            ]
          }
        })
        .state('core.view.offers.create', {
          url: '/create',
          resolve: {
            deps: ['$ocLazyLoad',
              function( $ocLazyLoad ) {
                return $ocLazyLoad.load(['vr.directives.slider', 'ui.select']).then(
                  function() {
                    return $ocLazyLoad.load('transpiled/js/controllers/core.offer.create.js');
                  }
                );
              }
            ]
          },
          views: {
            'offerWidget': {
              templateUrl: 'templates/blocks/offer_create.html'
            }
          }
        })
        .state('core.view.offers.update', {

          url: '/:id/update',
          resolve: {
            fetchOfferData: function(Offer, locker) {
              let merchantRef = {
                MerchantToken: locker.driver("local").namespace("core").get("merchantToken")
              }
              return Offer.getAllData(merchantRef).then(resp => {
                return resp;
              })
            },
            deps: ['$ocLazyLoad',
              function( $ocLazyLoad ) {
                return $ocLazyLoad.load(['vr.directives.slider', 'ui.select']).then(
                  function() {
                    return $ocLazyLoad.load('transpiled/js/controllers/core.offer.update.js');
                  }
                );
              }
            ]
          },
          views: {
            'offerWidget': {
              templateUrl: 'templates/blocks/offer_update.html',
              controller: function($scope, $rootScope, $stateParams, $filter, fetchOfferData){
                let resp         = fetchOfferData.FlikResponse.Data;
                let offerId      = $stateParams.id;
                let productList = $rootScope.allData.products.list;

                $rootScope.allData.offers.list         = resp.MerchantOfferAll;
                $rootScope.allData.offers.count        = resp.MerchantOfferAll.length;
                $rootScope.allData.offers.locations    = resp.OfferLocationAll;
                $rootScope.allData.offers.transactions = resp.OfferTransactionAll;

                $scope.creditAmounts = [
                  {amount: "1"},
                  {amount: "2"},
                  {amount: "3"},
                  {amount: "4"},
                  {amount: "5"}
                ]

                $scope.offerData = {
                  offer: $filter('where')(resp.MerchantOfferAll, {offerId: offerId}),
                  locations: $filter('where')(resp.OfferLocationAll, {merchantOfferId: offerId}),
                  transactions: $filter('where')(resp.OfferTransactionAll, {merchantOfferId: offerId})
                }
                //console.log(`this is $scope.offerData ${JSON.stringify($scope.offerData, null, 4)}`);

                locker.namespace("offerCreate")
                  .bind($scope, "offerLocationAddresses.selected");
                $scope.offerLocationAddresses.selected = $scope.offerData.locations[0];

                locker.namespace("offerCreate")
                  .bind($scope, "conBuysLists");
                $scope.conBuysLists = [];

                if ($scope.offerData.transactions.length > 0) {
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
                      offerAmount: $filter('where')($scope.creditAmounts, {amount: $scope.offerData.offer[0].offerAmount}),
                      logicOperator  : "AND",
                      logicPurchased : "NOTBOUGHT",
                      logicTransaction : "BUYS",
                      logicProductBuys : "ANY",
                      logicOfferType: "CREDIT"
                    }
                  }
                  $scope.offerData.transactions.forEachCat(transaction => {
                    $scope.conBuysLists.push({
                      filter: {
                        id: transaction.merchantOfferTransactionId,
                        productCat: {
                          selected: $filter('where')(productList, {productCategory: transaction.productCategory})[0]
                        },
                        productBrand: {
                          selected: $filter('where')(productList, {brandName: transaction.brandName})[0]
                        },
                        productName: {
                          selected: $filter('where')(productList, {productType: transaction.productType})[0]
                        },
                        timeFrames: {
                          selected: {}
                        },
                        offerAmount: {
                          amount: transaction.amount
                        },
                        logicOperator  : transaction.logicalOperator,
                        logicPurchased : transaction.buyNotBuy,
                        logicTransaction : transaction.buyNotBuy,
                        logicOfferType: "CREDIT"
                      }
                    });
                  });
                } else {
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
                      offerAmount: $filter('where')($scope.creditAmounts, {amount: $scope.offerData.offer[0].offerAmount}),
                      logicOperator  : "AND",
                      logicPurchased : "NOTBOUGHT",
                      logicTransaction : "GETS",
                      logicProductBuys : "ANY",
                      logicOfferType: "CREDIT"
                    }
                  }
                }
              }
            }
          }
        })
        .state('core.view.campaigns', {
          url: '/campaigns',
          templateUrl: 'templates/core_campaigns.html',
          resolve: {
            deps: ['$ocLazyLoad',
              function( $ocLazyLoad ) {
                return $ocLazyLoad.load(['vr.directives.slider', 'ui.select']).then(
                  function() {
                    return $ocLazyLoad.load('transpiled/js/app/campaigns/campaigns.js');
                  }
                );
              }
            ]
          }
        })
        .state('core.view.campaigns.create', {
          url: '/create',
          resolve: {
            deps: ['$ocLazyLoad',
              function( $ocLazyLoad ) {
                return $ocLazyLoad.load(['vr.directives.slider', 'ui.select']).then(
                  function() {
                    return $ocLazyLoad.load('transpiled/js/controllers/core.campaign.create.js');
                  }
                );
              }
            ]
          },
          views: {
            'campaignWidget': {
              templateUrl: 'templates/blocks/campaign_create.html'
            }
          }
        })
        .state('core.view.campaigns.update', {
          url: '/:id/update',
          resolve: {
            fetchCampaign:  function(Campaign, $stateParams, locker){
              let campaignRef = {
                CampaignId: $stateParams.id,
                MerchantToken: locker.driver("local").namespace("core").get("merchantToken")
              }
              //console.log("this is the ref " + JSON.stringify(campaignRef, null, 4));
              return Campaign.getOne(campaignRef).then(resp => {
                return resp;
              })
            },
            deps: ['$ocLazyLoad',
              function( $ocLazyLoad ) {
                return $ocLazyLoad.load(['vr.directives.slider', 'ui.select']).then(
                  function() {
                    return $ocLazyLoad.load('transpiled/js/controllers/core.campaign.update.js');
                  }
                );
              }
            ]
          },
          views: {
            'campaignWidget': {
              templateUrl: 'templates/blocks/campaign_update.html',
              controller: function($scope, fetchCampaign,$rootScope, $filter,Campaign){
                let resp = fetchCampaign.FlikResponse.Data;
                let campaign = resp.MerchantCampaign.CampaignGet;
                let activeFingerprintId = campaign.fingerprintId;
                let activeOfferId         = campaign.offerId;

                //console.log(JSON.stringify(resp, null, 4));
                $scope.campaignName = campaign.campaignName;
                $scope.campaignId   = campaign.campaignId;
                locker.namespace("campaignCreate")
                  .bind($scope, "fingerprint.selected");
                $scope.fingerprint.selected  = $filter('where')($rootScope.allData.fingerprints.list, {fingerprintId: activeFingerprintId})[0];
                locker.namespace("campaignCreate")
                  .bind($scope, "offer.selected");
                $scope.offer.selected  = $filter('where')($rootScope.allData.offers.list, {offerId: activeOfferId})[0];
              }
            }
          }
        })
        .state('core.create', {
          url: '/create',
          template: '<div ui-view class="fade-in"></div>'
        })
        .state('core.create.fingerprint', {
          url: '/fingerprint',
          templateUrl: 'templates/core_fingerprint_create.html',
          resolve: {
            deps: ['$ocLazyLoad',
              function( $ocLazyLoad ) {
                return $ocLazyLoad.load(['vr.directives.slider', 'ui.select']).then(
                    function() {
                        return $ocLazyLoad.load('transpiled/js/controllers/core.fingerprint.create.js');
                    }
                );
              }
            ]
          }
        })
        .state('core.create.offer', {
          url: '/offer',
          templateUrl: 'templates/core_offer_create.html',
          resolve: {
            deps: ['$ocLazyLoad',
              function( $ocLazyLoad ) {
                return $ocLazyLoad.load(['vr.directives.slider', 'ui.select']).then(
                  function() {
                      return $ocLazyLoad.load('transpiled/js/controllers/core.offer.create.js');
                  }
                )
              }
            ]
          }
        })
        .state('core.create.campaign', {
          url: '/campaign',
          templateUrl: 'templates/core_campaign_create.html',
          resolve: {
            deps: ['$ocLazyLoad',
              function( $ocLazyLoad ) {
                return $ocLazyLoad.load(['vr.directives.slider', 'ui.select']).then(
                  function() {
                      return $ocLazyLoad.load('transpiled/js/controllers/core.campaign.create.js');
                  }
                );
              }
            ]
          }
        })

            ////////////
            // access //
            ////////////

        .state('access', {
          url: '/access',
          template: '<div ui-view class="fade-in-right-big smooth"></div>',
          data: {
            authenticate: false
          }
        })
        .state('access.signin', {
          url: '/signin',
          templateUrl: 'templates/page_signin.html',
          resolve: {
            deps: ['uiLoad',
              function( uiLoad ) {
                return uiLoad.load( ['transpiled/js/controllers/signin.js'] );
            }]
          },
          onEnter: function($rootScope, locker) {
            /**
             * delete the merchant data
             */
            $rootScope.trashMerchantData();
          }
        })
        .state('access.signup', {
          url: '/signup',
          templateUrl: 'templates/page_signup.html',
          resolve: {
            deps: ['uiLoad',
              function( uiLoad ) {
                return uiLoad.load( ['transpiled/js/controllers/signup.js'] );
            }]
          }
        })
        .state('access.forgotpwd', {
          url: '/forgotpwd',
          templateUrl: 'templates/page_forgotpwd.html',
          resolve: {
            deps:['uiLoad',
                function(uiLoad){
                  return uiLoad.load(['transpiled/js/controllers/forget.password.js']);
            }]
          }
        })
        .state('access.404', {
          url: '/404',
          templateUrl: 'templates/page_404.html'
        });


    }
    ]
  );
