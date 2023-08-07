// angular.module('myApp', ['ngRoute', 'TokenModule', 'UserListModule'])
//   .config(function ($routeProvider) {
//     $routeProvider
//       .when('/', {
//         templateUrl: 'TokenModule/token.html',
//         controller: 'TokenController'
//       })
//       .when('/token', {
//         templateUrl: 'TokenModule/token.html',
//         controller: 'TokenController'
//       })
//       .when('/fetch-users', {
//         templateUrl: 'UserListModule/userlist.html',
//         controller: 'UserListController',
//         resolve: {
//           userList: function (UserListService) {
//             return UserListService.fetchUserList();
//           }
//         }
//       })
//       .otherwise({
//         redirectTo: '/'
//       });
//   })
//   .controller('MainController', function ($scope, AuthService, $location) {
//     $scope.isTokenPresent = AuthService.isTokenPresent();
//     $scope.isUserListFetched = false;

//     $scope.fetchUserList = function () {
//       if ($scope.isTokenPresent) {
//         $scope.isUserListFetched = true;
//         $location.path('/fetch-users');
//       } else {
//         alert('Please enter a valid token first.');
//       }
//     };
//   })
//     .factory('AuthService', function ($q, $http) {
//     return {
//       isTokenPresent: function () {
//         return localStorage.getItem('user') === null;
//       },
//       authenticate: function (token) {
//         var deferred = $q.defer();
//         if (token) {
//           $http.get('https://api.github.com/user', {
//             headers: {
//               Authorization: `token ${token}`
//             }
//           })
//           .then(function (response) {
//             if (response.status === 200) {
//               console.log('Token is valid:', token);
//               deferred.resolve(true); 
//             } else {
//               console.log('Token is invalid:', token);
//               deferred.reject(false); 
//             }
//           })
//           .catch(function (error) {
//             console.log('Error occurred:', error);
//             deferred.reject(false); 
//             alert('Token is invalid');
//           });
//         } else {
//           console.log('Empty token provided.');
//           deferred.reject(false); 
//         }
//         return deferred.promise;
//       }
//     };
//   });

angular.module('myApp', ['ngRoute', 'TokenModule', 'UserListModule'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'TokenModule/token.html',
        controller: 'TokenController'
      })
      .when('/token', {
        templateUrl: 'TokenModule/token.html',
        controller: 'TokenController'
      })
      .when('/fetch-users', {
        templateUrl: 'UserListModule/userlist.html',
        controller: 'UserListController',
        resolve: {
          userList: function (UserListService) {
            return UserListService.fetchUserList();
          }
        }
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .controller('MainController', function ($scope, AuthService, $location) {
    $scope.isTokenPresent = AuthService.isTokenPresent();
    $scope.isUserListFetched = false;
    $scope.isTokenView = false; // Add this line
  
    $scope.fetchUserList = function () {
      if ($scope.isTokenPresent) {
        AuthService.authenticate(localStorage.getItem('user'))
          .then(function (isValid) {
            if (isValid) {
              $scope.isTokenView = true; // Set the flag for token view
              $scope.isUserListFetched = true;
              $location.path('/fetch-users');
            } else {
              alert('Please enter a valid token first.');
            }
          })
          .catch(function () {
            alert('Token validation error occurred.');
          });
      } else {
        alert('Please enter a valid token first.');
      }
    };
  })
  .factory('AuthService', function ($q, $http) {
    return {
      isTokenPresent: function () {
        return localStorage.getItem('user') !== null;
      },
      authenticate: function (token) {
        var deferred = $q.defer();
        if (token) {
          $http.get('https://api.github.com/user', {
            headers: {
              Authorization: `token ${token}`
            }
          })
          .then(function (response) {
            if (response.status === 200) {
              console.log('Token is valid:', token);
              deferred.resolve(true);
            } else {
              console.log('Token is invalid:', token);
              deferred.reject(false);
            }
          })
          .catch(function (error) {
            console.log('Error occurred:', error);
            deferred.reject(false);
            alert('Token is invalid');
          });
        } else {
          console.log('Empty token provided.');
          deferred.reject(false);
        }
        return deferred.promise;
      }
    };
  });
