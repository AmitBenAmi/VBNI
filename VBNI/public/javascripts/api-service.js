angular.module('vbni').service('apiService', ['$http', '$q', function ($http, $q) {
    return {
        getMyReferences: function () {
            var deferred = $q.defer();
            $http.get('/referrals').then(function (res) {
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
            $http.get('/groups/5a3ea99b734d1d12b6753ea7/members').then(function (res) {
                deferred.resolve(res.data);
            }, function (err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        }
    }
}]);