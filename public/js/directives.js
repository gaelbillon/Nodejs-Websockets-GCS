'use strict';

/* Directives */

angular.module('myApp.directives', []).
directive('compass', function() {
	return {
		restrict: "A",
		link: function(scope, elm, attrs) {
			scope.$watch(attrs.heading, function (v, vn) {
			    // console.log('value changed, new value is: ' + v);
				console.log(v + ', ' + vn);
			});
		}
	};
});