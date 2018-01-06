angular.module('vbni').service('apiService', ['$http', '$q', function ($http, $q) {
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
        getMyGroupMembers: function (groupId) {
            var deferred = $q.defer();
            $http.get('/groups/' + groupId + '/members').then(function (res) {
                deferred.resolve(res.data);
            }, function (err) {
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
        getNextMeeting: function(groupId) {
            var deferred = $q.defer();
            $http.get('meetings/getNextMeetingForGroup', {
                params: {
                    groupId: groupId
                }
            }).then(function(res) {
                deferred.resolve(res.data.date);
            }, function(err) {
                deferred.reject(err);
            });

            return deferred.promise;
        }
    }
}]);