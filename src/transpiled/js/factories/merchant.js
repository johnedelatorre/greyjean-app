"use strict";

angular.module("app").factory("Merchant", ["Restangular", function (Restangular) {

  /**
   * Our Restangular urls for Merchant factory
   */

  var rMerchantGetAllProductTableRow = Restangular.all("merchant/product/all");
  var rMerchantUpdateProductTableRow = Restangular.all("merchant/product/update");
  var rMerchantDeleteProductTableRow = Restangular.all("merchant/product/delete");
  var rMerchantAddProductTableRow = Restangular.all("merchant/product/new");

  return {
    /**
     * Fetches all table data for merchant
     *
     * @merchant            {object}    merchant from which to fetch all table data
     *
     * @return {object}     Restangularized response from API
     */
    getAllProductRow: function getAllProductRow(merchantToken) {
      return rMerchantGetAllProductTableRow.post(merchantToken);
    },
    /**
     * Updates a Merchant Table Row
     *
     * @merchantInfo        {object}   merchantInfo from $scope to update merchant table row
     *
     * @return {object}     Restangularized response from API
     */
    updateProductRow: function updateProductRow(productRowToUpdate) {
      return rMerchantUpdateProductTableRow.post(productRowToUpdate);
    },
    /**
     * Deletes a Merchant Table Row
     *
     * @merchantToTrash    {object}    merchant from $scope to delete table row
     *
     * @return {object}   Restangularized response from API
     */
    deleteProductRow: function deleteProductRow(productRowToTrash) {
      return rMerchantDeleteProductTableRow.post(productRowToTrash);
    },
    /**
     * Adds a Merchant Table Row
     *
     * @MerchantInfo   {object}         merchantInfo from $scope to add merchant table row
     *
     * @return {object}   Restangularized response from API
     */
    addProductRow: function addProductRow(productToAdd) {
      return rMerchantAddProductTableRow.post(productToAdd);
    }
  };
}]);
//# sourceMappingURL=merchant.js.map