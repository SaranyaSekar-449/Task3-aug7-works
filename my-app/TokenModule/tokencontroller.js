var tokenModule = angular.module('TokenModule', []);
tokenModule.factory('TokenService', function () {
  var token = ''; 

  return {
    getToken: function () {
      return token;
    },
    setToken: function (newToken) {
      token = newToken;
    }
  };
})
tokenModule.controller('TokenController', function ($scope, AuthService, $location, TokenService) {
  $scope.login = function () {
    AuthService.authenticate($scope.token).then(function (success) {
      if (success) {
        alert('Token is valid. You can now fetch users.');
        TokenService.setToken($scope.token);
        $location.path('/fetch-users');
      } else {
        alert('Invalid token. Please try again.');
      }
    });
  };
})


tokenModule.directive('customLogin', function () {
  return {
    restrict: 'E',
    templateUrl: 'TokenModule/token.html',
    controller: 'TokenController',
  };
});
