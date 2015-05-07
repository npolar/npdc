'use strict';

/**
 * @ngInject
 */
var router = function ($routeProvider, $locationProvider) {

  $locationProvider.html5Mode(true).hashPrefix('!');

  $routeProvider.when('/:id', {
    templateUrl: 'test/show/show.html',
    controller: 'TestShowController',
    breadcrumbs: [{'href': '/path'}]}
   ).when('/:id/edit', {
    templateUrl: 'test/edit/edit.html',
    controller: 'TestEditController'
  }).when('/', {
    templateUrl: 'test/search/search.html',
    controller: 'TestSearchController'
  });
};

module.exports = router;
