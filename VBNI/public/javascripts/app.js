﻿'use strict';

var vbni = angular.module('vbni', ['ngRoute']);

vbni.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/MyGroup', {
            templateUrl: 'views/mygroup.html',
            controller: 'GroupCtrl'
        })
        .when('/MyReferences', {
            templateUrl: 'views/myreferences.html',
            controller: 'MyRefsCtrl'
        })
        .when('ReferencedToMe', {
            templateUrl: 'views/refsToMe.html',
            controller: 'RefsToMeCtrl'
        })
        .when('GroupMeetings', {
            templateUrl: 'views/groupmeetings.html',
            controller: 'GroupMeetingsCtrl'
        })
        .otherwise({
            templateUrl: 'views/home.html',
            controller: 'MainCtrl'
        })

    $locationProvider.html5Mode(true);
});

