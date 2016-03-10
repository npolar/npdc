'use strict';

// @ngInject
let GlobalSearchController = function($scope, $controller, $location, $q, npdcAppConfig, NpdcSearchService, NpdcApplications) {
  $controller('NpdcSearchResultsController', { $scope: $scope });

  $scope.options = npdcAppConfig;
  $scope.q = $location.search().q;

  $scope.icon = function (link) {
    let app = NpdcApplications.find(app => {
      return new RegExp(app.link).test(link);
    });
    if (app) {
      return app.icons.find(icon => icon.size === 48).src;
    }
  };

  let defaults = {
    limit: 10,
    score: true,
    fields: 'id,_score,schema,collection,titles,names,title,name,code,platform,publication_type,journal.name,published_sort,created_by,updated'
  };

  let search = function() {
    let query = Object.assign({}, defaults, $location.search());
    let q = query.q;
    NpdcSearchService.searchCollections(q, { query }).then(results => {
      $scope.results = results;
    });
  };

  search();
};

module.exports = GlobalSearchController;
