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

  $scope.icon96 = function (app) {
    return app.icons.find(icon => icon.size === 96).src;
  };

  angular.element($window).bind('scroll', (e, d) => {
    let sections = document.querySelectorAll('.home > section:not(.fixed)');
    let scrollPos = document.body.scrollTop;
    let fixed = document.querySelector('.home > section.fixed');

    for (let i = 0; i < sections.length; i++) {
      let section = sections[i];
      let topPos = section.offsetTop - scrollPos;
      let bottomPos = topPos + section.clientHeight;
      //console.log('section', i, topPos, bottomPos);
      if (0 <= topPos && topPos <= 64) {
        //console.log('catch top', i);
        section.style.marginTop = 0;
        if (section.nextElementSibling) {
          //console.log('add top margin', i + 1);
          section.nextElementSibling.style.marginTop = section.clientHeight + 'px';
        }
        angular.element(section).addClass('fixed');
        angular.element(fixed).removeClass('fixed');
        if (fixed && fixed.nextElementSibling) {
          fixed.nextElementSibling.style.marginTop = 0;
        }
        break;
      }
      if (64 < bottomPos && bottomPos <= 128) {
        //console.log('catch bottom', i);
        angular.element(fixed).removeClass('fixed');
        if (fixed && fixed.nextElementSibling) {
          fixed.nextElementSibling.style.marginTop = 0;
        }
        break;
      }
    }
  });

  $scope.$on("$destroy", function() {
    angular.element($window).unbind('scroll');
  });
};


module.exports = NpdcShowController;
