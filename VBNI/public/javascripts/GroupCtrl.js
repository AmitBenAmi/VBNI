angular.module('vbni').controller('GroupCtrl', ['$scope', 'apiService',
function ($scope, apiService) {

    //Getting the data
    apiService.getMyGroupMembers().then(function (data) {
        $scope.members = data;
    }, function (err) {
        console.log(err);
    })
    //$scope.members = [
    //    {
    //        firstName : "Amit",
    //        lastName : "Gabby",
    //        "job" : "Plumber",
    //        "details" : "Amit is a 24 years old male, which always dreamt of been a plumber",
    //        phone : "087-6545123"
    //    },
    //    {
    //        firstName : "Gal",
    //        lastName : "Ben ami",
    //        "job" : "Rocket scientiest",
    //        "details" : "Gal is a 24 years old feamle, which like to spend time in her natural habitat, the rocket labratory",
    //        phone : "036-56458"
    //    },
    //    {
    //        firstName : "Matan",
    //        lastName : "Rulz",
    //        "job" : "IDF :(",
    //        "details" : "Matan is awesome",
    //        phone : "039-546231"
    //    }
}]);