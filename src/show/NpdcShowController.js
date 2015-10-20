'use strict';

//@ngInclude
let NpdcShowController = function($scope, $http, npdcAppConfig, NpolarApiResource) {

  $scope.options = npdcAppConfig;
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

  const limit = 5;
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
