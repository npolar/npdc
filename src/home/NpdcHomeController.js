'use strict';

function NpdcShowController($scope, $location, $timeout,
    NpolarApiSecurity,
    npdcAppConfig, NpdcApplications, NpdcSearchService, NpdcAutocompleteConfigFactory,
    Editlog) {

  'ngInject';

  $scope.security = NpolarApiSecurity;

  $scope.sections = NpdcApplications.filter(app => app.category === 'public');
  $scope.banners = $scope.sections.filter(app => app.promote && app.screenshots.length);

  $scope.documents = [{
    link: "https://data.npolar.no/policy/NP-datapolitikk-nb_NO.pdf",
    name: "Datapolitikk (norsk bokmål)",
    img: "/home/img/norway_round_icon_256.png"
  }, {
    link: "https://data.npolar.no/policy/NPI-data-policy-en_GB.pdf",
    name: "Data policy (English)",
    img: "/home/img/united_kingdom_round_icon_256.png"
  }];

  $scope.apps = NpdcApplications.filter(app => app.category === 'public');

  if (NpolarApiSecurity.isAuthenticated()) {
    $scope.user = NpolarApiSecurity.getUser();
    let lowercaseName = $scope.user.name.split(' ').join('+');
    Editlog.facets({q:'', 'filter-request.username': $scope.user.email}, r => {
      $scope.endpoints = r.find(f => f.facet === 'endpoint').terms.map(t => {
        return { text: t.term, href: `${t.term}?q=${lowercaseName}`, count: t.count }; });
    });
  }

  $scope.searchOptions = new NpdcAutocompleteConfigFactory({
    global: true,
    showCollections: false,
    floatingLabel: false
  });

  $scope.search = function(q) {
    let query = Object.assign({},
      $location.search(), {
        q: $scope.searchOptions.q
      });
    NpdcSearchService.globalSearch(query);
  };

  $scope.icon96 = function (app) {
    return app.icons.find(icon => icon.size === 96).src;
  };
}


module.exports = NpdcShowController;
