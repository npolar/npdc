"use strict";
/**
 * @ngInject
 */
var Config = function(environment) {
  
  this.detectEnvironment = function(hostname) {
    var environment;
    if ("localhost" === hostname) {
      environment = "development";
    } else if ("apptest.data.npolar.no" === hostname) {
      environment = "test";
    } else if ("api.npolar.no" === hostname) {
      environment = "production";
    }
    return environment;
  };
  
  var config = {};
  
  // Auto-detect environment
  if (window && (environment === undefined || environment === null)) {
    environment = this.detectEnvironment(window.location.hostname);
    console.log("Environment:", environment, "[auto-detected]");
  }
  
  config.environment = environment;
  
  if ("development" === environment) {
    config.base = "//localhost:9393";
  } else if ("test" === environment) {
    config.base = "//apptest.data.npolar.no";
  } else {
    config.base = "//api.npolar.no";
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