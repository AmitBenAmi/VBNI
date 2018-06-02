angular.module('vbni').controller('GroupMeetingsCtrl', ['$scope', 'apiService',
    function ($scope, apiService) {

        var userDetails = $scope.$root.user;

        // Fetching the data
        apiService.getMyGroupMeetings(userDetails.groupId).then(function (data) {
            $scope.meetings = data;
            $scope.meetings = $scope.meetings.sort((a,b) => new Date(b.date) - new Date(a.date));
        }, function (err) {
            console.log(err);
        });

        // Refresh MDL to show loader
        componentHandler.upgradeAllRegistered();
    }]);