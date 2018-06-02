angular.module('vbni').controller('HomeCtrl', ['$scope', '$timeout','$rootScope',
    function($scope, $timeout,$rootScope) {
        // Dialog polyfill
        dialog = document.querySelector('#waiting-dialog');
        dialogPolyfill.registerDialog(dialog);
        $scope.isLoaded = false;

        let showWaintingIfDataNotLoaded = () => {
            if (isDataLoaded()) {
                return;
            }

            dialog.showModal();
            closeWaitingIfDataLoaded();
        };

        let closeWaitingIfDataLoaded = () => {
            if (!isDataLoaded()) {
                $timeout(closeWaitingIfDataLoaded, 500);
            }

            // Close waiting
            $scope.isLoaded = true;
            dialog.close();
        }

        let isDataLoaded = () => $rootScope.username && $rootScope.nextMeeting;

        // Run on start
        showWaintingIfDataNotLoaded();
}]);