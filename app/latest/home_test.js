'use strict';
// http://www.ng-newsletter.com/advent2013/#!/day/19
// http://tech.pro/tutorial/1473/getting-started-with-angularjs-unit-testing
describe('datacentreApp.home module', function() {

  beforeEach(module('datacentreApp.home'));

  describe('view2 controller', function(){

    it('should ....', inject(function($controller) {
      //spec body
      var view2Ctrl = $controller('HomeController');
      expect(view2Ctrl).toBeDefined();
    }));

  });
});