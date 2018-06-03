angular.module('vbni').controller('RefsToMeCtrl', ['$scope', 'apiService', '$rootScope',
    function ($scope, apiService, $rootScope) {
        let userDetails = $scope.$root.user;
        let mdlComponentUpgraded = false;
        
        var goodAmountDialog = document.querySelector('#setGoodAmountDialog');
        dialogPolyfill.registerDialog(goodAmountDialog);

        apiService.getRefsToMe(userDetails.userName).then((data) => {
            $scope.refsToMe = data;
            updateRefsCount();
        }, (err) => {
            console.log(err);
        });

        let disposeScopeVars = () => {
            delete $scope.selectedRefId;
            delete $scope.refAmount;
        };

        let closeDialog = () => {
            disposeScopeVars();

            if (goodAmountDialog) {
                goodAmountDialog.close();
            }
        };

        let openAmountDialogForRef = (referenceId) => {
            // Reset the inputs
            $(goodAmountDialog).find(".mdl-textfield__input").val('');
            let textFields = $(goodAmountDialog).find(`.${mdlTextFieldClass}, .${mdlMenuContainerClass}`);
            textFields.addClass(`${isInvalidClass}`);

            $scope.selectedRefId = referenceId;
            $scope.refAmount = undefined;

            if (goodAmountDialog) {
                goodAmountDialog.showModal();

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
                updateRefsCount();
                disposeScopeVars();
                closeDialog();
            }, (err) => {
                closeDialog();
            });

            };
        
        let updateRefsCount = () => {
                     // Get number of references to me to show
            apiService.getOpenRefsToMeCount($scope.$root.user.userName).then((data) => {
                $rootScope.countRefsToMe = data;
                // Refresh MDL to show counter
                componentHandler.upgradeAllRegistered();
                console.log("refs",  $rootScope.countRefsToMe );
            }, (err) => {
                console.log(err);
            });
            }

        let setRefAsBad = (referenceId) => {
            apiService.setReferenceAsBad(referenceId).then(() => {
                angular.forEach($scope.refsToMe, (ref) => {
                    if (ref._id === referenceId) {
                        ref.isGood = false;
                        ref.amount = 0;
                    }
                });
                updateRefsCount();
            }, (err) => {
                closeDialog();
            });
        };

        $scope.closeDialog = closeDialog;
        $scope.openAmountDialogForRef = openAmountDialogForRef;
        $scope.setRefAsGood = setRefAsGood;
        $scope.setRefAsBad = setRefAsBad;

        // Refresh MDL to show loader
        componentHandler.upgradeAllRegistered();
    }
]);