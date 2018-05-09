'use strict';

angular.module('vbni').controller('ProfileCtrl', ['$scope', 'apiService',
    function ($scope, apiService) {
        $scope.user = {};
        $scope.updateProfile = function(member) {
            
            apiService.updateMember(member).then(function(res) {
                $.find('#snackbarContainer')[0].MaterialSnackbar.showSnackbar({message: 'User registered sucessfully'});
            }, function(err) {
                $.find('#snackbarContainer')[0].MaterialSnackbar.showSnackbar({message: 'Error during registration. please try again later'});
            })
        }
    }]);