"use strict";

let angular = require('angular');

let NpdcShowController = function($scope, $location, $window,
  npdcAppConfig, NpdcApplications, NpdcSearchService, NpdcAutocompleteConfigFactory) {
  'ngInject';

  $scope.sections = NpdcApplications.filter(app => app.category === 'public');

  $scope.documents = [{
    link: "https://data.npolar.no/policy/NP-datapolitikk.pdf",
    name: "Data policy",
    img: "/home/img/open-data.jpg",
    description: ""
  }];
  $scope.apps = NpdcApplications.filter(app => app.category === 'public');

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

  $scope.click = function () {
    console.log('click');
  };

  $scope.icon96 = function (app) {
    return app.icons.find(icon => icon.size === 96).src;
  };

  angular.element($window).bind('scroll', (e, d) => {
    let sections = document.querySelectorAll('.home > section:not(.fixed)');
    let fixed = document.querySelector('.home > section.fixed');
    let scrollPos = document.body.scrollTop;
    if (fixed.nextElementSibling) {
      fixed.nextElementSibling.style.marginTop = fixed.offsetHeight + 'px';
    }
    angular.forEach(sections, (section, i) => {
      let pos = section.offsetTop - scrollPos;
      if (0 < pos && pos < 64) {
        angular.element(fixed).removeClass('fixed');
        angular.element(section).addClass('fixed');
        if (fixed.nextElementSibling) {
          fixed.nextElementSibling.style.marginTop = 0;
        }
        if (section.nextElementSibling) {
          section.nextElementSibling.style.marginTop = fixed.offsetHeight + 'px';
        }
      }
    });
  });

  $scope.$on("$destroy", function() {
    angular.element($window).unbind('scroll');
  });
};


module.exports = NpdcShowController;
