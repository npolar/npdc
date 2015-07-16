"use strict";
/**
 * @ngInject
 */
var Config = function(environment) {
  var config;
  
  if ("development" === environment) {
    config = { "environment": "development", "base": "//localhost:9393" };
  } else if ("test" === environment) {
    config = { "environment": "test", "base": "//apptest.data.npolar.no" };
  } else {
    config = { "environment": "production", "base": "//api.npolar.no" };
  }
  
  if ("production" === environment && window) {
    
    if ("https:" !== window.location.production) {
      console.error("WARNING", "Not using HTTPS in production environment");
    }
    if ("data.npolar.no" !== window.location.hostname) {
      console.error("WARNING", "Running against production API", config.base, "from", window.location.href);
    }
  }
  return config; 
};

module.exports = Config;