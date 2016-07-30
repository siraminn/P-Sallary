define(["areas/userManagement/app.areas.userManagement"], function (userManagement) {
    userManagement.register.controller("createAddressController",
        ["$scope", "pn.remote.service", "pn.focus", "Notification", "userManagementWebAccess"
            , "cache", "pn.message", "$state", "pn.dialog", "pn.errorHandler",
        function ($scope, remoteService, focus, notify, WebAccess, cache, message, $state, dialog, errorHandler) {
            $scope.userContact = {};
            $scope.init = function () {
                if (cache.umsCache != null
                            && cache.umsCache.selectedUser != null
                            && cache.umsCache.selectedUser.UserName != null) {

                    remoteService.get(null, WebAccess + "api/User/GetUserContactById?id="
                        + cache.umsCache.selectedUser.Key).then(function (result) {
                            $scope.userContact = result;
                        });

                }
                else {
                    dialog.showMessage(message.error, message.common.noSelectedUser);
                    $state.go('home.tab.user.listUser');
                }
            };

            $scope.doApplay = function () {
                remoteService.get($scope.userContact, WebAccess + "api/User/SaveUserContact").then(function (result) {
                    if (result.Success) {
                        notify.success({ message: 'اطلاعات سیستم با موفقیت ثبت شد', title: ' ثبت اطلاعات' });
                    }
                    else {
                        errorHandler.error(result.ValidationErrors);
                    }
                });
            };

            $scope.init();
        }]);
});
