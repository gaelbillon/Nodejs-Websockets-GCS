'use strict';

/* Directives */

angular.module('myApp.directives', []).
directive('keepoldvalueifnewisempty', function() {
	return {
		restrict: "E",
		link: function(scope, elm, attrs) {
			scope.$watch(attrs.val, function(newValue, oldValue) {
				newValue = !newValue ? oldValue : newValue;
				elm.html(newValue);
			});
		}
	};
});

angular.module('myApp.directives').
directive('d3plot', function() {
	return {
		restrict: "E",
		scope: {
			val: '='
		},
		link: function(scope, element, attrs) {

			var data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
			var margin = {
				top: 10,
				right: 10,
				bottom: 20,
				left: 40
			},
				width = 1280 - margin.left - margin.right,
				height = 170 - margin.top - margin.bottom;

			var x = d3.scale.linear()
				.domain([0, 40 - 1])
				.range([0, width]);

			var y = d3.scale.linear()
				.domain([0, 360])
				.range([height, 0]);

			var line = d3.svg.line()
				.x(function(d, i) {
				return x(i);
			})
				.y(function(d, i) {
				return y(d);
			});

			var svg = d3.select('d3plot').append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			svg.append("defs").append("clipPath")
				.attr("id", "clip")
				.append("rect")
				.attr("width", width)
				.attr("height", height);

			svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")")
				.call(d3.svg.axis().scale(x).orient("bottom"));

			svg.append("g")
				.attr("class", "y axis")
				.call(d3.svg.axis().scale(y).orient("left"));

			var path = svg.append("g")
				.attr("clip-path", "url(#clip)")
				.append("path")
				.data([data])
				.attr("class", "line")
				.attr("d", line);

			scope.$watch('val', function(newVal, oldVal) {
				if (newVal) {
					data.push(newVal);
					console.log(data);

					// redraw the line, and slide it to the left
					path
						.attr("d", line)
						.attr("transform", null)
						.transition()
						.duration(300)
						.ease("linear")
						.attr("transform", "translate(" + x(-1) + ")");

					data.shift();
				}
			});

		}
	};
});