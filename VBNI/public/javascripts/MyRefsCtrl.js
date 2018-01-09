angular.module('vbni').controller('MyRefsCtrl', ['$scope', 'apiService',
    function ($scope, apiService) {

        var userDetails = $scope.$root.user;
        // Getting My references
        apiService.getMyReferences(userDetails.userName).then(function (data) {
            $scope.myRefs = data;
        }, function (err) {
            console.log(err);
        });

        // Refresh MDL to show loader
        componentHandler.upgradeAllRegistered();
    }]);