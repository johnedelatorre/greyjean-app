'use strict';

angular.module('app').factory('Account', function ($http, $auth) {
  return {
    getProfile: function getProfile() {
      return $http.get('/api/me');
    },
    updateProfile: function updateProfile(profileData) {
      return $http.put('/api/me', profileData);
    }
  };
});
//# sourceMappingURL=account.js.map