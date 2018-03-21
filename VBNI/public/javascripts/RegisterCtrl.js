'use strict';

angular.module('vbni').controller('RegisterCtrl', ['$scope', 'apiService',
    function ($scope, apiService) {
        $scope.user = {};
        $scope.register = function() {
            $scope.user.groupId = $scope.$root.user.groupId;

            apiService.register($scope.user).then(function(res) {

            }, function(err) {

            })
        }
    }]);