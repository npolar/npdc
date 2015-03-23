'use strict';

angular.module('datacentreHome', ['ngRoute'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'home/view1.html',
    controller: 'HomeController'
  });
}])

.controller('View1Ctrl', [function() {

}]);
