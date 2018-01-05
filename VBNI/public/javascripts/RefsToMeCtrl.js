angular.module('vbni').controller('RefsToMeCtrl', ['$scope', 'apiService',
    function ($scope, apiService) {

        var userDetails = $scope.$root.user;
        // Getting My references
        apiService.getRefsToMe(userDetails.userName).then(function (data) {
            $scope.refsToMe = data;
        }, function (err) {
            console.log(err);
        });
    }]);