'use strict';

// @ngInject
let GlobalSearchController = function($scope, $controller, $location, $q, npdcAppConfig, NpdcSearchService) {
  $controller('NpdcSearchResultsController', { $scope: $scope });

  $scope.options = npdcAppConfig;
  $scope.q = $location.search().q;

  let defaults = {
    limit: 10,
    score: true,
    fields: 'id,_score,schema,collection,titles,names,title,name,code,platform,publication_type,journal.name,published_sort,created_by,updated'
  };

  let search = function() {
    let query = Object.assign({}, defaults, $location.search());
    let q = query.q;
    NpdcSearchService.searchCollections(q).then(results => {
      $scope.results = results;
    });
  };

  search();
};

module.exports = GlobalSearchController;
