'use strict';

/**
 * @ngInject
 */
var router = function ($routeProvider, $locationProvider) {

  $locationProvider.html5Mode(true).hashPrefix('!');

  $routeProvider.when('/:id', {
    templateUrl: 'dataset/show/show.html',
    controller: 'DatasetShowController',
    breadcrumbs: [{'href': '/path'}]}
   ).when('/:id/edit', {
    templateUrl: 'dataset/edit/edit.html',
    controller: 'DatasetEditController'
  }).when('/', {
    templateUrl: 'dataset/search/search.html',
    controller: 'DatasetSearchController'
  });
};

module.exports = router;
