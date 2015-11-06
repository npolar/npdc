"use strict";

// @ngInject
var NpdcShowController = function($scope, $http, $anchorScroll, npdcAppConfig, NpolarApiResource, NpdcAutocompleteConfigFactory) {
	$scope.options	= npdcAppConfig;
	$scope.latest	= {};

	[
		{ path: "/expedition", params: { "not-draft": "yes" } }
	].forEach(function(service) {
		var resource = NpolarApiResource.resource({ path: service.path });
		var params = { limit: 4, sort: "-created" };

		resource.array(Object.assign(params, service.params), response => {
			$scope.latest[service.path.slice(1)] = response;
		});
	});

	$anchorScroll();
};


// Aestethic page dynamics
(function(container) {
	document.addEventListener("DOMContentLoaded", function() {
		if((container = document.querySelector(container))) {
			var ease = function(pos, initial, target, len) { return (target - initial) * Math.pow(2.0, 10.0 * (pos / len - 1.0)) + initial; };
			var header = container.querySelector("header");
			var toolbar = container.querySelector("md-toolbar");
			var quicknav = header.querySelector(".quicknav");
			var pagenav = container.querySelector(".pagenav");
			var boxShadow = window.getComputedStyle(toolbar).boxShadow;
			var scrollUp = container.querySelector("#scroll-up");

			var pageSets = [
				{
					section: document.getElementById("news"),
					link: pagenav.querySelectorAll("a")[0]
				},
				{
					section: document.getElementById("expeditions"),
					link: pagenav.querySelectorAll("a")[1]
				},
				{
					section: document.getElementById("documents"),
					link: pagenav.querySelectorAll("a")[2]
				}
			];

			toolbar.style.boxShadow = "none";
			header.style.boxShadow = boxShadow;

			var updateCallback = function() {
				var scrollY = window.pageYOffset, scale = 1.0;

				if(container.offsetWidth > 700) {
					if(scrollY) {
						scale = Math.max(0.0, ease(scrollY, 1.0, 0.0, header.offsetHeight - toolbar.offsetHeight));
					}

					quicknav.style.transform = "translateY(calc(-50% + " + (scrollY / 2) + "px)) scale(" + scale + ")";

				} else {
					quicknav.style.transform = "none";
				}

				if(scrollY >= header.offsetHeight - toolbar.offsetHeight) {
					header.style.boxShadow = "none";
					toolbar.style.boxShadow = boxShadow;
					pagenav.classList.add("docked");
					scrollUp.style.transform = "scale(1.0)";
				} else {
					header.style.boxShadow = boxShadow;
					toolbar.style.boxShadow = "none";
					pagenav.classList.remove("docked");
					scrollUp.style.transform = "scale(0.0)";
				}

				pageSets.forEach(function(set, index, arr) {
					set.link.style.transform = ((scrollY >= set.section.offsetTop - toolbar.offsetHeight) ? "scale(0.0)" : "");
				});
			};

			window.addEventListener("scroll", updateCallback);
			window.addEventListener("resize", updateCallback);
		}
	});
})(".npdc-home");


module.exports = NpdcShowController;
