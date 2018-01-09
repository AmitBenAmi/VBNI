angular.module('vbni').controller('RefsToMeCtrl', ['$scope', 'apiService',
    function ($scope, apiService) {
        let userDetails = $scope.$root.user;
        let mdlComponentUpgraded = false;

        apiService.getRefsToMe(userDetails.userName).then((data) => {
            $scope.refsToMe = data;
        }, (err) => {
            console.log(err);
        });

        let disposeScopeVars = () => {
            delete $scope.selectedRefId;
            delete $scope.refAmount;
        };

        let closeDialog = () => {
            let dialog = $('dialog')[0];

            disposeScopeVars();

            if (dialog) {
                dialog.close();
            }
        };

        let openAmountDialogForRef = (referenceId) => {
            let dialog = $('#setGoodAmountDialog')[0];

            $scope.selectedRefId = referenceId;
            $scope.refAmount = 0;

            if (dialog) {
                dialog.showModal();

                if (!mdlComponentUpgraded && 
                    componentHandler && 
                    typeof(componentHandler.upgradeAllRegistered) === 'function') {
                    // Updating Material Design Lite elements (For MaterialTextfield)
                    componentHandler.upgradeAllRegistered();

                    mdlComponentUpgraded = !mdlComponentUpgraded;
                }
            }
        };

        let setRefAsGood = (referenceId, amount) => {
            apiService.setReferenceAsGood(referenceId, amount).then(() => {
                angular.forEach($scope.refsToMe, (ref) => {
                    if (ref._id === referenceId) {
                        ref.isGood = true;
                        ref.amount = amount;
                    }
                });

                disposeScopeVars();
                closeDialog();
            }, (err) => {
                closeDialog();
            });
        };
        
        let setRefAsBad = (referenceId) => {
            apiService.setReferenceAsBad(referenceId).then(() => {
                angular.forEach($scope.refsToMe, (ref) => {
                    if (ref._id === referenceId) {
                        ref.isGood = false;
                        ref.amount = 0;
                    }
                });
            }, (err) => {
                closeDialog();
            });
        };

        $scope.closeDialog = closeDialog;
        $scope.openAmountDialogForRef = openAmountDialogForRef;
        $scope.setRefAsGood = setRefAsGood;
        $scope.setRefAsBad = setRefAsBad;
        $scope.refAmount = 0;
    }
]);