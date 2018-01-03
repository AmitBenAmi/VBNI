angular.module('vbni').controller('MyRefsCtrl', ['$scope', 'apiService',
    function ($scope, apiService) {

        // Getting My references
        apiService.getMyReferences().then(function (data) {
            $scope.myRefs = data;
        }, function (err) {
            console.log(err);
        });
    }]);