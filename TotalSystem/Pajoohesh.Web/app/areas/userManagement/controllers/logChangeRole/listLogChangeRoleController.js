define(["areas/userManagement/app.areas.userManagement"], function (userManagement) {
    userManagement.register.controller("listLogChangeRoleController", ["$scope", "$timeout", "pn.remote.service", "pn.dialog", "pn.focus",
        "pn.enum", "pn.array", "Notification", "$window", "$rootScope", "userManagementWebAccess", "cache", "$state", "pn.dialog", "pn.message",
        function ($scope, $timeout, remoteService, dialog, focus, pnenum, pnarray, notify, $window, $rootScope, WebAccess, cache, $state, dialog, message) {

            var init = function () {
 
                if (cache.umsCache != null
                            && cache.umsCache.selectedUser != null
                            && cache.umsCache.selectedUser.UserName != null) {
                    $scope.gridConfig = {
                        inlineOperationalUrl: {
                            read: {
                                url: WebAccess + "api/LogChangeRole/GetLogChangeRoleQuery",
                                data: function () {
                                    return $scope.filterQuery;
                                }
                            }
                        }
                    };
                }
                else {
                    dialog.showMessage(message.error, message.common.noSelectedUser);
                    $state.go('home.tab.user.listUser');
                }
            };

            init();

            var reloadGrid = function () {
                $scope.gridApi.refresh();
            }

            // Initilize Form Datau
            $scope.initializeForm = function () {
                $scope.disableUserForm = true;
                $scope.formOperationState = pnenum.pnformstate.browse;
            }

            $scope.initializeForm();

            // #region ----- Standrad From Events -----

            // #endregion ----- Standrad From Events -----

            // #region ----- Custom Events -----

            // #endregion ----- Custom Events -----

            // #region ----- Standard Events -----

            // #endregion ----- Standard Events -----

            // #region ----- Grid Config -----  

         

            $scope.gridColumns = [
               {
                  field: 'ForUserName',
                  editable: false,
                  title: "برای کاربر",
                  allownull: false
               },
                {
                    field: 'RoleName',
                    editable: false,
                    title: "نقش",
                    allownull: false
                },
                {
                    field: 'OperationType',
                    editable: false,
                    title: "نوع عملیات",
                    allownull: false
                },
                {
                  field: 'IP',
                  editable: false,
                  title: "IP",
                  allownull: false
              },
                {
                    field: 'ByUserName',
                    editable: false,
                    title: "توسط",
                    allownull: false
                },
                {
                    field: 'PersianCreateDate',
                    editable: false,
                    title: "تاریخ",
                    allownull: false
                },
                {
                    field: 'PersianCreateTime',
                    editable: false,
                    title: 'ساعت',
                    allownull: true
                }
            ];

            $scope.gridSchema = {
                model: {
                    id: 'Key',
                    fields: {
                        Code: {
                            type: 'number',
                            editable: false
                        }
                    }
                },
                data: 'Entities',
                total: 'TotalCount'
            };

            // #endregion ----- grid Config -----  

        }]);
});


