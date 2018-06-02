'use strict';

var vbni = angular.module('vbni', ['ngRoute']);

const navCurrentChosenLink = 'mdl-navigation__link--current';
const mdlSelectClass = 'getmdl-select';
const mdlTextFieldClass = 'mdl-textfield';
const isFocusedClass = 'is-focused';
const isDirtyClass = 'is-dirty';
const isUpgradedClass = 'is-upgraded';
const isInvalidClass = 'is-invalid';
const escKey = 27;

vbni.config(function ($routeProvider, $locationProvider, $httpProvider) {
    $httpProvider.defaults.headers.delete = {"Content-Type": "application/json;charset=utf-8"};

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
        .when('/Manage', {
            templateUrl: 'views/manage.html',
            controller: 'ManageCtrl'
        })
        .when('/Register', {
            templateUrl: 'views/register.html',
            controller: 'RegisterCtrl'
        })
        .when('/MyProfile', {
            templateUrl: 'views/myProfile.html',
            controller: 'ProfileCtrl'
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

    $rootScope.isGuest = () => $root.user.userName == 'guest';
    
}]);

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

let showMessage = (message) => {
    let showMessageWhenPossible = (snackbar) => {
        snackbar.showSnackbar({message: message});
    };
    
    let materialSnackbar = $('#snackbarContainer')[0].MaterialSnackbar;
    if (!materialSnackbar) {
        setTimeout(() => {
            materialSnackbar = $('#snackbarContainer')[0].MaterialSnackbar;
            showMessageWhenPossible(materialSnackbar);
        });
    }
    else {
        showMessageWhenPossible(materialSnackbar);
    }
};