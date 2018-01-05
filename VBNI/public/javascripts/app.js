'use strict';

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
        .when('/ReferencedToMe', {
            templateUrl: 'views/refsToMe.html',
            controller: 'RefsToMeCtrl'
        })
        .when('/GroupMeetings', {
            templateUrl: 'views/groupmeetings.html',
            controller: 'GroupMeetingsCtrl'
        })
        .otherwise({
            templateUrl: 'views/home.html'
        })

    $locationProvider
        .html5Mode(false)
        .hashPrefix('');
});

vbni.run(function ($rootScope, $location) {
    
        var history = [];
    
        $rootScope.$on('$routeChangeSuccess', function() {
            let path = $location.$$path;
            let pathIndex = history.indexOf(path)

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
    
    });