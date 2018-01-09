angular.module('vbni').controller('GroupCtrl', ['$scope', 'apiService',
function ($scope, apiService) {

    var userDetails = $scope.$root.user;

    //Getting the data
    apiService.getMyGroupMembers(userDetails.groupId).then(function (data) {
        $scope.members = data;
    }, function (err) {
        console.log(err);

        if (err.status === 400) {
            $scope.noGroup = true;
        }
    });

    // Refresh MDL to show loader   
    componentHandler.upgradeAllRegistered();
}]);