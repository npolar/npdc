'use strict';

// @ngInject
let NpdcShowController = function($scope, $http, npdcAppConfig, NpolarApiResource, NpdcAutocompleteConfigFactory) {

  $scope.options = npdcAppConfig;
  $scope.options.search.autocomplete = new NpdcAutocompleteConfigFactory({showCollections: true});

  $scope.latest=[];

  let x = [
    { path: '/dataset'     , params: { 'not-draft': 'yes' } } ,
    { path: '/map/archive' , params: { 'not-draft': 'yes' } } ,
    { path: '/expedition'  , params: { 'not-draft': 'yes' } } ,
    { path: '/publication' , params: { 'not-draft': 'yes' } } ,
    { path: '/project'     , params: { 'not-draft': 'yes' } } ,
    { path: '/expedition'  , params:{}}
  ];

  let resourceFactory = function(path) {
    let service = { path };
    return NpolarApiResource.resource(service);
  };

  const limit = 4;
  let params = { limit, sort: '-created' };

  let fetchLatest = function() {
    x.forEach(r => {
      let R = resourceFactory(r.path);
      R.array(Object.assign(params, r.params), response => {
        $scope.latest[r.path.replace('/', '')] = response;
      });
    });
  };


  fetchLatest();
};

module.exports = NpdcShowController;
