'use strict';

function LatestController($scope, $http, NpolarApiSecurity, Editlog) {

  'ngInject';

  $scope.latest = { 'POST':[], 'PUT': [], 'DELETE': [] };
  let show = 15;
  ['POST'].forEach(verb => {
    Editlog.array({ q: '',
      'fields':'id,revision,endpoint,path,method,request.time,request.username,response.header.Location',
      'filter-endpoint': '/dataset|/publication|/project|/person|/indicator/timeseries',
      //'not-endpoint': '/tracking/polar-bear|/tracking/svalbard-reindeer ',
      sort: '-request.time',
      'filter-response.status': '200..299', 'filter-method': verb, limit: show}).$promise.then(edits => {

      edits.forEach(edit => {

        if (edit.response && edit.revision) {
          
          let location = '//api.npolar.no'+edit.response.header.Location.split('?')[0];
          $http.get(location).then(r => {
            edit.document = r.data;
            if (verb === 'POST') {
              edit.uri = 'https://data.npolar.no'+edit.endpoint +'/'+ edit.document.id;
            } else {
              edit.uri = 'https://data.npolar.no'+edit.path;
            }
            if (!$scope.latest[verb].find(e => e.uri === edit.uri) && $scope.latest[verb].length < show) {
              $scope.latest[verb].push(edit);
            }
          }, error => {
            console.log(`Consider: npolar-api -XDELETE /editlog/${edit.id}`);
          });
        }
        return edit;
      });
    });
  });

}
module.exports = LatestController;