'use strict';

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
    let mdlComponentUpgraded = false;

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

    apiService.getMembers().then((members) => {
        $rootScope.members = members;
    });

    let disposeScopeVars = () => {
        delete $rootScope.createReferenceClientName;
        delete $rootScope.referenceReferenceToName;
        delete $rootScope.createReferenceReferenceTo;
    };

    let closeDialog = () => {
        let dialog = $('#createReferenceDialog')[0];

        disposeScopeVars();

        if (dialog) {
            dialog.close();
        }
    };
    
    let showCreateReferenceDialog = () => {
        let dialog = $('#createReferenceDialog')[0];

        if (dialog) {
            dialog.showModal();

            if (!mdlComponentUpgraded && 
                getmdlSelect &&
                typeof(getmdlSelect.init) === 'function') {
                // Updating Material Design Lite elements (For Dialog of members that value can be shown)
                getmdlSelect.init(`.${mdlSelectClass}`);

                mdlComponentUpgraded = !mdlComponentUpgraded;

                dialog.addEventListener('keydown', (e) => {
                    if (e.keyCode === escKey) {
                        disposeScopeVars();
                    }
                });
            }
        }
    };

    let createReference = () => {
        apiService.createReferral($rootScope.createReferenceReferenceTo.userName, $rootScope.createReferenceClientName)
            .then(() => {
                closeDialog();
            });
    };

    $rootScope.closeDialog = closeDialog;
    $rootScope.showCreateReferenceDialog = showCreateReferenceDialog;
    $rootScope.createReference = createReference;
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