angular.module('vbni').controller('MyRefsCtrl', ['$scope', '$http',
    function ($scope, $http) {

        // Getting My references
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
            $scope.myRefs = data;
        }, function (err) {
            console.log(err);
        });
    }]);