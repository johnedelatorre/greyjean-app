"use strict";

angular.module("app").factory("Product", ["Restangular", "$q", function (Restangular, $q) {

    /**
     * Our Restangular urls for Fingerprint factory
     */
    var rProductCreate = Restangular.all("merchant/product/new");
    var rProductUpdate = Restangular.all("merchant/product/update");
    var rProductTrash = Restangular.all("merchant/product/delete");
    var rProductGetOne = Restangular.all("merchant/product/get");
    var rProductGetAll = Restangular.all("merchant/product/all");
    var rProductPaginateGetAll = Restangular.all("merchant/product/all/number");
    var rProductCategoryPaginateGetAll = Restangular.all("merchant/product/category/number");
    var rProductBrandPaginateGetAll = Restangular.all("merchant/product/brand/number");
    var rProductNamePaginateGetAll = Restangular.all("merchant/product/brandandcategory/number");
    var rProductGetAllBySearching = Restangular.all("merchant/product/get/byname");
    var productAllData = {};
    var productPaginateAllData = {};
    var productCategoryPaginateAllData = {};
    var productBrandPaginateAllData = {};
    var productNamePaginateAllData = {};
    var productAllSearchedData = {};
    Restangular.setBaseUrl('http://66.228.114.178/genie/api/');

    return {
        /**
         * Creates a product
         *
         * @merchantToken   {object}   info from $scope to create product
         *
         * @return {object}   Restangularized response from API
         */
        create: function create(merchantToken) {
            return rProductCreate.post(merchantToken);
        },
        /**
         * Updates a product
         *
         * @merchantToken   {object}   info from $scope to update product
         *
         * @return {object}   Restangularized response from API
         */
        update: function update(merchantToken) {
            return rProductUpdate.post(merchantToken);
        },
        /**
         * Deletes a product
         *
         * @productToTrash    {object}    productId from $scope to delete product
         *
         * @return {object}   Restangularized response from API
         */
        trash: function trash(productToTrash) {
            return rProductTrash.post(productToTrash);
        },
        /**
         * Fetches one product for op merchant
         *
         * @productToGet  {object}    productId from $scope to retrieve product from API
         *
         * @return {object}   Restangularized response from API
         */
        getOne: function getOne(productToGet) {
            return rProductGetOne.post(productToGet);
        },
        /**
         * Fetches all fingerprints for op merchant
         *
         * @merchantToken     {object}    merchantToken from which to fetch all products
         *
         * @return {object}   Restangularized response from API
         */
        getAll: function getAll(merchantToken) {
            return rProductGetAll.post(merchantToken);
        },
        ProductAllData: function ProductAllData(merchantToken) {
            var mPass = {
                MerchantToken: merchantToken
            };
            return $q(function (resolve, reject) {
                rProductGetAll.post(mPass).then(function (response) {
                    productAllData = response.FlikResponse.Data.MerchantProductAll.ProductList;
                    //$rootScope.allData.campaigns.list = campaignList;
                    //$rootScope.allData.campaigns.count = campaignList.length;

                    resolve(productAllData);
                }, function (err) {
                    error = err;
                    reject(error);
                });
            });

            //return fingerprintAllData;
        },
        getProductAllData: function getProductAllData() {
            return productAllData;
        },
        ProductCategoryPaginateAllData: function ProductCategoryPaginateAllData(start, limit, productCategorySearch, merchantToken) {
            var mPass = {
                StartLimit: start,
                EndLimit: limit,
                ProductCategory: productCategorySearch,
                MerchantToken: merchantToken
            };

            return $q(function (resolve, reject) {
                rProductCategoryPaginateGetAll.post(mPass).then(function (response) {
                    productCategoryPaginateAllData = response.FlikResponse.Data.MerchantProductAll.ProductList;
                    resolve(productCategoryPaginateAllData);
                }, function (err) {
                    error = err;
                    reject(error);
                });
            });

            //return fingerprintAllData;
        },
        getProductCategoryPaginateAllData: function getProductCategoryPaginateAllData() {
            return productCategoryPaginateAllData;
        },
        ProductBrandPaginateAllData: function ProductBrandPaginateAllData(start, limit, productCategory, productBrandSearch, merchantToken) {
            var mPass = {
                StartLimit: start,
                EndLimit: limit,
                ProductCategory: productCategory,
                BrandName: productBrandSearch,
                MerchantToken: merchantToken
            };
            return $q(function (resolve, reject) {
                rProductBrandPaginateGetAll.post(mPass).then(function (response) {
                    productBrandPaginateAllData = response.FlikResponse.Data.MerchantProductAll.ProductList;
                    resolve(productBrandPaginateAllData);
                }, function (err) {
                    error = err;
                    reject(error);
                });
            });

            //return fingerprintAllData;
        },
        getProductBrandPaginateAllData: function getProductBrandPaginateAllData() {
            return productBrandPaginateAllData;
        },
        ProductNamePaginateAllData: function ProductNamePaginateAllData(start, limit, productCategory, productName, productBrand, merchantToken) {

            var mPass = {
                StartLimit: start,
                EndLimit: limit,
                ProductCategory: productCategory,
                ProductName: productName,
                BrandName: productBrand,
                MerchantToken: merchantToken
            };
            return $q(function (resolve, reject) {
                rProductNamePaginateGetAll.post(mPass).then(function (response) {
                    productNamePaginateAllData = response.FlikResponse.Data.MerchantProductAll.ProductList;
                    resolve(productNamePaginateAllData);
                }, function (err) {
                    error = err;
                    reject(error);
                });
            });

            //return fingerprintAllData;
        },
        getProductNamePaginateAllData: function getProductNamePaginateAllData() {
            return productNamePaginateAllData;
        },
        ProductPaginateAllData: function ProductPaginateAllData(start, limit, merchantToken) {
            var mPass = {
                StartLimit: start,
                EndLimit: limit,
                MerchantToken: merchantToken
            };
            return $q(function (resolve, reject) {
                rProductPaginateGetAll.post(mPass).then(function (response) {
                    productPaginateAllData = response.FlikResponse.Data.MerchantProductAll.ProductList;

                    resolve(productPaginateAllData);
                }, function (err) {
                    error = err;
                    reject(error);
                });
            });

            //return fingerprintAllData;
        },
        getProductPaginateAllData: function getProductPaginateAllData() {
            return productPaginateAllData;
        },
        ProductAllSearchedData: function ProductAllSearchedData(start, limit, productName, merchantToken) {
            var mPass = {
                StartLimit: start,
                EndLimit: limit,
                ProductName: productName,
                MerchantToken: merchantToken
            };
            return $q(function (resolve, reject) {
                rProductGetAllBySearching.post(mPass).then(function (response) {
                    productAllSearchedData = response.FlikResponse.Data.MerchantProductAll.ProductList;
                    //$rootScope.allData.campaigns.list = campaignList;
                    //$rootScope.allData.campaigns.count = campaignList.length;

                    resolve(productAllSearchedData);
                }, function (err) {
                    error = err;
                    reject(error);
                });
            });
            //return fingerprintAllData;
        },
        getProductAllSearchedData: function getProductAllSearchedData() {
            return productAllSearchedData;
        }
    };
}]);
//# sourceMappingURL=product.js.map