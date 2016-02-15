"use strict";

var NpdcShowController = function($scope, $location, npdcAppConfig, NpdcSearchService, NpdcAutocompleteConfigFactory) {
  'ngInject';

  $scope.sections = [
    {
        link: "/dataset",
        name: "Datasets",
        img: "/home/img/dataset.png",
        description: "Datasets across a varient of fields spanning from the 1900 to present day."
      }, {
        link: "/publication",
        name: "Publications",
        img: "/home/img/publication.png",
        description: "Publication published by scientists at the Norwegian Polar Institute."
      }
  ];

  $scope.documents = [{
    link: "https://data.npolar.no/policy/NP-datapolitikk.pdf",
    name: "Data policy",
    img: "/home/img/open-data.jpg",
    description: ""
  }];
  $scope.apps = [{
      link: "/dataset",
      name: "Datasets",
      img: "/assets/img/menu/96/dataset.png",
      description: "Datasets across a varient of fields spanning from the 1900 to present day."
    }, {
      link: "/geodata",
      name: "Geodata",
      img: "/assets/img/menu/96/geodata.png",
      description: "Map services for svalbard, the arctic and antarctica."
    }, {
      link: "/publication",
      name: "Publications",
      img: "/assets/img/menu/96/publications.png",
      description: "Publication published by scientists at the Norwegian Polar Institute."
    },
    //   {
    //   link: "/expedition",
    //   name: "Expeditions",
    //   img: "/assets/img/menu/96/expeditions.png"
    // },
    {
      link: "/vessel",
      name: "Historic Vessels",
      img: "/assets/img/menu/96/vessels.png",
      description: "Historic record of ships used in polar exploration."
    }, {
      link: "/map/archive",
      name: "Map archive",
      img: "/assets/img/menu/96/map_archive.png",
      description: "Historic record of maps from the polar regions."
    }, {
      link: "/people",
      name: "People",
      img: "/assets/img/menu/96/people.png",
      description: "Browse employees at the institue."
    }, {
      link: "http://placenames.npolar.no",
      name: "Placenames",
      img: "/assets/img/menu/96/placenames.png",
      description: "Official placename database for the polar regions."
    }, {
      link: "/indicator/timeseries",
      name: "Timeseries",
      img: "/assets/img/menu/96/timeseries.png",
      description: "Long-term environmental monitoring timeseries."
    }
    // {
    //   link: "/project",
    //   name: "Projects",
    //   img: "/assets/img/menu/96/projects.png"
    // },
  ];
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
};


module.exports = NpdcShowController;
