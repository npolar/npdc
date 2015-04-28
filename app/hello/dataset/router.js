'use strict';

/**
 * @ngInject
 */
var Router = function ($routeProvider, $locationProvider) {

  $locationProvider.html5Mode(true).hashPrefix('!');

  $routeProvider.when('/:id', {
    templateUrl: 'show/show.html',
    controller: 'ShowController',
    breadcrumbs: [{'href': '/path'}]}
   ).when('/:id/edit', {
    templateUrl: 'edit/edit.html',
    controller: 'EditController'
  }).when('/', {
    templateUrl: 'search/search.html',
    controller: 'SearchController'
  });
};

module.exports = Router;
