define(["areas/userManagement/app.areas.userManagement"], function (userManagement) {
    userManagement.register.controller("listGroupRoleController", ["$scope", "$timeout", "pn.remote.service", "pn.dialog", "pn.focus",
        "pn.enum", "pn.array", "Notification", "$window", "$rootScope", "userManagementWebAccess", "cache", "$state",
        function ($scope, $timeout, remoteService, dialog, focus, pnenum, pnarray, notify, $window, $rootScope, WebAccess, cache, $state) {

            var enableGrid = function () {
                if ($scope.gridApi)
                    $scope.gridApi.setActive(true);
            }

            var disableGrid = function (gridId) {
                $scope.gridApi.setActive(false);
            }

            var reloadGrid = function () {
                $scope.gridApi.refresh();
            }

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

            // Initilize Form Datau
            $scope.initializeForm = function () {
                $scope.item = null;
                $scope.item = {}
                $scope.disableEntryForm = true;
                $scope.formOperationState = pnenum.pnformstate.browse;
                $scope.selectedItem = "";
                enableGrid();
            }

            $scope.initializeForm();

            // #region ----- Standrad From Events -----
            $scope.doDelete = function () {
                notify.success({ title: 'انجام عملیات', message: 'انجام شد' });
            }

            $scope.doEdit = function () {
                if ($scope.item.Key == null) {
                    dialog.showMessage("خطا", "رکوردی برای ویرایش انتخاب نشده است");
                    return;
                }

                $scope.formOperationState = pnenum.pnformstate.update;
                $scope.prepareEditForm();
                focus.setFocus('itme.Code');
            }

            $scope.doCancel = function () {
                $scope.initializeForm();
            }

            $scope.doApplay = function () {
                if ($scope.formOperationState === pnenum.pnformstate.insert || $scope.formOperationState === pnenum.pnformstate.update || $scope.formOperationState === pnenum.pnformstate.deletee) {
                    $scope.applyForm();
                } else {
                    dialog.showMessage("توجه", "عملیاتی برای ثبت یافت نشد");
                }
            }

            $scope.doInsert = function () {
                $scope.formOperationState = pnenum.pnformstate.insert;
                $scope.item = {};
                disableGrid();
                $scope.prepareCreateForm();
                focus.setFocus('item.Code');
            }

            // #endregion ----- Standrad From Events -----

            $scope.prepareCreateForm = function () {
                $scope.selectedItem = "";
                $scope.disableEntryForm = false;
            }

            $scope.prepareEditForm = function () {
                disableGrid();
                $scope.disableEntryForm = false;
                $scope.selectedItem = null;
            }

            $scope.showGridSelectedRowInForm = function (entity) {
                $scope.item.Key = entity.Key;
                $scope.item.Title = entity.Title;
                $scope.item.Code = entity.Code;
            }

            $scope.loadItems = function () {

            }

            // #region ----- Standard Events -----
            $scope.applyForm = function () {

                if ($scope.formOperationState === pnenum.pnformstate.insert) {
                    $scope.insert();
                }

                if ($scope.formOperationState === pnenum.pnformstate.update) {
                    $scope.update();
                }
            }
            
            //$scope.loadTest() = $scope.insert = function () {
            //    debugger;
            //    remoteService.post($scope.item, WebAccess + "Role/GetPermisionTreeStructure")
            //    .then(function (result) {
            //    })
            //};

            //$scope.loadTest();

            $scope.insert = function () {
                remoteService.post($scope.item, WebAccess + "api/GroupRole/CreateGroupRole").then(function (result) {
                    console.log(result);
                    if (result.Success) {
                        notify.success({ message: 'اطلاعات با موفقیت ثبت شد', title: ' ثبت اطلاعات' });
                        $scope.initializeForm();
                        $scope.loadItems();
                        enableGrid();
                        reloadGrid();
                    } else {

                        //Aditional Error With Validation Erros.
                        if (result.ErrorMessage != null) {
                            notify.error({ message: result.ErrorMessage, title: ' خطا' });
                        };

                        var validationErrors = "<ul>";
                        for (var i = 0; i < result.ValidationErrors.length; i++) {
                            if (result.ValidationErrors[i] != null && result.ValidationErrors[i].ErrorMessage != null) {
                                validationErrors += "<li>";
                                validationErrors += result.ValidationErrors[i].ErrorMessage;
                                validationErrors += "</li>";
                            }
                        }
                        validationErrors += "</ul>";
                        notify.error({ message: validationErrors, title: 'خطا' });
                    }

                    $scope.item = null;
                    $scope.item = {};
                });

            }

            $scope.update = function () {
                remoteService.post($scope.item, WebAccess + "api/GroupRole/UpdateGroupRole").then(function (result) {
                    if (result.Success) {
                        notify.success({ message: 'اطلاعات با موفقیت ثبت شد', title: ' ثبت اطلاعات' });
                        $scope.initializeForm();
                        enableGrid();
                        reloadGrid();
                    } else {
                        //Aditional Error With Validation Erros.
                        if (result.ErrorMessage != null) {
                            notify.error({ message: result.ErrorMessage, title: ' خطا' });
                        };

                        var validationErrors = "<ul>";
                        for (var i = 0; i < result.ValidationErrors.length; i++) {
                            if (result.ValidationErrors[i] != null && result.ValidationErrors[i].ErrorMessage != null) {
                                validationErrors += "<li>";
                                validationErrors += result.ValidationErrors[i].ErrorMessage;
                                validationErrors += "</li>";
                            }
                        }
                        validationErrors += "</ul>";
                        notify.error({ message: validationErrors, title: 'خطا' });
                    }

                    $scope.item = null;
                    $scope.item = {};

                });
            }

            // #endregion ----- Standard Events -----

            $scope.loadItems();

            // #region ----- Grid Config -----  

            $scope.gridConfig = {
                inlineOperationalUrl: {
                    read: {
                        url: WebAccess + "api/GroupRole/GetGroupRoleQuery",
                        data: function () {
                            return $scope.filterQuery;
                        }
                    }
                }
            };

            $scope.gridColumns = [
              {
                  field: 'Title',
                  editable: false,
                  title: "عنوان",
                  allownull: false,
                  width: 200
              },
                {
                    field: 'Code',
                    editable: false,
                    title: "کد",
                    allownull: false,
                    width: 200
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

            $scope.$watch('selecteditems', function (newVal, oldVal) {
                if ($scope.selecteditems == null || $scope.selecteditems.length <= 0)
                    return;
                $scope.showGridSelectedRowInForm($scope.selecteditems[0]);
            });

        }]);
});


