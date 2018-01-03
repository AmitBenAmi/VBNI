angular.module('vbni').controller('GroupMeetingsCtrl', ['$scope', 'apiService',
    function ($scope, apiService) {
        // Fetching the data
        apiService.getMyGroupMeetings().then(function (data) {
            $scope.meetings = data;
        }, function (err) {
            console.log(err);
        });
    }]);