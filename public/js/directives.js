'use strict';

/* Directives */

angular.module('myApp.directives', []).
directive('keepoldvalueifnewisempty', function() {
	return {
		restrict: "E",
		link: function(scope, elm, attrs) {
			scope.$watch(attrs.val, function (newValue, oldValue) {
				newValue = !newValue ? oldValue : newValue;
				elm.html(newValue);
			});
		}
	};
});