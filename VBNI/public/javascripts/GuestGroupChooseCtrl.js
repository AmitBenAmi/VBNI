'use strict';

angular.module('vbni').controller('GuestGroupChooseCtrl', ['$scope', 'apiService',
    function ($scope, apiService) {
        apiService.getAllGroups().then(function(data) {
            $scope.groups = data;
        }, function(err) {
            console.log(err);
        })

}]);