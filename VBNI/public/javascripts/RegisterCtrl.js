'use strict';

angular.module('vbni').controller('RegisterCtrl', ['$scope', 'apiService', '$timeout',
    function ($scope, apiService, $timeout) {
        $scope.$on('$viewContentLoaded', function(event) {
            $timeout(function() {
                componentHandler.upgradeDom();
            })
        });
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

        let register = (user) => {
            apiService.register(user).then(function(res) {
                showMessage('User registered sucessfully');
            }, function(err) {
                if (err.status === 409) {
                    showMessage("The Username is already in use. Please choose a different Username");
                }
                else {
                    showMessage('Error during registration. please try again later');
                }
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