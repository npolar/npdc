'use strict';
(function() {


// Angular module for interacting with Npolar APIs

var api = angular.module("npolarApi", ["ngResource", "base64", "angular-jwt"]);

api.filter('npolarApiAuthorFilter', function() {
  return function(person) {
    
    person = person || '';
    var author = _.find(person.roles, function(role) {
      return (role === "author");
    });
    
    if (author) {
      return person;
    } else {
      return null;
    }
    
  };
});

api.value("npolarApiConfig", {
  environment: "production",
  lang: "en",
  base: "//api.npolar.no",
  security: {
    authorization: "basic"
  }
});

//api.value("npolarApiModels", [
//  {"path": "/dataset", "resource": "Dataset"},
//  {"path": "/editlog", "resource": "Editlog"}, 
//  {"path": "/expedition", "resource": "Expedition"},
//  {"path": "/person", "resource": "Person"},
//  {"path": "/project", "resource": "Project"},
//  {"path": "/pubapilication", "resource": "Publication"},
//  {"path": "/service", "resource": "Service"},
//  {"path": "/tracking/deployment", "resource": "Tracker"},
//  {"path": "/user", "resource": "User"}
//]);

api.factory('npolarApiError', function ($rootScope, npolarApiConfig) {
  return function(error) {
      if (error.status) {
         $scope.error = error;
      } else {
         $scope.error = { status: 500, statusText: "Data API error", data: "Please inform data@npolar.no if this problem persists" };
      }
   }
});

/**
 *
 *
 *
 *
 */
api.factory('npolarApiAuthInterceptor', function ($rootScope, $q, $window, npolarApiConfig, npolarApiSecurity) {
  return {
    request: function (config) {
      // Only intercept Npolar API requests
      if (config.url.indexOf(npolarApiConfig.base) === 0) {
        config.headers = config.headers || {};
        config.headers.Authorization = npolarApiSecurity.authorization();
        console.log(config.method +" "+ config.url, config.params||{}, "[npolarApi]");
      } 
      return config;
    },
    response: function (response) {
      if (response.status >= 300 || response.status < 100 || response.config.method != "GET") {
        console.log(response.status +" "+ response.statusText + " <- "+ response.config.method +" "+ response.config.url + " [npolarApi]");
      }
      return response || $q.when(response);
    }
  };
});

/**
 *
 *
 *
 *
 *
 */
api.service('npolarApiText', function() {
  
  // Extract the first capture (1) for all regex matches in text
  this.extract = function(text, regex, capture_capture) {
    
    var extracted = []
    var m;
    var capture_which_capture = capture_capture || 1;
     
    while ((m = regex.exec(text)) !== null) {
      if (m.index === regex.lastIndex) {
         regex.lastIndex++;
      }
      extracted.push(m[capture_which_capture]);
    }
    return _.uniq(extracted);  
  };
  
});


// User object example
//{
//  "schema": ""
//  "id": "username",
//  "email": "login@example.com",
//  ("emails: [{"alternative@mail.com"}],)?
//  "name": "First Last",
// password: "base64(pkbf2 %%%%%%%%%%%%%%%%%%%%%%%%%%%%)"
// cipher: "ppkbf2"

//  "groups":[ {"system": "api", "group": "sysadmin"}, {"system": "pbhims", "role": "editor"],
//  "roles": [ {"system": "metadata": "role": "editor"}]
//}
api.service('npolarApiUser', function($base64, npolarApiConfig) {
  this.getUser = function() {    
    var user = sessionStorage.getItem(this.getStorageKey());
    if (angular.isString(user)) {
      return JSON.parse($base64.decode(user));
    } else {
      return {};
    }
  };
    
  this.setUser = function(user) {
    var key = this.getStorageKey(user);
    sessionStorage.setItem(key, $base64.encode(JSON.stringify(user)));
  }
  
  this.removeUser = function() {   
    sessionStorage.removeItem(this.getStorageKey());
  }
  
  this.getStorageKey = function(user) {
    return "npolarApiUser";
  }
  
});

api.service("npolarApiSecurity", function($base64, npolarApiConfig, npolarApiUser) {
  
  this.authorization = function() {
    
    var user = npolarApiUser.getUser();
    
    if ("basic" == npolarApiConfig.security.authorization) {
      return "Basic "+ this.basicToken(user);
    } else if ("jwt" == npolarApiConfig.security.authorization) {
      return "Bearer "+ this.jsonWebToken(user);
    } else {
      log.console("npolarApiSecurity authorization not implemented: " + npolarApiConfig.security.authorization);
      return "";
    }
  };
  
  this.basicToken = function(user) {
    return $base64.encode(user.username + ':' + user.password);
  };
  
  this.jsonWebToken = function(user) {
    return user.token_id;
  };
  
  this.user = function(user) {
    // if user not void and valid => setUser
    return this.getUser();
  };
  
  this.getUser = function() {
    return npolarApiUser.getUser();
  };
  
  this.setUser = function(user) {
    // if valid... @todo
    return npolarApiUser.setUser(user);
  };
  
  this.removeUser = function() {
    return npolarApiUser.removeUser();
  };
  
});

/**
 * NpolarApiBaseController is an abstract parent that provides methods for
 * manipulating documents using ngResource as well as various other
 * utility methods that are injected in child document controller's scope
 *
 * The following ngResource-bound methods are defined
 * - create()
 * - update()
 * - delete()
 * - save()
 * 
 * Usage:
 * 1. Inject $controller into child (e.g. "MyApiController") and call it with the parent controller name as argument 
 * 2. Inject $scope.resource, a ngResource (e.g MyModel -> NpolarApiResource -> ngResource)
 * 3. Inject $scope.document, typically in a callback after ngResource.fetch()
 * 
 * angular.module("myApp").controller("MyApiController", function($scope, $routeParams, $controller, MyModel) {
 * 
 * // 1. MyApiController -> NpolarApiBaseController
 * $controller("NpolarApiBaseController", {$scope: $scope});
 * 
 * // 2. Set resource for parent document operations
 * $scope.resource = MyModel;
 * 
 * // 3. Set document for resource (and view)
 * MyModel.fetch($routeParams, function(document) {
 *   $scope.document = document;
 * }, function() error {
 *   $scope.error = error;
 * });
 * 
 */
angular.module("npolarApi").controller("NpolarApiBaseController", function($scope, $location, $route, npolarApiConfig) {
  
  $scope.base = npolarApiConfig.base;
  $scope.environment = npolarApiConfig.environment;
  $scope.lang = npolarApiConfig.lang;
  
  $scope.create = function() {
    $scope.resource.save($scope.document, function(data) {
      $scope.document = data;
      $location.path($location.path().replace(/\/__new$/, "/"+data.id));
      $route.reload();
    }, function(error) {
      $scope.error = error;
    });
  };
  
  $scope.update = function() {
    $scope.resource.update($scope.document, function(data) {
      $scope.document = data;
      $route.reload();
      
    }, function(error) {
      $scope.error = error;
    });
  };
  
  $scope.save = function() {
    if (angular.isUndefined($scope.document.id)) {
      $scope.create();
    } else {
      $scope.update();
    } 
  };
  
  $scope.setLang = function(lang) {
    $scope.lang = lang;
    $scope.title = $scope.getTitle(lang);
  }
    
  $scope.getTitle = function(lang) {
    return _.where($scope.document.titles,
      { lang: lang }
    )[0].text || $scope.document.titles[0].text; 
  }
  
  $scope.isSuccess = function(status) {
    return (status >= 200 && status <= 299);
  }
  
  $scope.isError = function(status) {
    return (status <= 99 || status >= 400);
  }
  
});

/**

  @override NpolarApiBaseController is meant as a parent controller
  angular.module("npolarApi").controller('MyApiController', function($scope, $location) {
  
   TimeseriesController -> NpolarApiController
  $controller("NpolarApiBaseController", {$scope: $scope});

 set $scope.resource
*/

var npolarResource = api.service("NpolarApiResource", function(npolarApiConfig, npolarApiSecurity, $resource, $location) {

  this.base = function(service) {
    return (angular.isString(service.base)) ? service.base : npolarApiConfig.base;
  };
  
  this.error = function(response) {
    if (response.status && response.status >= 100) {
      return response;
    } else { 
      return { status: response.status||0, statusText: "Data API error", data: "Please inform data@npolar.no if this problem persists" };
    }
  };
  










  // NpolarApiResource factory
  // @param service e.g. { path: "/dataset", "resource": "Dataset"}
  // @return NpolarApiResource - extended ngResource
  // @todo service.get == null|GET|JSONP
  // @todo make extending ngResource optional
  // @todo Support user-supplied extending
  // @todo Support non-search engine query/array/fetch 
  this.resource = function(service) {
    
      var base = this.base(service);
      
      // Default parameters
      var params = { id:null, limit: 100, format: "json", q: "", variant: "atom" }
      
      var fields_feed = (angular.isString(service.fields)) ? service.fields : null ;  
      var fields_query = (angular.isString(service.fields)) ? service.fields : 'id,title,name,code,titles,links,created,updated' ;
      
      var params_feed = angular.extend({}, params, { fields: fields_feed });
      var params_query = angular.extend({}, params, { variant: "array", limit: 1000, fields: fields_query });
      
      // @todo Store information on which APIs are  used
            
      var resource = $resource(base+service.path+'/:id', {  }, {
        feed: { method: 'GET', params: params, headers: { Accept:"application/json" } }, 
        query: { method: 'GET', params: params_query, isArray: true },
        array: { method: 'GET', params: params_query, isArray: true },
        fetch: { method: 'GET', params: {}, headers: { Accept:"application/json" } },
        update: { method:'PUT', params: { id: "@id" }, headers: { Accept:"application/json", Authorization: npolarApiSecurity.authorization() } }
      });
    
      // Extend Npolar API resources (individual documents)
      angular.extend(resource.prototype, {
        // Usage: var parameter = timeseries._link({rel: "parameter", type: "application/json"}); 
        _link: function(link) {
          return _.find(this.links, link);
        },
        _links: function(link) {
          return _.select(this.links, link);
        },
        // @todo injectable resoiurce dereferencing...
        // @tods lambda functions on link/links
        _filters: function() {
          var filters = [];
          angular.forEach($location.search(), function(v,k) {
            if (k.match(/^filter-\w+/)) {
              var f = {};
              f[k]=v;
              filters.push(f);
            }
          });
          return filters;

        }
        
      });
      return resource;
    
    }
});


}());