"use strict";

angular.module("app")
.factory("Merchant", ["Restangular",
  function(            Restangular){

    /**
     * Our Restangular urls for Merchant factory
     */

    let rMerchantGetAllProductTableRow       = Restangular.all("merchant/product/all");
    let rMerchantUpdateProductTableRow       = Restangular.all("merchant/product/update");
    let rMerchantDeleteProductTableRow       = Restangular.all("merchant/product/delete");
    let rMerchantAddProductTableRow          = Restangular.all("merchant/product/new");

    return {
      /**
       * Fetches all table data for merchant
       *
       * @merchant            {object}    merchant from which to fetch all table data
       *
       * @return {object}     Restangularized response from API
       */
      getAllProductRow: merchantToken => {
        return rMerchantGetAllProductTableRow.post(merchantToken);
      },
      /**
       * Updates a Merchant Table Row
       *
       * @merchantInfo        {object}   merchantInfo from $scope to update merchant table row
       *
       * @return {object}     Restangularized response from API
       */
      updateProductRow: productRowToUpdate => {
        return rMerchantUpdateProductTableRow.post(productRowToUpdate);
      },
      /**
       * Deletes a Merchant Table Row
       *
       * @merchantToTrash    {object}    merchant from $scope to delete table row
       *
       * @return {object}   Restangularized response from API
       */
      deleteProductRow: productRowToTrash => {
        return rMerchantDeleteProductTableRow.post(productRowToTrash);
      },
      /**
       * Adds a Merchant Table Row
       *
       * @MerchantInfo   {object}         merchantInfo from $scope to add merchant table row
       *
       * @return {object}   Restangularized response from API
       */
      addProductRow: productToAdd => {
        return rMerchantAddProductTableRow.post(productToAdd);
      }
    }
}]);
