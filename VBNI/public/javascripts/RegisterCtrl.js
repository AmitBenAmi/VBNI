'use strict';

angular.module('vbni').controller('RegisterCtrl', ['$scope', 'apiService',
    function ($scope, apiService) {
        $scope.user = {};
        $scope.register = function() {
            $scope.user.groupId = $scope.$root.user.groupId;

            apiService.register($scope.user).then(function(res) {
                $.find('#snackbarContainer')[0].MaterialSnackbar.showSnackbar({message: 'User registered sucessfully'});
            }, function(err) {
                $.find('#snackbarContainer')[0].MaterialSnackbar.showSnackbar({message: 'Error during registration. please try again later'});
            })
        }
    }]);