const userCookieName = 'user';

class MainController {
    constructor($scope, $http) {
        this.$scope = $scope;
        this.$http = $http;

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

        if (cookieParts[0] === userCookieName) {
            this.$scope.username = decodeURIComponent(cookieParts[1]);
        }
    }
}

angular.module('vbni').controller('MainCtrl', ['$scope', '$http', MainController]);