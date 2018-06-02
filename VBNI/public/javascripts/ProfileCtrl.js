'use strict';

angular.module('vbni').controller('ProfileCtrl', ['$scope', 'apiService', '$timeout',
    function ($scope, apiService, $timeout) {
        $scope.$on('$viewContentLoaded', function(event) {
            $timeout(function() {
                componentHandler.upgradeDom();
            })
        });
        $scope.user = {};
        $scope.updateProfile = function(member) {
            
            apiService.updateMember(member).then(function(res) {
                $.find('#snackbarContainer')[0].MaterialSnackbar.showSnackbar({message: 'User profile updated sucessfully'});
            }, function(err) {
                $.find('#snackbarContainer')[0].MaterialSnackbar.showSnackbar({message: 'Error during registration. please try again later'});
            })
        }
    }]);