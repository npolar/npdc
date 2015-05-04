'use strict';

/**
 * @ngInject
 */
var router = function ($routeProvider, $locationProvider) {

  $locationProvider.html5Mode(true).hashPrefix('!');

  $routeProvider.when('/:id', {
    template: require('./show/show.html'),
    controller: 'DatasetShowController',
    breadcrumbs: [{'href': '/path'}]}
   ).when('/:id/edit', {
    template: require('./edit/edit.html'),
    controller: 'DatasetEditController'
  }).when('/', {
    template: require('./search/search.html'),
    controller: 'DatasetSearchController'
  });
};

module.exports = router;
