const userCookieName = 'user';

angular.module('vbni').controller('LayoutCtrl', 
function($scope, $http, $rootScope, $location) {

    function checkIfUserCookie(cookie) {
        let cookieParts = cookie.split('=');
        
        if (cookieParts[0].trim() === userCookieName) {
            $rootScope.user = JSON.parse(decodeURIComponent(cookieParts[1]));

            $scope.username = $rootScope.user.firstName + " " + $rootScope.user.lastName;
        }
    }

    function setUserName() {
        let cookies = document.cookie.split(';');
        cookies.forEach(cookie => {
            checkIfUserCookie(cookie);
        });
    }

    $scope.isInHome = function() {
        return $location.path() == '' ||
               $location.path() == '/' ;
    }

    setUserName();
});
 