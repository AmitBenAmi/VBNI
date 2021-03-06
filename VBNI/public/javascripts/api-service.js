﻿angular.module('vbni').service('apiService', ['$http', '$q', function ($http, $q) {
    return {
        getMyReferences: function (username) {
            var deferred = $q.defer();
            $http.get('referrals/' + username).then(function (res) {
                data = res.data.map(function (obj) {
                    return {
                        referrer: obj.referrer,
                        referenceTo: obj.referenceTo,
                        clientName: obj.clientName,
                        isGood: obj.isGood,
                        amount: obj.amount
                    }
                });

                deferred.resolve(data)
            }, function (err) {
                deferred.reject(err);
            });

            return deferred.promise;
        },
        getAllReferralsForGroup: function(groupId) {
            var deferred = $q.defer();
            $http.get('/referrals/getAllRefsByGroup/' + groupId).then(function(res) {
                deferred.resolve(res.data);
            }, function(err) {
                deferred.reject(err);
            })

            return deferred.promise;
        },
        getMyGroupMembers: function (groupId) {
            var deferred = $q.defer();
            $http.get('/groups/' + groupId + '/members').then(function (res) {
                deferred.resolve(res.data);
            }, function (err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        getAllGroups: function() {
            var deferred = $q.defer();
            $http.get('/groups').then(function(res) {
                deferred.resolve(res.data)
            }, function(err) {
                deferred.reject(err);
            });

            return deferred.promise;
        },
        getMyGroupMeetings: function (groupId) {
            var deferred = $q.defer();
            $http.get('/meetings', {
                params: {
                    groupId: groupId
                }
            }).then(function (res) {
                res.data.forEach(function (obj) {
                    obj.date = new Date(obj.date);
                })

                deferred.resolve(res.data);
            }, function (err) {
                deferred.reject(err);
            })

            return deferred.promise;
        },
        getRefsToMe: function (username) {
            var deferred = $q.defer();
            $http.get('references/' + username).then(function (res) {
                deferred.resolve(res.data);
            }, function (err) {
                deferred.reject(err);
            })

            return deferred.promise;
        },
        getOpenRefsToMeCount: function (username) {
            var deferred = $q.defer();
            $http.get('references/count/' + username).then(function (res) {
                deferred.resolve(res.data);
            }, function (err) {
                deferred.reject(err);
            })

            return deferred.promise;
        },
        getNextMeeting: function(groupId) {
            var deferred = $q.defer();
            $http.get('meetings/getNextMeetingForGroup', {
                params: {
                    groupId: groupId
                }
            }).then(function(res) {
                deferred.resolve(res.data);
            }, function(err) {
                deferred.reject(err);
            });

            return deferred.promise;
        },
        getMembers: () => {
            var deferred = $q.defer();
            $http.get('members').then((res) => {
                deferred.resolve(res.data);
            }, (err) => {
                console.error(err);
                deferred.reject(err);
            });

            return deferred.promise;
        },
        createReferral: (referencedMember, clientName) => {
            var deferred = $q.defer();
            $http.post('references', {
                referenceTo: referencedMember,
                clientName: clientName
            }).then((res) => {
                deferred.resolve(res.data);
            }, (err) => {
                console.error(err);
                deferred.reject(err);
            });

            return deferred.promise;
        },
        setReferenceAsGood: (referenceId, amount) => {
            let deferred = $q.defer();

            $http.put(`references/${referenceId}`, {
                isGood: true,
                amount: amount
            }).then((res) => {
                deferred.resolve(res);
            }, (err) => {
                console.error(err);
                deferred.reject(err);
            });

            return deferred.promise;
        },
        setReferenceAsBad: (referenceId) => {
            let deferred = $q.defer();

            $http.put(`references/${referenceId}`, {
                isGood: false
            }).then((res) => {
                deferred.resolve(res);
            }, (err) => {
                console.error(err);
                deferred.reject(err);
            });

            return deferred.promise;
        },
        addMemberToGroup: (member, groupId) => {
            return $http.post(`group/${groupId}/members/${member._id}`, member);
        },
        addMeeting: (meetingPresentor, meetingDate, meetingLocation, meetingSummary, groupId) => {
            var payload = {
                presentor: meetingPresentor,
                date: meetingDate,
                location: meetingLocation,
                summary : meetingSummary
            }

            return $http.post(`meetings/${groupId}`, payload);
        },
        deleteMembersFromGroup: (groupId, memberIds) => {
            let deferred = $q.defer();

            $http.delete(`group/${groupId}/members`, {
                data: {
                    memberIds: memberIds
                }
            }).then((res) => {
                deferred.resolve(res);
            }, (err) => {
                console.error(err);
                deferred.reject(err);
            });

            return deferred.promise;
        },
        register: (user) => {
            return $http.post('/register', user);
        },
        getRegistrations: (groupId) => {
            return $http.get(`/register/${groupId}`);
        },
        updateMember: (member) => {
            var deferred = $q.defer();
            $http.post('members', member).then((res) => {
                deferred.resolve(res.data);
            }, (err) => {
                console.error(err);
                deferred.reject(err);
            });

            return deferred.promise;
        }
    }
}]);