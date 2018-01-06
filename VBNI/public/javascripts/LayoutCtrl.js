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

    setHomepageDetails();
});
 