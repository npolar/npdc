"use strict";

// @ngInject
var NpdcShowController = function($scope, $http, $anchorScroll, npdcAppConfig, NpolarApiResource, NpdcAutocompleteConfigFactory) {
	$scope.options	= npdcAppConfig;
	$scope.latest	= {};
	$scope.stats	= [];

	[
		{ path: "/dataset",     params: { "not-draft": "yes", limit: 6, sort: "-created" } },
		{ path: "/expedition",  params: { "not-draft": "yes", limit: 4, sort: "-created" } }
	]
	.forEach(function(service) {
		var resource = NpolarApiResource.resource({ path: service.path });

		resource.array(service.params, response => {
			$scope.latest[service.path.slice(1)] = response;
		});
	});


	[
		{ title: "API's",                   path: "/service"        },
		{ title: "Datasets",                path: "/dataset"        },
		{ title: "Publications",            path: "/publication"    },
		{ title: "Placenames",              path: "/placename"      },
		{ title: "Edits",                   path: "/editlog"        },
		{ title: "Oceanographic Points",    path: "/oceanography"   }
	]
	.forEach(function(service) {
		var resource = NpolarApiResource.resource({ path: service.path });

		resource.feed({ limit: 0 }, response => {
			$scope.stats.push({
				title: service.title,
				count: response.feed.opensearch.totalResults,
				href: "//api.npolar.no" + service.path
			});
		});
	});

	$anchorScroll();
};


// Aestethic page dynamics
(function() {
	document.addEventListener("DOMContentLoaded", function() {
		var boxShadow = window.getComputedStyle(document.querySelector(".npdc-home md-toolbar")).boxShadow;

		function ease(pos, initial, target, len) {
			return Math.min(initial, Math.max(target, (target - initial) * Math.pow(2, 4 * (pos / len - 1)) * Math.sin(pos / len * (Math.PI / 2)) + initial));
		}

		function updateCallback() {
			var container   = document.querySelector(".npdc-home");
			var header      = container.querySelector("header");
			var toolbar     = container.querySelector("md-toolbar");
			var quicknav    = header.querySelector(".quicknav");
			var pagenav     = container.querySelector(".pagenav");
			var scroller    = container.querySelector("#scroll-up");

			var scrollY     = window.pageYOffset, scale = 1.0;

			var pageSets = [
				{
					section: document.getElementById("datasets"),
					link: document.querySelectorAll(".pagenav a")[0]
				},
				{
					section: document.getElementById("expeditions"),
					link: document.querySelectorAll(".pagenav a")[1]
				},
				{
					section: document.getElementById("documents"),
					link: document.querySelectorAll(".pagenav a")[2]
				}
			];

			if(container.offsetWidth > 700) {
				(scrollY && (scale = ease(scrollY, 1.0, 0.0, header.offsetHeight - toolbar.offsetHeight)));
				quicknav.style.transform = "translateY(calc(-50% + " + (scrollY / 2) + "px)) scale(" + scale + ")";
				quicknav.style.opacity   = scale;
			} else {
				quicknav.style.transform = "none";
			}

			if(scrollY >= header.offsetHeight - toolbar.offsetHeight) {
				header.style.boxShadow = "none";
				toolbar.style.boxShadow = boxShadow;
				pagenav.classList.add("docked");
				scroller.style.transform = "scale(1.0)";
			} else {
				header.style.boxShadow = boxShadow;
				toolbar.style.boxShadow = "none";
				pagenav.classList.remove("docked");
				scroller.style.transform = "scale(0.0)";
			}

			pageSets.forEach(function(set, index, arr) {
				set.link.style.transform = ((scrollY >= set.section.offsetTop - toolbar.offsetHeight) ? "scale(0.0)" : "");
			});
		}

		window.addEventListener("scroll", updateCallback);
		window.addEventListener("resize", updateCallback);
		updateCallback();
	});
})();


module.exports = NpdcShowController;
