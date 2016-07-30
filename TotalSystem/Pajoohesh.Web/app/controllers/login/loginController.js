define(['app'], function (app) {
    app.controller("loginController", ["$scope", "$state", "userManagementWebAccess", "pn.remote.service", "$http",
        "localStorageService","AuthToken",
        function ($scope, $state, WebAccess, remoteService,$http,localStorageService,tokenKey) {

            $scope.resultMessage = "";
            $scope.login = {};

            $scope.initLogin = function () {
                localStorageService.clearAll();
                remoteService.get(null, WebAccess + "api/User/Login").then(function (result) {
                    $scope.login.CaptchaImage = result.CaptchaImage;
                    $scope.login.CaptchaKey = result.CaptchaKey;
                });
            };

            $scope.initLogin();

            $scope.loginSystem = function () {
            debugger;
                localStorageService.clearAll();

                remoteService.post($scope.login, WebAccess + "api/User/Login").then(function (result) {
                    if (result.IsValidUser)
                        {
                            $http.defaults.headers.common[tokenKey] = result.Token;
                            localStorageService.set(tokenKey, result.Token);
                            $state.go('home');
                        }
                    else
                        $scope.resultMessage = result.ResultMessage;
                });

            };

            $scope.refreshCaptcha = function () {
                remoteService.get(null, WebAccess + "api/User/Login").then(function (result) {
                    $scope.login.CaptchaImage = result;
                });
            };

        }]);
});