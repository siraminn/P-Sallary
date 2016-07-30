define(["areas/userManagement/app.areas.userManagement"], function (userManagement) {
    userManagement.register.controller("listUserController", ["$scope", "$timeout", "pn.remote.service", "pn.dialog", "pn.focus",
        "pn.enum", "pn.array", "Notification", "$window", "$rootScope", "userManagementWebAccess", "cache", "$state", "pn.message",
        function ($scope, $timeout, remoteService, dialog, focus, pnenum, pnarray, notify, $window, $rootScope, WebAccess, cache, $state, pnMessage) {

            $scope.kendoGrid = null;
            $scope.onKenoReady = function (kendo, option) {
                debugger;
                $scope.kendoGrid = kendo;
                $scope.kendoGrid.dataSource.read();
            };

            $scope.doDelete = function () { return Delete(); };

            var isUserSelected = function () {
                if (cache.umsCache != null && cache.umsCache.selectedUser != null) {
                    if ((cache.umsCache.selectedUser.Key == null || cache.umsCache.selectedUser.Key == "") && cache.umsCache.selectedUser.Mode == null) {
                        dialog.showMessage('عدم انتخاب کاربر', message.common.noSelectedUser);
                        return false;
                    }
                };

                return true;
            };

            function Delete() {

                if (!isUserSelected())
                    return false;

                var resultDelete = false;
                debugger;

                dialog.showYesNo(pnMessage.note, pnMessage.deleteSure, pnMessage.yes, pnMessage.no).then(function (resultConfrim) {
                    if (resultConfrim == null) { return resultDelete; }

                    if (resultConfrim == true) {
                        DeleteData($scope.user.Key).then(function (resultReqDelete) {
                            if (resultReqDelete.Success) {
                                var notifyP = { message: pnMessage.successfullDelete, title: pnMessage.delete };
                                resultDelete = resultHandler(resultReqDelete, notifyP);
                            }
                            else {
                                errorHandler.ShowError(resultReqDelete);
                            }
                        });
                    }
                });

                return resultDelete;
            };

             //ریفریش اطلاعات گرید 
            function reloadGrid() {
                $scope.gridApi.refresh();
                $scope.showGridSelectedRowInForm($scope.selectedItems[0]);
            };

            var resultHandler = function (result, notifyP) {
                if (result.Success) {
                    notify.success(notifyP);
                    reloadGrid();
                    initializeForm();
                }
                else {
                    errorHandler.ShowError(result);
                }
            };

            function DeleteData(newData) {
                return remoteService.post(null, WebAccess + "api/User/DeleteUser?key=" + newData);
            };

            $scope.doEdit = function () {

                if (!isUserSelected())
                    return false;

                $state.go('home.tab.user.createUser');
            };

            //*************************************************************************************************************
            $scope.doCancel = function () {
                return true;
            };

            //انتخاب اولین سطر بطور پیش فرض
            $scope.grid_onDataBound = function (kendo) {
                kendo.select(kendo.tbody.find('tr:first'));
            };

            $scope.doInsert = function () {
                cache.umsCache.selectedUser = {};
                cache.umsCache.selectedUser.Key = "";
                cache.umsCache.selectedUser.Mode = pnenum.pnformstate.insert;
                $scope.formOperationState = pnenum.pnformstate.insert;
                $state.go("home.tab.user.createUser");
                return true;
            };

            // Initilize Form Data
            $scope.initializeForm = function () {
                //ActiveMenuINTabPage();
                //برگشت به حالت اولیه دکمه ها
                $scope.$emit("toolbar:DoRibbonTrue");
                cache.umsCache = cache.umsCache || {};
                cache.umsCache.selectedUser = {};
                $scope.user = {}
                $scope.disableUserForm = true;
                $scope.formOperationState = pnenum.pnformstate.browse;
                $scope.userSelectedItem = "";
            };

            $scope.initializeForm();

            $scope.showGridSelectedRowInForm = function (entity) {
                cache.umsCache.selectedUser = $scope.user = entity;
            }

            // grid Config
            $scope.selectedItems = [];

            $scope.gridConfig = {
                inlineOperationalUrl: {
                    read: {
                        url: WebAccess + "api/user/GetAllUsers",
                        data: function () {
                            return $scope.filterQuery;
                        }
                    }
                }
            };

            $scope.gridColumns = [
              {
                  field: 'FirstName',
                  editable: false,
                  title: "نام",
                  allownull: false
              },
                {
                    field: 'LastName',
                    editable: false,
                    title: "نام خانوادگی",
                    allownull: false
                },
                {
                    field: 'UserName',
                    editable: false,
                    title: "نام کاربری",
                    allownull: false
                },
                {
                    field: 'NationalId',
                    editable: false,
                    title: 'کد ملی',
                    allownull: false
                },
                {
                    field: 'BirthCertificateId',
                    editable: false,
                    title: "شماره شناسنامه",
                    allownull: false
                },
                 {
                     field: 'UserType.Title',
                     editable: false,
                     title: "نوع کاربری",
                     allownull: false
                 }
            ];

            $scope.gridSchema = {
                model: {
                    id: 'Id',
                    fields: {
                        UserName: {
                            type: 'text',
                            editable: false
                        }
                    }
                },
                data: 'Entities',
                total: 'TotalCount',
            };

            $scope.$watch('selectedItems', function (newVal, oldVal) {
                if ($scope.selectedItems.length <= 0)
                    return;
                $scope.showGridSelectedRowInForm($scope.selectedItems[0]);
            });

            $scope.getGroupRoles = function () {
                remoteService.get(null, WebAccess + "api/GroupRole/GetGroupRoleQuery").then(function (loadDataResult) {
                    $scope.roleSelectedItem = "0";
                    $scope.groupRoles = loadDataResult.Entities;
                });
            }

            $scope.getGroupRoles();

        }]);
});


