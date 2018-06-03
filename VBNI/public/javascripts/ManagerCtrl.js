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
        var addMemberDialog = document.querySelector('#add_member_dialog');
        var addMeetingDialog = document.querySelector('#add_meeting_dialog');
        dialogPolyfill.registerDialog(addMemberDialog);
        dialogPolyfill.registerDialog(addMeetingDialog);


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
                    openDialog(addMemberDialog);
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

        let toggleView = (dialog) => {
            // Remove the value of all inputs
            $(dialog).find(".mdl-textfield__input").val('');
            // Change the containers of the input
            let textFields = $(dialog).find(`.${mdlTextFieldClass}, .${mdlMenuContainerClass}`);
            textFields.removeClass(`${isDirtyClass} ${isUpgradedClass} ${isFocusedClass} ${isVisibleClass}`);
            textFields.addClass(`${isInvalidClass}`);
            textFields.blur();

            // Close the mdl-select
            closeMdlSelect();
        }

        $scope.closeAddMemberDialog = () => {
            closeDialog(addMemberDialog);
        }

        $scope.addMeetingClick = () => {
            openDialog(addMeetingDialog);
        }

        $scope.closeAddMeetingDialog = () => {
            closeDialog(addMeetingDialog);
        }

        function openDialog(dialog) {
            if (getmdlSelect &&
                typeof(getmdlSelect.init) === 'function') {
                    let ngRepeatFinished = $scope.$on('ngRepeatFinished', (event) => {
                        componentHandler.upgradeAllRegistered();
                        ngRepeatFinished();

                        var mdlInputs = document.querySelectorAll('.mdl-js-textfield');
                        for (var i = 0, l = mdlInputs.length; i < l; i++) {
                            mdlInputs[i].MaterialTextfield.checkDirty();
                            mdlInputs[i].MaterialTextfield.checkFocus();
                        }  

                        closeMdlSelect();
                    });

                    // Updating Material Design Lite elements (For Dialog of members that value can be shown)
                    getmdlSelect.init(`.${mdlSelectClass}`);
                    toggleView(dialog);

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
                closeDialog(addMemberDialog);
                apiService.getMyGroupMembers($rootScope.user.groupId).then((members) => {
                    // for (var i =0; i < members.length; i++) {
                    //     var member = members[i];
                    //     if (!$scope.isContainMember(member)) {
                    //         $rootScope.members.push(member);        
                    //     }
                    // }
                    $timeout(() => $scope.$apply(() => {
                        $rootScope.members = members;
                    }));
                });
            }, () => {
                showMessage('Error during new member addition. please try again later');
            });
        }

        $scope.isContainMember = (member) => {
            return $rootScope.members.filter(m => m._id == member._id).length > 0;
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
                showMessage('Member deleted succesfuly');
            }, (err) => {
                console.log(err);
                showMessage('error during deleting message. please try again');
            });
        }

        function closeDialog(dialog) {
            dialog.close();
            disposeScopeVars();
        }

        $scope.setMemberToRegister = (register) => {
            $scope.memberToRegister = register;
        }

        let mdlComponentUpgraded = false;
        $scope.memberToRegister = undefined;

        let closeMdlSelect = () => {
            // Close the mdl-select
            $timeout(() => {
                var containers = $('dialog').find('.mdl-menu__container');
                if (containers.hasClass(`${isVisibleClass}`)) {
                    $('dialog').find('.mdl-menu__container').removeClass(`${isDirtyClass} ${isFocusedClass} ${isUpgradedClass} ${isVisibleClass}`);
                    $('dialog').find('.mdl-textfield').removeClass(`${isFocusedClass} ${isUpgradedClass}`)    
                }
            });
        }
    }]);