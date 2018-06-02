const userCookieName = 'user';

angular.module('vbni').controller('LayoutCtrl', 
function($scope, $http, $rootScope, $location, apiService) {

    function checkIfUserCookie(cookie) {
        let cookieParts = cookie.split('=');
        
        if (cookieParts[0].trim() === userCookieName) {
            $rootScope.user = JSON.parse(decodeURIComponent(cookieParts[1]));

            $scope.username = $rootScope.user.firstName + " " + $rootScope.user.lastName;
            $scope.userRole = $rootScope.user.role;
            
            if ($rootScope.isGuest()) {
                // Make image not clickable!
                $(".user-image-span").css({"cursor":"default"});
            }
                
        }
    }

    $rootScope.isGuest = () => $rootScope.user.userName == 'guest';

    $rootScope.$watch('referenceReferenceToName', function(newVal, oldVal){
        if (!newVal) {
            return; 
        }
        // Now we check the probabilities of the deal
        groupId = $rootScope.user.groupId
        referredId = $rootScope.user.userName
        referredToId = $rootScope.createReferenceReferenceTo._id
        referredJob = $rootScope.user.job
        referredToJob = $rootScope.createReferenceReferenceTo.job
        client_name = $rootScope.createReferenceClientName

        $http.get('http://localhost:5000/classify?groupId=' + groupId + 
                    '&referredId=' + referredId + 
                    '&referredToId=' + referredToId + 
                    '&referredJob=' + referredJob + 
                    '&referredToJob=' + referredToJob + 
                    '&client_name=' + client_name).then(function(result) {
                        $scope.predictionResult = result.data;
                        $scope.predictionResult.prob = Math.round(parseFloat($scope.predictionResult.prob) * 100)
                    }, function(err) {
                        console.log(err);
                    })
        

    })
    function setHomepageDetails() {
        let cookies = document.cookie.split(';');
        cookies.forEach(cookie => {
            checkIfUserCookie(cookie);
        });

        apiService.getNextMeeting($rootScope.user.groupId).then(function(data) {
            if (data) {
                $scope.nextMeeting = "Your next meeting is on " + new Date(data.date).toLocaleString()
            }
            else {
                $scope.nextMeeting = "You have no upcoming meetings";
            }

            // Maps
            geocoder = new google.maps.Geocoder();
            geocoder.geocode( { 'address': data.location}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    map.setCenter(results[0].geometry.location);
                    var marker = new google.maps.Marker({
                        map: map,
                        position: results[0].geometry.location
                    });
                }
            })
        }, function(err) {
            console.log(err);
        });

        apiService.getMyGroupMembers($rootScope.user.groupId).then((members) => {
            $rootScope.members = members;
            $rootScope.membersWithoutMe = members.filter(m => m._id != $rootScope.user.userName);
        });

        apiService.getMyGroupMeetings($rootScope.user.groupId).then((meetings) => {
            $rootScope.meetings = meetings;
        })

        // Get number of references to me to show
        apiService.getOpenRefsToMeCount($rootScope.user.userName).then((data) => {
            $scope.countRefsToMe = data;
            // Refresh MDL to show counter
            componentHandler.upgradeAllRegistered();
        }, (err) => {
            console.log(err);
        });
    }

    $scope.isInHome = function() {
        return $location.path() == '' ||
               $location.path() == '/' ;
    }

    $scope.signout = () => {
        document.cookie = userCookieName +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        window.location.href = '/';
    }

    $scope.editProfile = () => {
        window.location.href = '#/MyProfile';
    }

    let disposeScopeVars = () => {
        delete $rootScope.createReferenceClientName;
        delete $rootScope.referenceReferenceToName;
        delete $rootScope.createReferenceReferenceTo;
    };

    let closeReferenceDialog = () => {
        closeDialog('createReferenceDialog', disposeScopeVars);
    };
    
    let showCreateReferenceDialog = () => {
        showDialog('createReferenceDialog', disposeScopeVars);
    };

    let showUserProfileDialog = () => {
        showDialog('user-profile');
    }

    let showDialog = (id, onClose) => {
        let dialog = $('#' + id)[0];

        if (dialog) {
            dialog.showModal();
            dialog.addEventListener('click', outsideDialog);

            if (!mdlComponentUpgraded && 
                getmdlSelect &&
                typeof(getmdlSelect.init) === 'function') {
                // Updating Material Design Lite elements (For Dialog of members that value can be shown)
                getmdlSelect.init(`.${mdlSelectClass}`);

                mdlComponentUpgraded = !mdlComponentUpgraded;

                dialog.addEventListener('keydown', (e) => {
                    if (e.keyCode === escKey) {
                        onClose && onClose();
                    }
                });
            }
        }
    };

    let closeDialog = (id, onClose) => {
        let dialog = $('#' + id)[0];

        if (dialog) {
            dialog.close();
        }

        onClose && onClose();
    };

    function outsideDialog(event) {
         if ($(event.srcElement).is('li')) {
            return;
        }

        var dialog = this;
        var rect = dialog.getBoundingClientRect();
        var isInDialog=(rect.top <= event.clientY && event.clientY <= rect.top + rect.height
            && rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
        if (!isInDialog) {
          dialog.close();
          dialog.removeEventListener('click', outsideDialog);
        }
      }


    let createReference = () => {
        apiService.createReferral($rootScope.createReferenceReferenceTo._id, $rootScope.createReferenceClientName)
            .then(() => {
                closeReferenceDialog();
            });
    };

    $rootScope.closeReferenceDialog = closeReferenceDialog;
    $rootScope.showCreateReferenceDialog = showCreateReferenceDialog;
    $rootScope.createReference = createReference;
    $scope.showUserProfileDialog = showUserProfileDialog;
    let mdlComponentUpgraded = false;
    setHomepageDetails();
});
 