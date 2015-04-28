"use strict"; (function() {
  
  angular.module("loginApp").controller("LoginController", function ($scope, $http, $location, npolarApiSecurity, User, Auth, Nav) {
    
    $scope.user = npolarApiSecurity.getUser();
    
    $scope.nav = Nav.nav($scope.user);
  
    
    $scope.login = function() {
      if (!$scope.user.username || !$scope.user.password) {
        return false;
      }
      //$scope.authenticate();
      
      // Inject new credentials for authInterceptor
      npolarApiSecurity.setUser($scope.user);
      
      // Attempt to fetch user (username/password)
      var id = encodeURIComponent($scope.user.username).replace(/%20/g,'+');
      
      //http://api.npolar.no/user/authenticate
      var response = User.fetch({id: id});
      
      response.$promise.then(function(user) {
        $scope.authenticated = true;
        $scope.error = false;
        
        // @todo DON'T do this (yet): $scope.user = response.data.user;
        $scope.user.name = user.name;
        npolarApiSecurity.setUser($scope.user);
        
      }, function(error) {
        
        $scope.error = error;
        $scope.logout();
        
      }); 
      
    };
    
    $scope.authenticate = function() {
      var response = Auth.fetch({id: ""});
      
      response.$promise.then(function(user) {
        $scope.authenticated = true;
        $scope.error = false;
        
        // @todo DON'T do this (yet): $scope.user = response.data.user;
        $scope.user.name = user.name;
        npolarApiSecurity.setUser($scope.user);
        
      }, function(error) {
        
        $scope.error = error;
        $scope.logout();
        
      }); 
    }
    
    $scope.logout = function() {
      $scope.user = {}
      $scope.authenticated = false;
      npolarApiSecurity.removeUser();
    }
    
    if ($scope.user.username && $scope.user.password) {
      $scope.login();
    }
  
  });

}());