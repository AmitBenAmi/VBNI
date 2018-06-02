'use strict';

angular.module('vbni').directive('onFinishRender', ($timeout) => {
    return {
        restrict: 'A',
        link: (scope, element, attr) => {
            if (scope.$last === true) {
                $timeout(() => {
                    scope.$emit('ngModelFinished');
                });
            }
        }
    };
});

angular.module('vbni').controller('RegisterCtrl', ['$scope', 'apiService', '$timeout',
    function ($scope, apiService, $timeout) {
        $scope.$on('$viewContentLoaded', function(event) {
            $timeout(function() {
                componentHandler.upgradeAllRegistered();
                let registerInputs = document.querySelectorAll('.mdl-js-textfield');
                for (let i = 0; i < registerInputs.length; i++) {
                    registerInputs[i].MaterialTextfield.checkDirty();
                    registerInputs[i].MaterialTextfield.updateClasses_();
                }
            });
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

            $timeout(function(){
                let registerInputs = document.querySelectorAll('.mdl-js-textfield');
                for (let i = 0; i < registerInputs.length; i++) {
                    registerInputs[i].MaterialTextfield.checkDirty();
                    registerInputs[i].MaterialTextfield.updateClasses_();
                }
            });
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