"use strict";

angular.module("app")
.factory("Product", ["Restangular","$q",
  function(           Restangular,$q){

    /**
     * Our Restangular urls for Fingerprint factory
     */
    let rProductCreate            = Restangular.all("merchant/product/new");
    let rProductUpdate            = Restangular.all("merchant/product/update");
    let rProductTrash             = Restangular.all("merchant/product/delete");
    let rProductGetOne            = Restangular.all("merchant/product/get");
    let rProductGetAll            = Restangular.all("merchant/product/all");
    let rProductPaginateGetAll = Restangular.all("merchant/product/all/number");
      let rProductCategoryPaginateGetAll = Restangular.all("merchant/product/category/number");
      let rProductBrandPaginateGetAll = Restangular.all("merchant/product/brand/number");
      let rProductNamePaginateGetAll = Restangular.all("merchant/product/brandandcategory/number");
      let rProductGetAllBySearching            = Restangular.all("merchant/product/get/byname");
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
      create: merchantToken => {
        return rProductCreate.post(merchantToken);
      },
      /**
       * Updates a product
       *
       * @merchantToken   {object}   info from $scope to update product
       *
       * @return {object}   Restangularized response from API
       */
      update: merchantToken => {
        return rProductUpdate.post(merchantToken);
      },
      /**
       * Deletes a product
       *
       * @productToTrash    {object}    productId from $scope to delete product
       *
       * @return {object}   Restangularized response from API
       */
      trash: productToTrash => {
        return rProductTrash.post(productToTrash);
      },
      /**
       * Fetches one product for op merchant
       *
       * @productToGet  {object}    productId from $scope to retrieve product from API
       *
       * @return {object}   Restangularized response from API
       */
      getOne: productToGet => {
        return rProductGetOne.post(productToGet);
      },
      /**
       * Fetches all fingerprints for op merchant
       *
       * @merchantToken     {object}    merchantToken from which to fetch all products
       *
       * @return {object}   Restangularized response from API
       */
      getAll: merchantToken => {
        return rProductGetAll.post(merchantToken);
      },
ProductAllData: merchantToken =>{
    let mPass = {
        MerchantToken: merchantToken
    }
    return $q(function(resolve, reject) {
        rProductGetAll.post(mPass).then(response => {
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
getProductAllData: function() {
    return productAllData;
},
ProductCategoryPaginateAllData: function(start,limit,productCategorySearch,merchantToken) {
    let mPass = {
        StartLimit: start,
        EndLimit: limit,
        ProductCategory: productCategorySearch,
        MerchantToken: merchantToken
    }

    return $q(function(resolve, reject) {
        rProductCategoryPaginateGetAll.post(mPass).then(response => {
        productCategoryPaginateAllData = response.FlikResponse.Data.MerchantProductAll.ProductList;
        resolve(productCategoryPaginateAllData);
    }, function (err) {
        error = err;
        reject(error);
    });
});

//return fingerprintAllData;
},
getProductCategoryPaginateAllData: function() {
    return productCategoryPaginateAllData;
},
ProductBrandPaginateAllData: function(start,limit,productCategory,productBrandSearch,merchantToken) {
    let mPass = {
        StartLimit: start,
        EndLimit: limit,
        ProductCategory: productCategory,
        BrandName: productBrandSearch,
        MerchantToken: merchantToken
    }
    return $q(function(resolve, reject) {
        rProductBrandPaginateGetAll.post(mPass).then(response => {
        productBrandPaginateAllData = response.FlikResponse.Data.MerchantProductAll.ProductList;
        resolve(productBrandPaginateAllData);
    }, function (err) {
        error = err;
        reject(error);
    });
});

//return fingerprintAllData;
},
getProductBrandPaginateAllData: function() {
    return productBrandPaginateAllData;
},
ProductNamePaginateAllData: function(start,limit,productCategory,productName,productBrand,merchantToken) {

    let mPass = {
        StartLimit: start,
        EndLimit: limit,
        ProductCategory: productCategory,
        ProductName: productName,
        BrandName: productBrand,
        MerchantToken: merchantToken
    }
    return $q(function(resolve, reject) {
        rProductNamePaginateGetAll.post(mPass).then(response => {
        productNamePaginateAllData = response.FlikResponse.Data.MerchantProductAll.ProductList;
        resolve(productNamePaginateAllData);
    }, function (err) {
        error = err;
        reject(error);
    });
});

//return fingerprintAllData;
},
getProductNamePaginateAllData: function() {
    return productNamePaginateAllData;
},
ProductPaginateAllData: function(start,limit,merchantToken) {
    let mPass = {
        StartLimit: start,
        EndLimit: limit,
        MerchantToken: merchantToken
    }
    return $q(function(resolve, reject) {
        rProductPaginateGetAll.post(mPass).then(response => {
        productPaginateAllData = response.FlikResponse.Data.MerchantProductAll.ProductList;

        resolve(productPaginateAllData);
    }, function (err) {
        error = err;
        reject(error);
    });
});

//return fingerprintAllData;
},
getProductPaginateAllData: function() {
    return productPaginateAllData;
},
ProductAllSearchedData: function(start,limit,productName,merchantToken) {
    let mPass = {
        StartLimit: start,
        EndLimit: limit,
        ProductName: productName,
        MerchantToken: merchantToken
    }
    return $q(function(resolve, reject) {
        rProductGetAllBySearching.post(mPass).then(response => {
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
getProductAllSearchedData: function() {
    return productAllSearchedData;
}
};

}]);
