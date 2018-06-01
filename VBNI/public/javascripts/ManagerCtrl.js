angular.module('vbni').controller('ManageCtrl', ['$scope', '$rootScope', '$timeout', 'apiService',
    function ($scope, $rootScope, $timeout, apiService) {

        $scope.$on('$viewContentLoaded', function(event) {
            $timeout(function() {
                componentHandler.upgradeDom();
            })
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
            apiService.addMeeting($scope.meetingPresentor, $scope.meetingDate, $scope.meetingLocation, $rootScope.user.groupId).then((result) => {
                $scope.closeAddMeetingDialog();
                apiService.getMyGroupMeetings($rootScope.user.groupId).then((meetings) => {
                    $rootScope.meetings = meetings;
                })
            },
            function(err) {
                console.log(err);
                $scope.closeAddMeetingDialog();
            })
        }

        $scope.closeAddMemberDialog = () => {
            disposeScopeVars();
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
            let membersRows = $('#manage__group-members tbody tr.is-selected');
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
        }

        $scope.setMemberToRegister = (register) => {
            $scope.memberToRegister = register;
        }

        let mdlComponentUpgraded = false;
        $scope.memberToRegister = undefined;
    }]);