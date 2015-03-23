"use strict"; (function() {

  angular.module("navigation", ["ngResource"]).factory("Nav", function(NavResource) {
    
    return angular.extend(NavResource, {
          
      nav: function(user){
        var nav = [];
        return NavResource.array(function(data) {
          console.log("Nav user", user);
          
          var nav = _.reject(data, function(li) {
            
            if (angular.isDefined(li.access)) {
              console.log(li.access);
              return true;
            } else {
              return false;
            }
          });
          return nav;
        });
        
    
      }
      
    });
    
  });

})();