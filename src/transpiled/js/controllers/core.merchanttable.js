"use strict";

app.controller("CoreMerchantTableCtrl", ["$scope", "$rootScope", "FileUploader", "locker", "$filter", "$state", "$stateParams", "$mdToast", "$animate", function ($scope, $rootScope, FileUploader, locker, $filter, $state, $stateParams, $mdToast, $animate) {

    /**
     * get Dexie dbCore
     *
     */
    var dbCore = $rootScope.dbCore;
    /**
     * get merchantMe and merchantToken from Locker
     *
     */
    var merchantMe = locker.driver("local").namespace("core").get("me");
    var merchantToken = locker.driver("local").namespace("core").get("merchantToken");

    // uploader store

    var uploaderStore = $scope.uploaderStore = new FileUploader({
        url: "http://api.genieapp.com/genie/api/upload/merchant/store"
    });

    // FILTERS

    uploaderStore.filters.push({
        name: "customFilter",
        fn: function fn(item, /*{File|FileLikeObject}*/options) {
            return this.queue.length < 10;
        }
    });

    // CALLBACKS

    uploaderStore.onWhenAddingFileFailed = function (item, /*{File|FileLikeObject}*/filter, options) {
        console.info("onWhenAddingFileFailed", item, filter, options);
    };
    uploaderStore.onAfterAddingFile = function (fileItem) {
        console.info("onAfterAddingFile", fileItem);
    };
    uploaderStore.onAfterAddingAll = function (addedFileItems) {
        console.info("onAfterAddingAll", addedFileItems);
    };
    uploaderStore.onBeforeUploadItem = function (item) {
        console.info("onBeforeUploadItem", item);
    };
    uploaderStore.onProgressItem = function (fileItem, progress) {
        console.info("onProgressItem", fileItem, progress);
    };
    uploaderStore.onProgressAll = function (progress) {
        console.info("onProgressAll", progress);
    };
    uploaderStore.onSuccessItem = function (fileItem, response, status, headers) {
        console.info("onSuccessItem", fileItem, response, status, headers);
    };
    uploaderStore.onErrorItem = function (fileItem, response, status, headers) {
        console.info("onErrorItem", fileItem, response, status, headers);
    };
    uploaderStore.onCancelItem = function (fileItem, response, status, headers) {
        console.info("onCancelItem", fileItem, response, status, headers);
    };
    uploaderStore.onCompleteItem = function (fileItem, response, status, headers) {
        console.info("onCompleteItem", fileItem, response, status, headers);
    };
    uploaderStore.onCompleteAll = function () {
        console.info("onCompleteAll");
    };

    console.info("uploaderStore", uploaderStore);

    // uploader product

    var uploaderProduct = $scope.uploaderProduct = new FileUploader({
        url: "http://api.genieapp.com/genie/api/upload/merchant/product"
    });

    // FILTERS

    uploaderProduct.filters.push({
        name: "customFilter",
        fn: function fn(item, /*{File|FileLikeObject}*/options) {
            return this.queue.length < 10;
        }
    });

    // CALLBACKS

    uploaderProduct.onWhenAddingFileFailed = function (item, /*{File|FileLikeObject}*/filter, options) {
        console.info("onWhenAddingFileFailed", item, filter, options);
    };
    uploaderProduct.onAfterAddingFile = function (fileItem) {
        console.info("onAfterAddingFile", fileItem);
    };
    uploaderProduct.onAfterAddingAll = function (addedFileItems) {
        console.info("onAfterAddingAll", addedFileItems);
    };
    uploaderProduct.onBeforeUploadItem = function (item) {
        console.info("onBeforeUploadItem", item);
    };
    uploaderProduct.onProgressItem = function (fileItem, progress) {
        console.info("onProgressItem", fileItem, progress);
    };
    uploaderProduct.onProgressAll = function (progress) {
        console.info("onProgressAll", progress);
    };
    uploaderProduct.onSuccessItem = function (fileItem, response, status, headers) {
        console.info("onSuccessItem", fileItem, response, status, headers);
    };
    uploaderProduct.onErrorItem = function (fileItem, response, status, headers) {
        console.info("onErrorItem", fileItem, response, status, headers);
    };
    uploaderProduct.onCancelItem = function (fileItem, response, status, headers) {
        console.info("onCancelItem", fileItem, response, status, headers);
    };
    uploaderProduct.onCompleteItem = function (fileItem, response, status, headers) {
        console.info("onCompleteItem", fileItem, response, status, headers);
    };
    uploaderProduct.onCompleteAll = function () {
        console.info("onCompleteAll");
    };

    console.info("uploaderProduct", uploaderProduct);

    // uploader consumer

    var uploaderConsumer = $scope.uploaderConsumer = new FileUploader({
        url: "http://api.genieapp.com/genie/api/upload/consumer"
    });

    // FILTERS

    uploaderConsumer.filters.push({
        name: "customFilter",
        fn: function fn(item, /*{File|FileLikeObject}*/options) {
            return this.queue.length < 10;
        }
    });

    // CALLBACKS

    uploaderConsumer.onWhenAddingFileFailed = function (item, /*{File|FileLikeObject}*/filter, options) {
        console.info("onWhenAddingFileFailed", item, filter, options);
    };
    uploaderConsumer.onAfterAddingFile = function (fileItem) {
        console.info("onAfterAddingFile", fileItem);
    };
    uploaderConsumer.onAfterAddingAll = function (addedFileItems) {
        console.info("onAfterAddingAll", addedFileItems);
    };
    uploaderConsumer.onBeforeUploadItem = function (item) {
        console.info("onBeforeUploadItem", item);
    };
    uploaderConsumer.onProgressItem = function (fileItem, progress) {
        console.info("onProgressItem", fileItem, progress);
    };
    uploaderConsumer.onProgressAll = function (progress) {
        console.info("onProgressAll", progress);
    };
    uploaderConsumer.onSuccessItem = function (fileItem, response, status, headers) {
        console.info("onSuccessItem", fileItem, response, status, headers);
    };
    uploaderConsumer.onErrorItem = function (fileItem, response, status, headers) {
        console.info("onErrorItem", fileItem, response, status, headers);
    };
    uploaderConsumer.onCancelItem = function (fileItem, response, status, headers) {
        console.info("onCancelItem", fileItem, response, status, headers);
    };
    uploaderConsumer.onCompleteItem = function (fileItem, response, status, headers) {
        console.info("onCompleteItem", fileItem, response, status, headers);
    };
    uploaderConsumer.onCompleteAll = function () {
        console.info("onCompleteAll");
    };

    console.info("uploaderConsumer", uploaderConsumer);

    // uploader transaction

    var uploaderTransaction = $scope.uploaderTransaction = new FileUploader({
        url: "http://api.genieapp.com/genie/api/upload/consumer"
    });

    // FILTERS

    uploaderTransaction.filters.push({
        name: "customFilter",
        fn: function fn(item, /*{File|FileLikeObject}*/options) {
            return this.queue.length < 10;
        }
    });

    // CALLBACKS

    uploaderTransaction.onWhenAddingFileFailed = function (item, /*{File|FileLikeObject}*/filter, options) {
        console.info("onWhenAddingFileFailed", item, filter, options);
    };
    uploaderTransaction.onAfterAddingFile = function (fileItem) {
        console.info("onAfterAddingFile", fileItem);
    };
    uploaderTransaction.onAfterAddingAll = function (addedFileItems) {
        console.info("onAfterAddingAll", addedFileItems);
    };
    uploaderTransaction.onBeforeUploadItem = function (item) {
        console.info("onBeforeUploadItem", item);
    };
    uploaderTransaction.onProgressItem = function (fileItem, progress) {
        console.info("onProgressItem", fileItem, progress);
    };
    uploaderTransaction.onProgressAll = function (progress) {
        console.info("onProgressAll", progress);
    };
    uploaderTransaction.onSuccessItem = function (fileItem, response, status, headers) {
        console.info("onSuccessItem", fileItem, response, status, headers);
    };
    uploaderTransaction.onErrorItem = function (fileItem, response, status, headers) {
        console.info("onErrorItem", fileItem, response, status, headers);
    };
    uploaderTransaction.onCancelItem = function (fileItem, response, status, headers) {
        console.info("onCancelItem", fileItem, response, status, headers);
    };
    uploaderTransaction.onCompleteItem = function (fileItem, response, status, headers) {
        console.info("onCompleteItem", fileItem, response, status, headers);
    };
    uploaderTransaction.onCompleteAll = function () {
        console.info("onCompleteAll");
    };

    console.info("uploaderTransaction", uploaderTransaction);

    // uploader cause

    var uploaderCause = $scope.uploaderCause = new FileUploader({
        url: "http://api.genieapp.com/genie/api/upload/merchant/cause"
    });

    // FILTERS

    uploaderCause.filters.push({
        name: "customFilter",
        fn: function fn(item, /*{File|FileLikeObject}*/options) {
            return this.queue.length < 10;
        }
    });

    // CALLBACKS

    uploaderCause.onWhenAddingFileFailed = function (item, /*{File|FileLikeObject}*/filter, options) {
        console.info("onWhenAddingFileFailed", item, filter, options);
    };
    uploaderCause.onAfterAddingFile = function (fileItem) {
        console.info("onAfterAddingFile", fileItem);
    };
    uploaderCause.onAfterAddingAll = function (addedFileItems) {
        console.info("onAfterAddingAll", addedFileItems);
    };
    uploaderCause.onBeforeUploadItem = function (item) {
        console.info("onBeforeUploadItem", item);
    };
    uploaderCause.onProgressItem = function (fileItem, progress) {
        console.info("onProgressItem", fileItem, progress);
    };
    uploaderCause.onProgressAll = function (progress) {
        console.info("onProgressAll", progress);
    };
    uploaderCause.onSuccessItem = function (fileItem, response, status, headers) {
        console.info("onSuccessItem", fileItem, response, status, headers);
    };
    uploaderCause.onErrorItem = function (fileItem, response, status, headers) {
        console.info("onErrorItem", fileItem, response, status, headers);
    };
    uploaderCause.onCancelItem = function (fileItem, response, status, headers) {
        console.info("onCancelItem", fileItem, response, status, headers);
    };
    uploaderCause.onCompleteItem = function (fileItem, response, status, headers) {
        console.info("onCompleteItem", fileItem, response, status, headers);
    };
    uploaderCause.onCompleteAll = function () {
        console.info("onCompleteAll");
    };

    console.info("uploaderCause", uploaderCause);
}]);
//# sourceMappingURL=core.merchanttable.js.map