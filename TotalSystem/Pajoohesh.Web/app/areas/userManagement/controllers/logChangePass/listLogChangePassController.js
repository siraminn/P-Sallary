define(["areas/userManagement/app.areas.userManagement"], function (userManagement) {
    userManagement.register.controller("listLogChangePassController", ["$scope", "$timeout", "pn.remote.service", "pn.dialog", "pn.focus",
        "pn.enum", "pn.array", "Notification", "$window", "$rootScope", "userManagementWebAccess", "cache", "$state", "pn.dialog","pn.message",
    function ($scope, $timeout, remoteService, dialog, focus, pnenum, pnarray, notify, $window, $rootScope, WebAccess, cache, $state, dialog,message) {

            var init = function () {

                if (cache.umsCache != null
                        && cache.umsCache.selectedUser != null
                        && cache.umsCache.selectedUser.UserName != null) {
 
                    $scope.gridConfig = {
                        inlineOperationalUrl: {
                            read: {
                                url: WebAccess + "api/UserActiveChange/GetLogUserActiveChange",
                                data: function () {
                                    debugger;
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
                   title: "نام کاربر",
                   allownull: false
               }

               ,
                 {
                     field: 'ByUserName',
                     editable: false,
                     title: "تغییر دهنده",
                     allownull: false
                 }
                 ,
                {
                    field: 'IP',
                    editable: false,
                    title: "IP",
                    allownull: false,
                    width: 150
                }
                ,
                {
                    field: 'PersianCreateDate',
                    editable: false,
                    title: "تاریخ",
                    allownull: false,
                    width: 100
                },
                {
                    field: 'PersianCreateTime',
                    editable: false,
                    title: "ساعت",
                    allownull: false,
                    width: 100
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


