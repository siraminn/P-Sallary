define(["areas/userManagement/app.areas.userManagement"], function (userManagement) {
    userManagement.register.controller("createCredentialController",
        ["$scope", "pn.remote.service", "pn.focus", "Notification", "userManagementWebAccess", "cache", "$state", "pn.dialog","pn.message",
        function ($scope, remoteService, focus, notify, WebAccess, cache, $state, dialog, message) {
           
            var init = function () {

                if (cache.umsCache != null
                            && cache.umsCache.selectedUser != null
                            && cache.umsCache.selectedUser.UserName != null) {
                }
                else {
                    dialog.showMessage(message.error, message.common.noSelectedUser);
                    $state.go('home.tab.user.listUser');
                }
            }; 

            init();

        }]);
});


