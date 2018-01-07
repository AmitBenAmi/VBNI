angular.module('vbni').directive('isGood', () => {
    return {
        restrict: 'E',
        templateUrl: '../../views/directives/isGood.html',
        scope: {
            good: '=',
            colored: '=color'
        }
    };
});