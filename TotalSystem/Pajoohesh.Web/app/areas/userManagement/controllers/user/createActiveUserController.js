define(["areas/userManagement/app.areas.userManagement"], function (userManagement) {
    userManagement.register.controller("createActiveUserController",
        ["$scope", "pn.remote.service", "pn.focus", "Notification", "userManagementWebAccess", "cache", "$state", "pn.dialog", "pn.message", "$rootScope",
        function ($scope, remoteService, focus, notify, WebAccess, cache, $state, dialog, message ,$rootScope) {

            $scope.activeIdSelected = false;
            $scope.activeUserState = {};
            $scope.activeUserState.Description = "";

            $scope.loadLatestStateData = function () {
                remoteService.get(null,
                           WebAccess + "api/User/GetUserActiveState?id=" + $scope.activeUserState.Key).then(function (result) {
                           $scope.activeUserState.Active = $scope.activeIdSelected = result;
                       });
            }; 

            $scope.loadActiveType = function () {
                $scope.activeTypes = [{ Id: true, Title: "فعال" }, { Id: false, Title: "غیر فعال" }];
            };

            $scope.doInsert = function(){ return true;};
            $scope.doCancel = function(){ return true;};

            $scope.doApplay = function () {
                remoteService.post($scope.activeUserState,
                   WebAccess + "api/User/ActiveDeactiveUser" ).then(function (result) {
                       if (result.Success) {
                           notify.success({ message: 'اطلاعات با موفقیت ثبت شد', title: ' ثبت اطلاعات' });
                           $scope.activeUserState.Description = "";
                            return true;
                           //reloadGrid();
                       } else {
                           notify.success({ message: 'خطایی در ثبت اطلاعات به وجود آمده است لطفا مجددا تلاش نمایید', title: ' ثبت اطلاعات' });
                       }
                   });

                return false;
            };

            var inti = function () {
                $scope.$emit("toolbar:DoRibbonFalse");

                if (cache.umsCache != null
                          && cache.umsCache.selectedUser != null
                          && cache.umsCache.selectedUser.Key != null) {

                    $scope.showUI = true;
                    $scope.activeUserState.Key = cache.umsCache.selectedUser.Key;
                    $scope.loadActiveType();
                    $scope.loadLatestStateData();
                }
                else {
                    dialog.showMessage(message.error, message.noSelectedUser);
                    $state.go('home.tab.user.listUser');
                }
            }

            inti();

            var currentName = $state.current.name;
            $rootScope.$on('$stateChangeSuccess',
                function (event, toState, toParams, fromState, fromParams) {
                    if (currentName === toState.name) {
                        init();
                    }
                }
            );

        }]);
});
