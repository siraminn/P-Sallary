define(["areas/userManagement/app.areas.userManagement"], function (userManagement) {
    userManagement.register.controller("listLogUserActiveChangeController", ["$scope", "$timeout", "pn.remote.service", "pn.dialog", "pn.focus",
        "pn.enum", "pn.array", "Notification", "$window", "$rootScope", "userManagementWebAccess", "cache", "$state", "pn.dialog", "pn.message",
        function ($scope, $timeout, remoteService, dialog, focus, pnenum, pnarray, notify, $window, $rootScope, WebAccess, cache, $state, dialog, message) {

            // Initilize Form Data
            $scope.initializeForm = function () {
                debugger;

                if (cache.umsCache != null
                       && cache.umsCache.selectedUser != null
                       && cache.umsCache.selectedUser.UserName != null) {
                    $scope.gridConfig = {
                        inlineOperationalUrl: {
                            read: {
                                url: WebAccess + "api/LogUserChangeActive/GetUserActiveChange",
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

            var init = function () {
                $scope.initializeForm();
            };

            init();

            var currentName = $state.current.name;
            $rootScope.$on('$stateChangeSuccess',
                function (event, toState, toParams, fromState, fromParams) {
                    if (currentName === toState.name) {
                        init();
                    }
                }
            );

            // #region ----- Standrad From Events -----
            // #endregion ----- Standrad From Events -----

            // #region ----- Custom Events -----
            // #endregion ----- Custom Events -----

            // #region ----- Standard Events -----
            // #endregion ----- Standard Events -----

            // #region ----- Grid Config -----  

            $scope.gridColumns = [
               {
                   field: 'UserName',
                   editable: false,
                   title: "نام کاربر",
                   allownull: false
               },
                {
                    field: 'CreateDateDisplayDate',
                    editable: false,
                    title: "تاریخ",
                    allownull: false,
                    width: 100
                },
                {
                    field: 'CreateDateDisplayTime',
                    editable: false,
                    title: "ساعت",
                    allownull: false,
                    width: 100
                },
                 {
                     field: 'AdminName',
                     editable: false,
                     title: "اقدام کننده",
                     allownull: false
                 },
                {
                    field: 'IP',
                    editable: false,
                    title: "IP",
                    allownull: false,
                    width: 150
                },
                {
                    field: 'State',
                    editable: false,
                    title: 'نوع',
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


