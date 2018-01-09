const userCookieName = 'user';

angular.module('vbni').controller('LayoutCtrl', 
function($scope, $http, $rootScope, $location, apiService) {

    function checkIfUserCookie(cookie) {
        let cookieParts = cookie.split('=');
        
        if (cookieParts[0].trim() === userCookieName) {
            $rootScope.user = JSON.parse(decodeURIComponent(cookieParts[1]));

            $scope.username = $rootScope.user.firstName + " " + $rootScope.user.lastName;
        }
    }

    function setHomepageDetails() {
        let cookies = document.cookie.split(';');
        cookies.forEach(cookie => {
            checkIfUserCookie(cookie);
        });

        apiService.getNextMeeting($rootScope.user.groupId).then(function(data) {
            if (data) {
                $scope.nextMeeting = "Your next meeting is on " + new Date(data).toLocaleString()
            }
            else {
                $scope.nextMeeting = "You have no upcoming meetings";
            }
            
        }, function(err) {
            console.log(err);
        })
    }

    $scope.isInHome = function() {
        return $location.path() == '' ||
               $location.path() == '/' ;
    }

    apiService.getMembers().then((members) => {
        // Filter out the current user
        $rootScope.members = members.filter(m => m.userName != $rootScope.user.userName);
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
    let mdlComponentUpgraded = false;
    setHomepageDetails();
});
 