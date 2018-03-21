﻿'use strict';

var vbni = angular.module('vbni', ['ngRoute']);

const navCurrentChosenLink = 'mdl-navigation__link--current';
const mdlSelectClass = 'getmdl-select';
const escKey = 27;

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
        .when('/ReferencedToMe', {
            templateUrl: 'views/refsToMe.html',
            controller: 'RefsToMeCtrl'
        })
        .when('/GroupMeetings', {
            templateUrl: 'views/groupmeetings.html',
            controller: 'GroupMeetingsCtrl'
        })
        .when('/guestGroupChoose', {
            templateUrl: 'views/guestGroupChoose.html',
            controller: 'GuestGroupChooseCtrl'
        })
        .otherwise({
            templateUrl: 'views/home.html'
        })

    $locationProvider
        .html5Mode(false)
        .hashPrefix('');
});

// Adding go back support
vbni.run(['$rootScope', '$location', 'apiService', ($rootScope, $location, apiService) => {
    
    var history = [];

    $rootScope.$on('$routeChangeSuccess', function() {
        let path = $location.$$path;
        let pathIndex = history.indexOf(path);

        $(`.${navCurrentChosenLink}`).removeClass(navCurrentChosenLink);
        $(`a[href$="#${path}"]`).addClass(navCurrentChosenLink);

        // If path exists, remove it
        if (pathIndex > -1) {
            history.splice(pathIndex, 1);
        }
        
        history.push(path);
    });

    $rootScope.goBack = function () {
        var prevUrl = history.length > 1 ? history.splice(-2)[0] : "/";
        $location.path(prevUrl);
    };
}]);

vbni.controller('layoutCtrl')

// Fix problem where in small screens the drawer isn't closing on link click
vbni.directive('menuClose', function() {
    return {
        restrict: 'AC',
        link: function($scope, $element) {
            $element.bind('click', function() {
                var layout = $('.mdl-layout');
                var drawer = $('.mdl-layout__drawer.is-visible');
                if(layout.length > 0 && drawer.length > 0) {
                    layout[0].MaterialLayout.toggleDrawer();
                }
            });
        }
    };
});