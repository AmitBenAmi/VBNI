const userCookieName = 'user';

class MainController {
    constructor($scope, $http, $root) {
        this.$scope = $scope;
        this.$http = $http;
        this.$root = $root

        this._setUserName();
    }

    _setUserName() {
        let cookies = document.cookie.split(';');

        cookies.forEach(cookie => {
            this._checkIfUserCookie(cookie);
        });
    }

    _checkIfUserCookie(cookie) {
        let cookieParts = cookie.split('=');

        if (cookieParts[0].trim() === userCookieName) {
            this.$root.user = JSON.parse(decodeURIComponent(atob(cookieParts[1])));

            this.$scope.username = this.$root.user.firstName + " " + this.$root.user.lastName;
        }
    }
}

angular.module('vbni').controller('MainCtrl', ['$scope', '$http', '$rootScope', MainController]);