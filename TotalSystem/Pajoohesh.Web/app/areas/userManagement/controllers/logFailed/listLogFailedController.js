define(["areas/userManagement/app.areas.userManagement"], function (userManagement) {
    userManagement.register.controller("listLogFailedController", ["$scope", "$timeout", "pn.remote.service", "pn.dialog", "pn.focus",
        "pn.enum", "pn.array", "Notification", "$window", "$rootScope", "userManagementWebAccess", "cache", "$state", "pn.dialog","pn.message",
        function ($scope, $timeout, remoteService, dialog, focus, pnenum, pnarray, notify, $window, $rootScope, WebAccess, cache, $state,dialog,message) {
 
            var init = function () {

                if (cache.umsCache != null
                            && cache.umsCache.selectedUser != null
                            && cache.umsCache.selectedUser.UserName != null) {

                    $scope.gridConfig = {
                        inlineOperationalUrl: {
                            read: {
                                url: WebAccess + "api/LogFailed/GetLogFailedQuery",
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

            $scope.selectedItems = [];
            $scope.disableForm = false;

            var enableGrid = function () {
                $("#disableGridDiv").remove();
            }

            var disableGrid = function (gridId) {
                if (gridId) {
                    //TODO Add To Special Grid Id.
                } 
            }

            var reloadGrid = function () {
                $scope.gridApi.refresh();
            }


            // Initilize Form Datau
            $scope.initializeForm = function () {
                $scope.disableUserForm = true;
                $scope.formOperationState = pnenum.pnformstate.browse;
                $scope.roleSelectedItem = "";
                enableGrid();
            }

            $scope.initializeForm();

            // #region ----- Standrad From Events -----

            $scope.doDelete = function () {
                notify.success({ title: 'انجام عملیات', message: 'انجام شد' });
            }

            // #endregion ----- Standrad From Events -----

            // #region ----- Custom Events -----

            $scope.$watch('selectedItems', function (newVal, oldVal) {
                if ($scope.selectedItems.length <= 0)
                    return;
                $scope.showGridSelectedRowInForm($scope.selectedItems[0]);
            });

            $scope.prepareFormForCreateRole = function () {
                $scope.roleSelectedItem = "";
                $scope.disableUserForm = false;
                $scope.initializeCodes();
                $scope.disableTotalCode = true;
            }

            $scope.prepareFormForEdit = function () {
                disableGrid();
                $scope.disableUserForm = false;
                $scope.roleSelectedItem = null;
            }

            $scope.showGridSelectedRowInForm = function (entity) {
                $scope.role.Key = entity.Key;
                $scope.role.Title = entity.Title;
                $scope.role.Code = entity.Code;
                $scope.role.GroupRoleId = entity.GroupRoleId;
                $scope.role.Description = entity.Description;
            }

            // #endregion ----- Custom Events -----

            // #region ----- Standard Events -----


            // #endregion ----- Standard Events -----

            // #region ----- Grid Config -----  

           

            $scope.gridColumns = [
               {
                  field: 'UserName',
                  editable: false,
                  title: "نام کاربری",
                  allownull: false,
                  width: 200
              },
              {
                  field: 'IP',
                  editable: false,
                  title: "IP",
                  allownull: false,
                  width: 200
              },
             
                {
                    field: 'PersianCreateDateTime',
                    editable: false,
                    title: "تاریخ",
                    allownull: false,
                    width: 200
                },
                {
                    field: 'CreateTime',
                    editable: false,
                    title: 'زمان',
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


