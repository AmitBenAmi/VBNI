'use strict';

var vbni = angular.module('vbni', ['ngRoute']);

vbni.config(function ($routeProvider, $locationProvider) {
    $routeProvider.when('/MyGroup', {
        templateUrl: 'views/mygroup.html',
        controller: 'GroupCtrl'
    }).otherwise({
        templateUrl: 'views/home.html',
        contollerL: 'MainCtrl'
    })
});

