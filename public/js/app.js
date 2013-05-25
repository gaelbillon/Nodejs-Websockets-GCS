'use strict';


// Declare app level module which depends on filters, and services
var app = angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', "google-maps"]).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.otherwise({redirectTo: '/view1'});
    $locationProvider.html5Mode(true);
  }]);