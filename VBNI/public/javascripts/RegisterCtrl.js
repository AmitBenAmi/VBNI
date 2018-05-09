'use strict';

angular.module('vbni').controller('RegisterCtrl', ['$scope', 'apiService',
    function ($scope, apiService) {
        let onSuccessLogin = (googleUser) => {
            let profile = googleUser.getBasicProfile();
            $scope.user = {
                userName: profile.getEmail(),
                firstName: profile.getGivenName(),
                lastName: profile.getFamilyName(),
                password: 'Google',
                groupId: $scope.$root.user.groupId
            };
        };

        let showMessage = (message) => {
            let showMessageWhenPossible = (snackbar) => {
                snackbar.showSnackbar({message: message});
            };
            
            let materialSnackbar = $('#snackbarContainer')[0].MaterialSnackbar;
            if (!materialSnackbar) {
                setTimeout(() => {
                    materialSnackbar = $('#snackbarContainer')[0].MaterialSnackbar;
                    showMessageWhenPossible(materialSnackbar);
                });
            }
            else {
                showMessageWhenPossible(materialSnackbar);
            }
        };

        let register = (user) => {
            apiService.register(user).then(function(res) {
                showMessage('User registered sucessfully');
            }, function(err) {
                showMessage('Error during registration. please try again later');
            });
        };

        gapi.signin2.render('g-signin2_register', {
            longTitle: true,
            onsuccess: onSuccessLogin
        });

        $scope.user = {};
        $scope.register = function() {
            $scope.user.groupId = $scope.$root.user.groupId;
            register($scope.user);
        }
    }]);