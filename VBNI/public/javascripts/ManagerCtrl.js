angular.module('vbni').directive('onFinishRender', ($timeout) => {
    return {
        restrict: 'A',
        link: (scope, element, attr) => {
            if (scope.$last === true) {
                $timeout(() => {
                    scope.$emit('ngRepeatFinished');
                });
            }
        }
    };
});

angular.module('vbni').controller('ManageCtrl', ['$scope', '$rootScope', '$timeout', 'apiService',
    function ($scope, $rootScope, $timeout, apiService) {
        $scope.$on('ngRepeatFinished', function(event) {
            $timeout(() => {
                componentHandler.upgradeAllRegistered();
            }, 0);
            let table = $('#manage__group-members');
            let headerCheckBox = table.find('thead .mdl-data-table__select');
            let boxes = table.find('tbody .mdl-data-table__select');

            let headerCheckHandler = (event) => {
                if (event.target.checked) {
                    for (let i = 0; i < boxes.length; i++) {
                        boxes[i].MaterialCheckbox.check();
                        boxes[i].MaterialCheckbox.updateClasses_();
                    }
                }
                else {
                    for (let i = 0; i < boxes.length; i++) {
                        boxes[i].MaterialCheckbox.uncheck();
                        boxes[i].MaterialCheckbox.updateClasses_();
                    }
                }
            }

            headerCheckBox.change(headerCheckHandler);
        });

        $scope.addMemberClick = () => {
            apiService.getRegistrations($rootScope.user.groupId).then((registers) => {
                $scope.membersAwaitingRegister = registers.data;
                $timeout(() => {
                    openDialog('add_member_dialog');
                }, 0);
            }, (err) => {
                console.error(err);
            });
        }

        $scope.addMeeting = () => {
            apiService.addMeeting($scope.meetingPresentor, $scope.meetingDate, $scope.meetingLocation, $scope.meetingSummary, $rootScope.user.groupId).then((result) => {
                $scope.closeAddMeetingDialog();
                showMessage('Meeting was added sucessfully');
                apiService.getMyGroupMeetings($rootScope.user.groupId).then((meetings) => {
                    $rootScope.meetings = meetings;
                })
            },
            function(err) {
                console.log(err);
                $scope.closeAddMeetingDialog();
            })
        }

        let toggleView = () => {
            let textFields = $(`.${mdlTextFieldClass}, .${mdlMenuContainerClass}`);
            textFields.removeClass(`${isDirtyClass} ${isUpgradedClass} ${isFocusedClass} ${isVisibleClass}`);
            textFields.addClass(`${isInvalidClass}`);
            textFields.blur();
        }

        $scope.closeAddMemberDialog = () => {
            closeDialog('add_member_dialog');
        }

        $scope.addMeetingClick = () => {
            openDialog('add_meeting_dialog');
        }

        $scope.closeAddMeetingDialog = () => {
            closeDialog('add_meeting_dialog');
        }

        function openDialog(id) {
            var dialog = $('#' + id)[0];
            
            if (getmdlSelect &&
                typeof(getmdlSelect.init) === 'function') {
                    let ngRepeatFinished = $scope.$on('ngRepeatFinished', (event) => {
                        componentHandler.upgradeAllRegistered();
                        toggleView();
                        ngRepeatFinished();

                        var mdlInputs = document.querySelectorAll('.mdl-js-textfield');
                        for (var i = 0, l = mdlInputs.length; i < l; i++) {
                            mdlInputs[i].MaterialTextfield.checkDirty();
                            mdlInputs[i].MaterialTextfield.checkFocus();
                        }  
                    });

                    // Updating Material Design Lite elements (For Dialog of members that value can be shown)
                    getmdlSelect.init(`.${mdlSelectClass}`);

                    if (!mdlComponentUpgraded) {
                        mdlComponentUpgraded = !mdlComponentUpgraded;
                        
                        dialog.addEventListener('keydown', (e) => {
                            if (e.keyCode === escKey) {
                                disposeScopeVars();
                            }
                        });
                    }
                }
            
            dialog.showModal();
        }

        let disposeScopeVars = () => {
            delete $scope.membersAwaitingRegister;
            delete $scope.memberToRegister;
            delete $scope.memberToRegisterText;
            delete $scope.meetingPresentor;
            delete $scope.meetingDate;
            delete $scope.meetingLocation;
            delete $scope.meetingSummary;
        };

        $scope.addMemberToGroup = (member) => {
            apiService.addMemberToGroup(member, $rootScope.user.groupId).then((res) => {
                showMessage('Member was added');
                closeDialog('add_member_dialog');
                apiService.getMyGroupMembers($rootScope.user.groupId).then((members) => {
                    $rootScope.members = members;
                });
            }, () => {
                showMessage('Error during new member addition. please try again later');
            });
        }

        $scope.deleteMembers = () => {
            let membersRows = $('#manage__group-members tbody .is-checked').parent().parent();
            let memberIds = [];

            for (let index = 0; index < membersRows.length; index++) {
                let memberRow = membersRows[index];
                let data = $(memberRow).find('td.manage__username')[0];

                if (data) {
                    memberIds.push(data.textContent);
                }
            }

            apiService.deleteMembersFromGroup($rootScope.user.groupId, memberIds).then(() => {
                membersRows.remove();
            }, (err) => {
                console.log(err);
            });
        }
        function closeDialog(id) {
            var dialog = $('#' + id)[0];
            dialog.close();
            disposeScopeVars();
        }

        $scope.setMemberToRegister = (register) => {
            $scope.memberToRegister = register;
        }

        let mdlComponentUpgraded = false;
        $scope.memberToRegister = undefined;
    }]);