angular.module('vbni').controller('RefsToMeCtrl', ['$scope', 'apiService',
    function ($scope, apiService) {

        // Getting My references
        apiService.getRefsToMe().then(function (data) {
            $scope.refsToMe = data;
        }, function (err) {
            console.log(err);
        });
    }]);