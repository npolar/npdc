'use strict';

// @ngInject
let GlobalSearchController = function($scope, $controller, $location, $q, npdcAppConfig, NpolarApiResource) {
  $controller('NpdcSearchResultsController', { $scope: $scope });
  let collections = npdcAppConfig.search.global.collections;

  $scope.options = npdcAppConfig;
  $scope.q = $location.search().q;

  $scope.entryHref = function (entry) {
    let id = entry.id;
    if ((/[.]/).test(id)) {
      id += ".json";
    }
    return '/' + entry.collection + '/' + id;
  };

  let defaults = {
    limit: 10,
    score: true,
    fields: 'id,_score,schema,collection,titles,names,title,name,code,platform,publication_type,journal.name,published_sort,created_by,updated'
  };

  let search = function() {
    let searchCollections = [];
    let query = Object.assign({}, defaults, $location.search());
    Object.keys(collections).forEach(c => {
      if (collections[c]) {
        searchCollections.push(NpolarApiResource.resource({ path: '/' + c.replace(/^\//, '')}));
      }
    });
    return $q.all(searchCollections.map(resource => resource.array(query).$promise))
      .then(results => {
        $scope.results = results.reduce((a, b) => a.concat(b)).sort((a, b) => a._score < b._score);
      });
  };

  search();
};

module.exports = GlobalSearchController;
