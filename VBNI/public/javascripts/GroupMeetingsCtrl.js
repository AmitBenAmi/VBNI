﻿angular.module('vbni').controller('GroupMeetingsCtrl', ['$scope', 'apiService',
    function ($scope, apiService) {

        var userDetails = $scope.$root.user;

        // Fetching the data
        apiService.getMyGroupMeetings(userDetails.groupId).then(function (data) {
            $scope.meetings = data;
        }, function (err) {
            console.log(err);
        });

        // Refresh MDL to show loader
        componentHandler.upgradeAllRegistered();
    }]);