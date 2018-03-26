'use strict';

var vbniGroupChoose = angular.module('groupChoose', []);

vbniGroupChoose.controller('groupChooseCtrl', ["$scope", "$http", function($scope, $http) {
    $http.get('/groups').then(function(res) {
            $scope.groups = res.data;
        }, function(err) {
            console.log(err);
        })
    $scope.groupChosen = function(groupId) {
        var cookie = readCookie("user");
        var user = JSON.parse(decodeURIComponent(cookie));
        user.groupId = groupId;

        document.cookie = "user=" + encodeURIComponent(JSON.stringify(user)) + "; path=/"
        window.location.href = "/"
    } 

    function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') {
                c = c.substring(1,c.length);
            }
            if (c.indexOf(nameEQ) == 0) {
                return c.substring(nameEQ.length,c.length);
            }
        }
        return null;
    }
}])