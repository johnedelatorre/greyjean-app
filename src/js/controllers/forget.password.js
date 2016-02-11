"use strict";
app.controller("ForgetPasswordCtrl", ["$scope", "$rootScope", "locker",  "Campaign",  "$state", "$stateParams", "$filter", "$mdToast", "$mdDialog", "$animate", "Fingerprint", "Offer", "Auth",
    function(                                $scope,   $rootScope,   locker,    Campaign,    $state,   $stateParams,   $filter,   $mdToast,   $mdDialog,   $animate, Fingerprint, Offer, Auth){

     let merchant = {};
     $scope.toggleWizardLoader = {};
     $scope.newPassword = () => {
     $scope.toggleWizardLoader.showLoader = true;
       let emailId  = $scope.merchant.email;
       let merchantEmailId = {
         Email:emailId
       };

         Auth.newPassword(merchantEmailId).then(response =>{
           let newPassword = response.FlikResponse.Data.Merchant.Get.loginId;
           $scope.toggleWizardLoader.showLoader = false;
           let statusCode = response.FlikResponse.Status.StatusCode;
           let statusMessage = response.FlikResponse.Status.StatusMessage;
           if(statusCode == 0){
             $scope.isCollapsed = false;
             $mdDialog.show(
               $mdDialog.alert()
                 .title('Your New Password is')
                 .content("newpassword")
                 .ariaLabel('Alert Dialog Demo')
                 .ok('Got it!')
                 .targetEvent()
               );

           }else{
               $scope.toggleWizardLoader.showLoader = false;
               $mdToast.show(
                   $mdToast.simple()
                       .content(statusMessage)
                       .position("top right")
                       .hideDelay(2700)
               );

           }

         }, error =>{
            $scope.toggleWizardLoader.showLoader = false;
            $mdToast.show(
                $mdToast.simple()
                    .content("there was an error for getting your new password")
                    .position("top right")
                    .hideDelay(2700)
            );

        });

        };

    }]);
