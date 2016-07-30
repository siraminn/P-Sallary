define(['app'], function (app) {
    app.controller("logoutController", ["$scope", "$state", "localStorageService",
        function ($scope, $state, localStorageService) {
           localStorageService.clearAll();
            window.location.href = "/";

        }]);
});