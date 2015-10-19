'use strict';



//@ngInject
var router = function ($routeProvider, $locationProvider) {

  $locationProvider.html5Mode(true).hashPrefix('!');

  $routeProvider.when('/', {
    templateUrl: 'show/show.html',
    controller: 'NpdcShowController'
  });
};

module.exports = router;
