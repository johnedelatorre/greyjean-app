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

// Form controller
app.controller("CoreDashboardCtrl", ["$scope", "$rootScope", "locker", "Analytics", "$filter", "Store", "$state", "$mdToast", "$animate", "Social", "Spark", "$timeout", "Product", function ($scope, $rootScope, locker, Analytics, $filter, Store, $state, $mdToast, $animate, Social, Spark, $timeout, Product) {

    /**
     * get Dexie dbCore
     *
     */
    var dbCore = $rootScope.dbCore;
    $scope.allProducts = {};
    var paginationIteration = 1;
    var allBeforeCategoryFilter = {};

    //$scope.graphValue = [10,5,-5];
    /**
     * get merchantMe and merchantToken from Locker
     *
     */
    var merchantMe = locker.driver("local").namespace("core").get("me");
    var merchantToken = locker.driver("local").namespace("core").get("merchantToken");

    var start = 0;
    var limit = 30;
    var queryString = '';

    Product.ProductPaginateAllData(start, limit, merchantToken).then(function () {
        allBeforeCategoryFilter = Product.getProductPaginateAllData();
        $scope.allProducts = allBeforeCategoryFilter.length > 0 ? $filter('unique')(allBeforeCategoryFilter, 'productCategory') : [];
    });
    $scope.isClickedGroupBY = {};
    $scope.incomeRangeCount = 0;
    $scope.ageRangeCount = 0;
    $scope.toggleWizardLoader = {
        showLoader: false
    };
    $scope.rangeIncome = {
        minIncome: 1,
        maxIncome: 1000000
    };

    $scope.rangeAge = {
        minAge: 16,
        maxAge: 60
    };

    $scope.product = {};
    $scope.state = {};
    $scope.states = [{ "state": "Delhi" }, { "state": "Maharashtra" }, { "state": "Uttar Pradesh" }];
    $scope.city = {};
    $scope.cities = [{ "city": "pune" }, { "city": "Mumbai" }, { "city": "Gurgaon" }];
    $scope.group = {};
    $scope.groups = [{ groupBy: 'Gender' }, { groupBy: 'Income' }, { groupBy: 'Age' }];

    //delete filter
    $scope.Filterdelete = function () {
        $scope.product.selected = {};
        $scope.d3TotalParticipant = 0;
        $scope.d3TotalRedemption = 0;
        $scope.d3TotalSales = 0;
        $scope.csvData = [{ "productName": "", "totalParticipant": 0, "totalRedemption": 0, "totalSales": 0 }];
        $scope.gData = [{ "data": 0, "radius": 40, "x_axis": 30, "y_axis": 30, "color": "rgb(135,169,214)", "name": "TotalParticipant" }, { "data": 0, "radius": 40, "x_axis": 70, "y_axis": 70, "color": "rgb(210,137,99)", "name": "TotalRedemption" }, { "data": 0, "radius": 40, "x_axis": 110, "y_axis": 100, "color": "rgb(93,184,197)", "name": "TotalSales" }];
        $scope.bubbleGraph($scope.gData);
    };

    $scope.Groupfilterdelete = function () {
        $scope.group.selected = {};
        $scope.productFilter();
    };

    $scope.bubblecampaigntype = { "type": "select",
        "name": "bubblecampaignType",
        "value": "Mobile",
        "values": ["Mobile", "Social"]
    };
    $scope.addMoreProductItems = function () {
        var limit = 30;
        var start = limit * paginationIteration;

        Product.ProductPaginateAllData(start, limit, merchantToken).then(function () {

            allBeforeCategoryFilter = Product.getProductPaginateAllData();
            $scope.allProducts = $scope.allProducts.concat(allBeforeCategoryFilter.length > 0 ? $filter('unique')(allBeforeCategoryFilter, 'productCategory') : []);
        });
        paginationIteration = paginationIteration + 1;
    };

    $scope.refreshProductName = function (productName) {
        var startRefreshName = 0;
        var endRefreshName = 30;
        Product.ProductAllSearchedData(startRefreshName, endRefreshName, productName, merchantToken).then(function () {
            $scope.allProducts = Product.getProductAllSearchedData();
        });
    };
    $scope.productFilter = function () {
        $scope.toggleWizardLoader.showLoader = true;
        var productName = $scope.product.selected.productName;
        var productData = {
            Product: productName,
            MerchantToken: merchantToken
        };
        $scope.updatefilterresponse = function (statusCode, statusMessage, responseData) {
            if (statusCode == 0) {
                $scope.isEnableGroupBy = false;
                var totalParticipant = responseData == undefined ? 0 : responseData[0].totalParticipants;
                var totalRedemption = responseData[0].totalRedemptionRate == undefined ? 0 : responseData[0].totalRedemptionRate;
                var totalSales = responseData[0].totalSalesAmount == undefined ? 0 : responseData[0].totalSalesAmount;
                $scope.d3TotalParticipant = totalParticipant;
                $scope.d3TotalRedemption = totalRedemption;
                $scope.d3TotalSales = totalSales;

                //          let productName = $scope.product.selected.productName.split(',');
                $scope.csvData = [{ "productName": productName, "totalParticipant": totalParticipant, "totalRedemption": totalRedemption, "totalSales": totalSales }];
                $scope.gData = [{ "data": totalParticipant, "radius": 40, "x_axis": 30, "y_axis": 30, "color": "rgb(135,169,214)", "name": "TotalParticipant" }, { "data": totalRedemption, "radius": 40, "x_axis": 70, "y_axis": 70, "color": "rgb(210,137,99)", "name": "TotalRedemption" }, { "data": totalSales, "radius": 40, "x_axis": 110, "y_axis": 100, "color": "rgb(93,184,197)", "name": "TotalSales" }];
                $scope.bubbleGraph($scope.gData);
            }
        };

        if ($scope.bubblecampaigntype.value == 'Social') {
            Social.socialproductGet(productData).then(function (response) {
                $scope.toggleWizardLoader.showLoader = false;
                var statusCode = response.FlikResponse.Status.StatusCode;
                var statusMessage = response.FlikResponse.StatusMessage;
                var responseData = response.FlikResponse.Data.Spark.Filter;
                $scope.updatefilterresponse(statusCode, statusMessage, responseData);
            });
        } else if ($scope.bubblecampaigntype.value == 'Mobile') {
            Spark.productGet(productData).then(function (response) {
                $scope.toggleWizardLoader.showLoader = false;
                var statusCode = response.FlikResponse.Status.StatusCode;
                var statusMessage = response.FlikResponse.StatusMessage;
                var responseData = response.FlikResponse.Data.Spark.Filter;
                $scope.updatefilterresponse(statusCode, statusMessage, responseData);
            });
        }
    };

    // gender filtering

    $scope.groupByChange = function () {
        if ($scope.isClickedGroupBY.isChecked == true) {
            if ($scope.group.selected.groupBy == 'Gender') {
                $scope.genderFilter();
                $scope.isClickedGroupBY.isChecked = false;
            } else if ($scope.group.selected.groupBy == 'Income') {
                $scope.incomeFilter();
                $scope.isClickedGroupBY.isChecked = false;
            } else {
                $scope.ageFilter();
                $scope.isClickedGroupBY.isChecked = false;
            }
        }
    };

    // Income Fitering

    $scope.incomeFilter = function () {
        $scope.toggleWizardLoader.showLoader = true;
        var productName = $scope.product.selected.productName;
        var minIncome = $scope.rangeIncome.minIncome;
        var maxIncome = $scope.rangeIncome.maxIncome;
        var incomeData = {
            Product: productName,
            MinIncome: minIncome,
            MaxIncome: maxIncome,
            MerchantToken: merchantToken
        };
        Spark.productGet(incomeData).then(function (response) {
            $scope.toggleWizardLoader.showLoader = false;
            var statusCode = response.FlikResponse.Status.StatusCode;
            var statusMessage = response.FlikResponse.StatusMessage;
            var responseData = response.FlikResponse.Data.Spark.Filter;
            if (statusCode == 0) {
                var totalParticipant = responseData == undefined ? 0 : responseData[0].totalParticipants;
                var totalRedemption = responseData == undefined ? 0 : responseData[0].totalRedemptionRate;
                var totalSales = responseData == undefined ? 0 : responseData[0].totalSalesAmount;
                $scope.d3TotalParticipant = totalParticipant;
                $scope.d3TotalRedemption = totalRedemption;
                $scope.d3TotalSales = totalSales;
                $scope.csvData = [{ "productName": productName, "totalParticipant": totalParticipant, "totalRedemption": totalRedemption, "totalSales": totalSales }];
                $scope.gData = [{ "data": totalParticipant, "radius": 40, "x_axis": 30, "y_axis": 30, "color": "rgb(135,169,214)", "name": "TotalParticipant" }, { "data": totalRedemption, "radius": 40, "x_axis": 70, "y_axis": 70, "color": "rgb(210,137,99)", "name": "TotalRedemption" }, { "data": totalSales, "radius": 40, "x_axis": 110, "y_axis": 100, "color": "rgb(93,184,197)", "name": "TotalSales" }];
                $scope.bubbleGraph($scope.gData);
            } else {

                $mdToast.show($mdToast.simple().content(statusMessage).position("top right").hideDelay(2700));
            }
        }, function (error) {
            $scope.toggleWizardLoader.showLoader = false;
            $mdToast.show($mdToast.simple().content("error in getting Income filter data please try again").position("top right").hideDelay(2700));
        });
    };
    // Age Filtering
    $scope.ageFilter = function () {
        $scope.toggleWizardLoader.showLoader = true;
        var productName = $scope.product.selected.productName;
        var minAge = $scope.rangeAge.minAge;
        var maxAge = $scope.rangeAge.maxAge;
        var incomeData = {
            Product: productName,
            MinAge: minAge,
            MaxAge: maxAge,
            MerchantToken: merchantToken
        };
        Spark.productGet(incomeData).then(function (response) {
            $scope.toggleWizardLoader.showLoader = false;
            var statusCode = response.FlikResponse.Status.StatusCode;
            var statusMessage = response.FlikResponse.StatusMessage;
            var responseData = response.FlikResponse.Data.Spark.Filter;
            if (statusCode == 0) {
                var totalParticipant = responseData == undefined ? 0 : responseData[0].totalParticipants;
                var totalRedemption = responseData == undefined ? 0 : responseData[0].totalRedemptionRate;
                var totalSales = responseData == undefined ? 0 : responseData[0].totalSalesAmount;
                $scope.d3TotalParticipant = totalParticipant;
                $scope.d3TotalRedemption = totalRedemption;
                $scope.d3TotalSales = totalSales;
                $scope.csvData = [{ "productName": productName, "totalParticipant": totalParticipant, "totalRedemption": totalRedemption, "totalSales": totalSales }];
                $scope.gData = [{ "data": totalParticipant, "radius": 40, "x_axis": 30, "y_axis": 30, "color": "rgb(135,169,214)", "name": "TotalParticipant" }, { "data": totalRedemption, "radius": 40, "x_axis": 70, "y_axis": 70, "color": "rgb(210,137,99)", "name": "TotalRedemption" }, { "data": totalSales, "radius": 40, "x_axis": 110, "y_axis": 100, "color": "rgb(93,184,197)", "name": "TotalSales" }];
                $scope.bubbleGraph($scope.gData);
            } else {

                $mdToast.show($mdToast.simple().content(statusMessage).position("top right").hideDelay(2700));
            }
        }, function (error) {
            $scope.toggleWizardLoader.showLoader = false;
            $mdToast.show($mdToast.simple().content("error in getting Age filter data please try again").position("top right").hideDelay(2700));
        });
    };

    //gender filter
    $scope.genderFilter = function () {
        $scope.toggleWizardLoader.showLoader = true;
        var productName = $scope.product.selected.productName;
        var gender = $scope.group.selected.groupBy;
        var genderData = {
            Product: productName,
            Gender: gender,
            MerchantToken: merchantToken
        };
        Spark.productGet(genderData).then(function (response) {
            $scope.toggleWizardLoader.showLoader = false;
            var statusCode = response.FlikResponse.Status.StatusCode;
            var statusMessage = response.FlikResponse.Status.StatusMessage;
            var responseData = response.FlikResponse.Data.Spark.Filter;
            if (statusCode == 0) {
                var femaleTotalParticipant = responseData == undefined ? 0 : responseData.Female[0].totalParticipants;
                var maleTotalParticipant = responseData == undefined ? 0 : responseData.Male[0].totalParticipants;
                var femaleTotalRedemption = responseData == undefined ? 0 : responseData.Female[0].totalRedemptionRate;
                var maleTotalRedemption = responseData == undefined ? 0 : responseData.Male[0].totalRedemptionRate;
                var femaleTotalSales = responseData == undefined ? 0 : responseData.Female[0].totalSalesAmount;
                var maleTotalSales = responseData == undefined ? 0 : responseData.Male[0].totalSalesAmount;
                $scope.d3FemaleTotalParticipant = femaleTotalParticipant;
                $scope.d3MaleTotalParticipant = maleTotalParticipant;
                $scope.d3FemaleTotalRedemption = femaleTotalRedemption;
                $scope.d3MaleTotalRedemption = maleTotalRedemption;
                $scope.d3FemaleTotalSales = femaleTotalSales;
                $scope.d3MaleTotalSales = maleTotalSales;
                $scope.csvData = [{ "productName": productName, "maleTotalParticipant": maleTotalParticipant, "femaleTotalParticipant": femaleTotalParticipant, "maleTotalRedemption": maleTotalRedemption, "femaleTotalRedemption": femaleTotalRedemption, "maleTotalSales": maleTotalSales, "femaleTotalSales": femaleTotalSales }];
                $scope.gData = [{ "data": femaleTotalParticipant, "radius": 40, "x_axis": 30, "y_axis": 30, "color": "rgb(135,169,214)", "name": "FemaleTotalParticipant", "gender": "Female" }, { "data": maleTotalParticipant, "radius": 40, "x_axis": 30, "y_axis": 30, "color": "rgb(135,169,214)", "name": "MaleTotalParticipant", "gender": "Male" }, { "data": femaleTotalRedemption, "radius": 40, "x_axis": 70, "y_axis": 70, "color": "rgb(210,137,99)", "name": "FemaleTotalRedemption", "gender": "Female" }, { "data": maleTotalRedemption, "radius": 40, "x_axis": 70, "y_axis": 70, "color": "rgb(210,137,99)", "name": "MaleTotalRedemption", "gender": "Male" }, { "data": femaleTotalSales, "radius": 40, "x_axis": 110, "y_axis": 100, "color": "rgb(93,184,197)", "name": "FemaleTotalSales", "gender": "Female" }, { "data": maleTotalSales, "radius": 40, "x_axis": 110, "y_axis": 100, "color": "rgb(93,184,197)", "name": "MaleTotalSales", "gender": "Male" }];
                $scope.bubbleGraph($scope.gData);
                //             $scope.genderLayout();
            } else {

                    $mdToast.show($mdToast.simple().content(statusMessage).position("top right").hideDelay(2700));
                }
        }, function (error) {
            $scope.toggleWizardLoader.showLoader = false;
            $mdToast.show($mdToast.simple().content("error in getting Gender filter data please try again").position("top right").hideDelay(2700));
        });
    };

    /**
     * bubble  graph function
     *
     */

    $scope.bubbleGraph = function (gData) {
        d3.selectAll("#bubble").remove();
        var width = 1250;
        var height = 300;
        var datas = { "Male": 300, "Female": 900 };
        var genderAxis = {
            "Male": { "x": 1, "y": 90 },
            "Female": { "x": 1100, "y": 90 }
        };
        /**
         *tool tip shown on bubble.
         *
         */
        var tip = d3.tip().attr('class', 'd3-tip').offset([-10, 0]).html(function (d) {
            return "<strong>" + d.name + ":</strong> <span style='color:red'>" + d.data + "</span>";
        });

        var canvas = d3.select(".d3Graph").append("svg").attr("id", "bubble").attr("width", width).attr("height", height);

        canvas.call(tip);

        var circles = canvas.selectAll("circle").data(gData).enter().append("circle").on('mouseover', tip.show).on('mouseout', tip.hide);

        var circleAttributes = circles.attr("cx", function (d) {
            return d.x_axis;
        }).attr("cy", function (d) {
            return d.y_axis;
        }).attr("r", 0).style("fill", function (d) {
            return d.color;
        });

        circleAttributes.transition().duration(2000).attr("r", function (d) {
            return d.radius;
        });

        var force = d3.layout.force().nodes(gData).size([width, height]).friction(0.9).charge(function (d) {
            return -Math.pow(d.radius, 2.0) / 8;
        }).gravity(0.10).alpha(0.1).start();

        force.on("tick", function () {
            circles.attr("cx", function (d) {
                return d.x;
            }).attr("cy", function (d) {
                return d.y;
            }).call(force.drag);
        });

        /**
         * Group by filter
         *
         */

        $scope.genderLayout = function () {
            force.gravity(0.10).friction(0.6).charge(function (d) {
                return -Math.pow(d.radius, 2.0) / 8;
            }).on("tick", function (e) {
                circles.each($scope.genderMovePosition(e.alpha)).attr("cx", function (d) {
                    return d.x;
                }).attr("cy", function (d) {
                    return d.y;
                }).call(force.drag);
            });
            force.start();
            $scope.genderTextMove();
        };

        $scope.genderMovePosition = function (alpha) {
            //console.log(alpha);
            return function (d) {
                var genderData = genderAxis[d.gender];
                var target;
                target = { x: genderData.x, y: genderData.y };
                d.x = d.x + (target.x - d.x) * (0.1 + 0.02) * alpha * 1.1;
                d.y = d.y + (target.y - d.y) * (0.1 + 0.02) * alpha * 1.1;
                return d;
            };
        };
        $scope.genderTextMove = function () {
            var data = d3.keys(datas);
            var yPostion = 50;
            var textField = canvas.selectAll("text").data(data).enter().append("text").attr("class", "gender").attr("x", function (d) {
                return datas[d];
            }).attr("y", 50).attr("text-anchor", "middle").attr("font-size", "20px").text(function (d) {
                return d;
            });
        };

        if ($scope.group.selected.groupBy == 'Gender') {
            $timeout(function () {
                $scope.genderLayout();
            }, 3000);
        }
    };

    /**
     * Bubble graph pdf
     *
     */

    $scope.bubbleGraphPdf = function () {
        html2canvas($("#d3BubbleGraph").get(0), {
            onrendered: function onrendered(canvas) {
                var imgData = canvas.toDataURL('image/png');
                //console.log('Report Image URL: '+imgData);
                var bubblePDF = new jsPDF('p', 'pt');
                bubblePDF.setTextColor(100, 100, 100);
                bubblePDF.text("Dynamic Analytics Report", 200, 50);
                bubblePDF.addImage(imgData, 'PNG', 10, 55, 1000, 350);
                var header = function header(x, y, width, height, key, value, settings) {
                    bubblePDF.setFillColor(26, 188, 156); // Asphalt
                    bubblePDF.setTextColor(255, 255, 255);
                    bubblePDF.setFontStyle('bold');
                    bubblePDF.rect(x, y, width, height, 'F');
                    y += settings.lineHeight / 2 + bubblePDF.internal.getLineHeight() / 2;
                    bubblePDF.text(value, x + settings.padding, y);
                };
                var response = bubblePDF.autoTableHtmlToJson(document.getElementById("bubbleTable"), true);
                bubblePDF.autoTable(response.columns, response.data, { startY: 500, renderHeaderCell: header, overflow: 'linebreak' });
                bubblePDF.save('DynamicAnalytics.pdf');
            },
            width: 2000,
            height: 350
        });
    };

    /**
     *
     * heat map generation code
     *
     */

    $scope.heatmapcampaigntype = { "type": "select",
        "name": "CampaignType",
        "value": "Mobile",
        "values": ["Mobile", "Social"]
    };
    $scope.locationTargeting = function () {
        $scope.heatMapList = [];
        $scope.locationCsv = [];
        var productName = $scope.product.locationselected.productName;
        var locationData = {
            Product: productName,
            MerchantToken: merchantToken
        };
        $scope.updateresponse = function (statusCode, statusMessage, responseData) {
            $scope.allStateData = responseData;
            if (statusCode == 0) {
                if (responseData == 0) {
                    $mdToast.show($mdToast.simple().content("Product " + productName + " have no location Transaction").position("top right").hideDelay(2700));
                }
                angular.forEach(responseData, function (StateData, index) {
                    var productName = $scope.product.locationselected.productName;
                    var totalParticipant = StateData.totalParticipants;
                    var totalRedemption = StateData.totalRedemptionRate == undefined ? 0 : StateData.totalRedemptionRate;
                    var totalSales = StateData.totalSalesAmount == undefined ? 0 : StateData.totalSalesAmount;
                    var state = StateData.state;
                    var stateCsvData = {
                        productName: productName,
                        State: state,
                        totalParticipant: totalParticipant,
                        totalRedemption: totalRedemption,
                        totalSales: totalSales
                    };
                    var dataToShow = StateData.totalParticipants;
                    $scope.tab = "Participant";
                    var lat = StateData.latitude;
                    var lng = StateData.longitude;
                    //let lat = "37.33233141"
                    //let lng = "-122.0312186"

                    var heatMapData = {
                        lat: lat,
                        lng: lng,
                        count: dataToShow
                    };
                    if (heatMapData.lat != "" && heatMapData.lng != "") {
                        console.log(heatMapData.lat);
                        console.log(" in if tab data ");
                        $scope.heatMapList.push(heatMapData);
                    } else {
                        console.log(" in else tab data");
                    }
                    console.log(dataToShow);

                    $scope.locationCsv.push(stateCsvData);
                    console.log($scope.heatMapList);
                });
                $scope.showTab = true;
                $scope.setData();
            } else {
                $scope.locationCsv = [];
                $mdToast.show($mdToast.simple().content(statusMessage).position("top right").hideDelay(2700));
            }
        }, function (error) {
            $scope.toggleWizardLoader.showLoader = false;
            $mdToast.show($mdToast.simple().content("error in getting Location Data please try again").position("top right").hideDelay(2700));
        };
        if ($scope.heatmapcampaigntype.value == 'Social') {
            Social.productSocialLocationGet(locationData).then(function (response) {
                var statusCode = response.FlikResponse.Status.StatusCode;
                var statusMessage = response.FlikResponse.Status.StatusMessage;
                var responseData = response.FlikResponse.Data.Social.Filter.length == 0 ? 0 : response.FlikResponse.Data.Social.Filter;
                /**
                 * to access this response data from tab change function.
                 *
                 */
                $scope.updateresponse(statusCode, statusMessage, responseData);
            });
        } else {
            Spark.productLocationGet(locationData).then(function (response) {
                var statusCode = response.FlikResponse.Status.StatusCode;
                var statusMessage = response.FlikResponse.Status.StatusMessage;
                var responseData = response.FlikResponse.Data.Spark.Filter.length == 0 ? 0 : response.FlikResponse.Data.Spark.Filter;
                /**
                 * to access this response data from tab change function.
                 *
                 */
                $scope.updateresponse(statusCode, statusMessage, responseData);
            });
        }
    };

    $scope.selectedTab = function (tabSelected) {
        console.log("in selected tab");
        console.log(tabSelected);
        var tabArray = [];
        $scope.tab = tabSelected;
        angular.forEach($scope.allStateData, function (value, index) {

            var lat = value.latitude;
            var lng = value.longitude;
            var dataToShow = value[tabSelected];

            var tabData = {
                lat: lat,
                lng: lng,
                count: dataToShow
            };
            tabArray.push(tabData);
        });
        $scope.heatMapList = tabArray;
        $scope.setData();
    };

    /**
     * heat map pdf generation
     *
     */

    $scope.heatMapPdf = function () {
        html2canvas(document.getElementById('heatmap'), {
            logging: true,
            onrendered: function onrendered(canvas) {
                var imgData = canvas.toDataURL('image/png');
                var heatMapPDF = new jsPDF('p', 'pt');
                heatMapPDF.setTextColor(100, 100, 100);
                heatMapPDF.text("Dynamic Analytics Report", 200, 50);
                heatMapPDF.addImage(imgData, 'PNG', 150, 100, 1000, 300);
                var header = function header(x, y, width, height, key, value, settings) {
                    heatMapPDF.setFillColor(26, 188, 156); // Asphalt
                    heatMapPDF.setTextColor(255, 255, 255);
                    heatMapPDF.setFontStyle('bold');
                    heatMapPDF.rect(x, y, width, height, 'F');
                    y += settings.lineHeight / 2 + heatMapPDF.internal.getLineHeight() / 2;
                    heatMapPDF.text(value, x + settings.padding, y);
                };
                var response = heatMapPDF.autoTableHtmlToJson(document.getElementById("heatMapTable"), true);
                heatMapPDF.autoTable(response.columns, response.data, { startY: 450, renderHeaderCell: header, overflow: 'linebreak' });
                heatMapPDF.save('DynamicAnalytics.pdf');
            },
            width: 2000,
            height: 300
        });
    };

    var heatmapLayer;
    $scope.setData = function () {
        console.log("in set data");
        var testData = {
            max: 1,
            data: $scope.heatMapList
        };
        console.log(testData);
        heatmapLayer.setData(testData);
        heatmapLayer._resetOrigin();
        heatmapLayer._draw();

        // make accessible for debugging
        var layer = heatmapLayer;
    };

    $scope.map = function () {
        var baseLayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
            maxZoom: 18
        });

        var cfg = {
            // radius should be small ONLY if scaleRadius is true (or small radius is intended)
            "radius": 2,
            "maxOpacity": .8,
            // scales the radius based on map zoom
            "scaleRadius": true,
            // if set to false the heatmap uses the global maximum for colorization
            // if activated: uses the data maximum within the current map boundaries
            //   (there will always be a red spot with useLocalExtremas true)
            "useLocalExtrema": true,
            // which field name in your data represents the latitude - default "lat"
            latField: 'lat',
            // which field name in your data represents the longitude - default "lng"
            lngField: 'lng',
            // which field name in your data represents the data value - default "value"
            valueField: 'count'
        };

        heatmapLayer = new HeatmapOverlay(cfg);

        var map = new L.Map('heatmap', {
            center: new L.LatLng(25.6586, -80.3568),
            zoom: 4,
            layers: [baseLayer, heatmapLayer]
        });

        map.on('click', function (e) {
            var selectedLatLng = e.latlng;
            var latlngData = {
                lat: selectedLatLng.lat,
                lng: selectedLatLng.lng
            };
            angular.forEach($scope.heatMapList, function (stateValue, index) {
                if (parseInt(selectedLatLng.lat) == parseInt(stateValue.lat) && parseInt(selectedLatLng.lng) == parseInt(stateValue.lng)) {
                    //console.log(parseInt(selectedLatLng.lat));
                    var popup = L.popup().setLatLng(latlngData).setContent("<strong>" + $scope.tab + ":</strong> <span style='color:red'>" + stateValue.count + "</span>").openOn(map);
                }
            });
        });

        var locationData = {
            MerchantToken: merchantToken
        };
        Store.storeGetAll(locationData).then(function (response) {
            var statusCode = response.FlikResponse.Status.StatusCode;
            var statusMessage = response.FlikResponse.Status.StatusMessage;
            var responseData = response.FlikResponse.Data.MerchantStoreAll.StoreList.length == 0 ? 0 : response.FlikResponse.Data.MerchantStoreAll.StoreList;
            $scope.allStoreData = responseData;
            if (statusCode == 0) {
                if (responseData == 0) {
                    $mdToast.show($mdToast.simple().content("Currently, no stores found.").position("top right").hideDelay(2700));
                }
                angular.forEach(responseData, function (StoreData, index) {
                    if (StoreData.storeLatitude && StoreData.storeLongitude) {
                        var storeName = StoreData.storeName;
                        var storeId = StoreData.storeId;
                        var storeLatitude = StoreData.storeLatitude;
                        var storeLongitude = StoreData.storeLongitude;
                        var newLatLng = new L.LatLng(storeLatitude, storeLongitude);
                        var marker = L.marker([storeLatitude, storeLongitude]).addTo(map);
                        marker.bindPopup(storeName);
                    }
                });
            } else {
                $mdToast.show($mdToast.simple().content(statusMessage).position("top right").hideDelay(2700));
            }
        }, function (error) {
            $scope.toggleWizardLoader.showLoader = false;
            $mdToast.show($mdToast.simple().content("error in getting Location Data please try again").position("top right").hideDelay(2700));
        });
    };
    $scope.map();

    /**
     * for tabsets
     *
     */
    $scope.tabsetRedemption = {
        selectedIndex: 0,
        secondLocked: true,
        secondLabel: "Item Two"
    };

    $scope.tabsetParticipants = {
        selectedIndex: 0,
        secondLocked: true,
        secondLabel: "Item Two"
    };

    $scope.tabsetBasket = {
        selectedIndex: 0,
        secondLocked: true,
        secondLabel: "Item Two"
    };

    $scope.tabsetCampaignOverview = {
        selectedIndex: 0,
        secondLocked: true,
        secondLabel: "Item Two"
    };

    $scope.tabsetHighlights = {
        selectedIndex: 0,
        secondLocked: true,
        secondLabel: "Item Two"
    };

    /**
     * old chart config just so it works
     *
     */
    $scope.d0_1 = [[0, 7], [1, 6.5], [2, 12.5], [3, 7], [4, 9], [5, 6], [6, 11], [7, 6.5], [8, 8], [9, 7]];

    /**
     * highcharts config and charts
     *
     */
    $scope.highcharts = Highcharts;
    var hCharts = $scope.highcharts;

    hCharts.theme = {
        colors: ["#89cd9e", "#71abb8", "#e5a32f", "#36363d", "#71b885", "#b1cd89", "#eeaaee", "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
        chart: {
            backgroundColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 1,
                    y2: 1
                },
                stops: [[0, '#fbfbf8'], [1, '#fbfbf8']]
            },
            style: {
                fontFamily: "'Varela Round', sans-serif;"
            },
            plotBorderColor: '#dbdbd8'
        },
        title: {
            style: {
                color: '#E0E0E3',
                textTransform: 'uppercase',
                fontSize: '20px'
            }
        },
        subtitle: {
            style: {
                color: '#E0E0E3',
                textTransform: 'uppercase'
            }
        },
        xAxis: {
            gridLineColor: '#dbdbd8',
            labels: {
                style: {
                    color: '#dbdbd8'
                }
            },
            lineColor: '#dbdbd8',
            minorGridLineColor: '#dbdbd8',
            tickColor: '#dbdbd8',
            title: {
                style: {
                    color: '#A0A0A3'
                }
            }
        },
        yAxis: {
            gridLineColor: '#dbdbd8',
            labels: {
                style: {
                    color: '#E0E0E3'
                }
            },
            lineColor: '#dbdbd8',
            minorGridLineColor: '#dbdbd8',
            tickColor: '#dbdbd8',
            tickWidth: 1,
            title: {
                style: {
                    color: '#A0A0A3'
                }
            }
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            style: {
                color: '#fbfbf8'
            }
        },
        plotOptions: {
            series: {
                dataLabels: {
                    color: '#dbdbd8'
                },
                marker: {
                    lineColor: '#333'
                }
            },
            boxplot: {
                fillColor: '#505053'
            },
            candlestick: {
                lineColor: 'white'
            },
            errorbar: {
                color: 'white'
            }
        },
        legend: {
            itemStyle: {
                color: '#E0E0E3'
            },
            itemHoverStyle: {
                color: '#FFF'
            },
            itemHiddenStyle: {
                color: '#606063'
            }
        },
        credits: {
            style: {
                color: '#777'
            }
        },
        labels: {
            style: {
                color: '#707073'
            }
        },
        drilldown: {
            activeAxisLabelStyle: {
                color: '#F0F0F3'
            },
            activeDataLabelStyle: {
                color: '#F0F0F3'
            }
        },
        navigation: {
            buttonOptions: {
                symbolStroke: '#DDDDDD',
                theme: {
                    fill: '#505053'
                }
            }
        },
        // scroll charts
        rangeSelector: {
            buttonTheme: {
                fill: '#505053',
                stroke: '#000000',
                style: {
                    color: '#CCC'
                },
                states: {
                    hover: {
                        fill: '#707073',
                        stroke: '#000000',
                        style: {
                            color: 'white'
                        }
                    },
                    select: {
                        fill: '#000003',
                        stroke: '#000000',
                        style: {
                            color: 'white'
                        }
                    }
                }
            },
            inputBoxBorderColor: '#505053',
            inputStyle: {
                backgroundColor: '#333',
                color: 'silver'
            },
            labelStyle: {
                color: 'silver'
            }
        },

        navigator: {
            handles: {
                backgroundColor: '#666',
                borderColor: '#AAA'
            },
            outlineColor: '#CCC',
            maskFill: 'rgba(255,255,255,0.1)',
            series: {
                color: '#7798BF',
                lineColor: '#A6C7ED'
            },
            xAxis: {
                gridLineColor: '#505053'
            }
        },
        scrollbar: {
            barBackgroundColor: '#808083',
            barBorderColor: '#808083',
            buttonArrowColor: '#CCC',
            buttonBackgroundColor: '#606063',
            buttonBorderColor: '#606063',
            rifleColor: '#FFF',
            trackBackgroundColor: '#404043',
            trackBorderColor: '#404043'
        },
        // special colors for some of the
        legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
        background2: '#505053',
        dataLabelsColor: '#B0B0B3',
        textColor: '#C0C0C0',
        contrastTextColor: '#F0F0F3',
        maskColor: 'rgba(255,255,255,0.3)'
    };

    // Apply the theme
    hCharts.setOptions(hCharts.theme);

    hCharts.setOptions({
        global: {
            useUTC: false
        }
    });

    /**
     * highchart sample usage
     *
     * put this is the HTML/view template
     *
     * <highchart id="chart1" config="chartConfig"></highchart>
     *
     * where id is the unique id for that chart and config is the variable
     * pointing at the $scope.chartConfig model below
     * see the README-highcharts-ng for a more complete example
    
    
     $scope.chartConfig = {
          options: {
            chart: {
              type: "bar"
            }
          },
          series: [{
            data: [10, 15, 12, 8, 7]
          }],
          title: {
            text: "Highcharts Demo"
          },
          loading: false
        }
    
     */
    var ageCategories = ['0-4', '5-9', '10-14', '15-19', '20-24', '25-29', '30-34', '35-39', '40-44', '45-49', '50-54', '55-59', '60-64', '65-69', '70-74', '75-79', '80-84', '85-89', '90-94', '95-99', '100 + '];

    $scope.participantsToday = {
        options: {
            chart: {
                type: "spline"
            },
            title: {
                text: "Participants per hour"
            },
            xAxis: {
                type: "datetime",
                dateTimeLabelFormats: { // don"t display the dummy year
                    month: "%e. %b",
                    year: "%b"
                },
                title: {
                    text: "Date"
                }
            },
            yAxis: {
                title: {
                    text: "Participants/hour"
                },
                min: 0
            },
            tooltip: {
                headerFormat: "<b>{series.name}</b><br>",
                pointFormat: "{point.x:%e. %b}: {point.y:.2f} m"
            }

        },
        plotOptions: {
            spline: {
                marker: {
                    enabled: true
                }
            }
        },
        series: [{
            name: "Male",
            // Define the data points. All series have a dummy year
            // of 1970/71 in order to be compared on the same x axis. Note
            // that in JavaScript, months start at 0 for January, 1 for February etc.
            data: [[Date.UTC(1970, 9, 27), 0], [Date.UTC(1970, 10, 10), 0.6], [Date.UTC(1970, 10, 18), 0.7], [Date.UTC(1970, 11, 2), 0.8], [Date.UTC(1970, 11, 9), 0.6], [Date.UTC(1970, 11, 16), 0.6], [Date.UTC(1970, 11, 28), 0.67], [Date.UTC(1971, 0, 1), 0.81], [Date.UTC(1971, 0, 8), 0.78], [Date.UTC(1971, 0, 12), 0.98], [Date.UTC(1971, 0, 27), 1.84], [Date.UTC(1971, 1, 10), 1.80], [Date.UTC(1971, 1, 18), 1.80], [Date.UTC(1971, 1, 24), 1.92], [Date.UTC(1971, 2, 4), 2.49], [Date.UTC(1971, 2, 11), 2.79], [Date.UTC(1971, 2, 15), 2.73], [Date.UTC(1971, 2, 25), 2.61], [Date.UTC(1971, 3, 2), 2.76], [Date.UTC(1971, 3, 6), 2.82], [Date.UTC(1971, 3, 13), 2.8], [Date.UTC(1971, 4, 3), 2.1], [Date.UTC(1971, 4, 26), 1.1], [Date.UTC(1971, 5, 9), 0.25], [Date.UTC(1971, 5, 12), 0]]
        }, {
            name: "Female",
            data: [[Date.UTC(1970, 9, 18), 0], [Date.UTC(1970, 9, 26), 0.2], [Date.UTC(1970, 11, 1), 0.47], [Date.UTC(1970, 11, 11), 0.55], [Date.UTC(1970, 11, 25), 1.38], [Date.UTC(1971, 0, 8), 1.38], [Date.UTC(1971, 0, 15), 1.38], [Date.UTC(1971, 1, 1), 1.38], [Date.UTC(1971, 1, 8), 1.48], [Date.UTC(1971, 1, 21), 1.5], [Date.UTC(1971, 2, 12), 1.89], [Date.UTC(1971, 2, 25), 2.0], [Date.UTC(1971, 3, 4), 1.94], [Date.UTC(1971, 3, 9), 1.91], [Date.UTC(1971, 3, 13), 1.75], [Date.UTC(1971, 3, 19), 1.6], [Date.UTC(1971, 4, 25), 0.6], [Date.UTC(1971, 4, 31), 0.35], [Date.UTC(1971, 5, 7), 0]]
        }, {
            name: "Both",
            data: [[Date.UTC(1970, 9, 9), 0], [Date.UTC(1970, 9, 14), 0.15], [Date.UTC(1970, 10, 28), 0.35], [Date.UTC(1970, 11, 12), 0.46], [Date.UTC(1971, 0, 1), 0.59], [Date.UTC(1971, 0, 24), 0.58], [Date.UTC(1971, 1, 1), 0.62], [Date.UTC(1971, 1, 7), 0.65], [Date.UTC(1971, 1, 23), 0.77], [Date.UTC(1971, 2, 8), 0.77], [Date.UTC(1971, 2, 14), 0.79], [Date.UTC(1971, 2, 24), 0.86], [Date.UTC(1971, 3, 4), 0.8], [Date.UTC(1971, 3, 18), 0.94], [Date.UTC(1971, 3, 24), 0.9], [Date.UTC(1971, 4, 16), 0.39], [Date.UTC(1971, 4, 21), 0]]
        }],
        title: {
            text: ""
        },
        loading: false
    };

    $scope.basicColumn = {
        options: {
            chart: {
                type: "column"
            },
            title: {
                text: "Campaign Overview"
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' + '<td style="padding : 0"><b>{point.y:.1f} mm</b></td></tr>',
                footerFormat: "</table>",
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            }
        },
        series: [{
            name: "Campaign A",
            data: [5, 3, 4, 7, 2]
        }, {
            name: "Campaign B",
            data: [2, -2, -3, 2, 1]
        }, {
            name: "Campaign C",
            data: [1, 4, 2, -2, 5]
        }, {
            name: "Campaign D",
            data: [3, 4, 2, 0, 5]
        }, {
            name: "Campaign E",
            data: [2, 3, 1, -1, 3]
        }],
        xAxis: {
            categories: ["Offer A", "Offer B", "Offer C", "Offer D", "Offer E"]
        },
        credits: {
            enabled: false
        },
        title: {
            text: "Campaign Overview"
        },
        loading: false
    };

    var colors = hCharts.getOptions().colors;

    var genderCategories = ['Male', 'Female', 'Both'];

    var moodsList = ['Happy', 'Happy', 'Morose', 'Happy', 'Stressed', 'Stresed', 'Angry'];

    var data = [{
        y: 28,
        color: colors[0],
        drilldown: {
            name: 'Male',
            categories: moodsList,
            data: [22, 21, 43, 19, 20, 28, 33],
            color: colors[0]
        }
    }, {
        y: 40,
        color: colors[1],
        drilldown: {
            name: 'Female',
            categories: moodsList,
            data: [12, 19, 55, 58, 36, 49, 44],
            color: colors[1]
        }
    }, {
        y: 50,
        color: colors[2],
        drilldown: {
            name: 'Both',
            categories: moodsList,
            data: [19, 39, 75, 64, 33, 31, 58],
            color: colors[2]
        }
    }];

    var avgAgeData = [],
        ageData = [],
        i = undefined,
        j = undefined,
        dataLen = data.length,
        drillDataLen = undefined,
        brightness = undefined;

    // Build the data arrays
    for (i = 0; i < dataLen; i += 1) {
        // add browser data
        avgAgeData.push({
            name: ageCategories[i],
            y: data[i].y,
            color: data[i].color
        });
        // add version data
        drillDataLen = data[i].drilldown.data.length;
        for (j = 0; j < drillDataLen; j += 1) {
            brightness = 0.2 - j / drillDataLen / 5;
            ageData.push({
                name: data[i].drilldown.categories[j],
                y: data[i].drilldown.data[j],
                color: hCharts.Color(data[i].color).brighten(brightness).get()
            });
        }
    }

    // Create the chart

    $scope.chartPie = {
        options: {
            chart: {
                type: "pie"
            },
            title: {
                text: ""
            },
            yAxis: {
                title: {
                    text: "Total percent market share"
                }
            },
            plotOptions: {
                pie: {
                    shadow: false,
                    center: ["50%", "30%"]
                }
            }
        },
        tooltip: {
            valueSuffix: "%"
        },
        series: [{
            name: "Avg. Age",
            data: avgAgeData,
            size: "10%",
            dataLabels: {
                formatter: function formatter() {
                    return this.y > 5 ? this.point.name : null;
                },
                color: "white",
                distance: -10
            }
        }, {
            name: "Age",
            data: ageData,
            size: "40%",
            innerSize: "20%",
            dataLabels: {
                formatter: function formatter() {
                    // display only if larger than 1
                    return this.y > 1 ? "<b>" + this.point.name + ":</b> " + this.y + "%" : null;
                }
            }
        }],
        loading: false
    };
}]);
//# sourceMappingURL=core.dashboard.js.map