define(["areas/inf/app.areas.inf"], function (inf) {
    inf.register.controller("createTableGroupController", ["$scope", "pn.remote.service", "pn.dialog", "pn.focus", "pn.enum", "Notification", "infWebAccess", "pn.errorHandler",
        function ($scope, remoteService, dialog, focus, pnenum, notify, WebAccess, errorHandler) {

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

            // Initilize Form Data
            $scope.initializeForm = function () {
                $scope.formOperationState = pnenum.pnformstate.browse;
                $scope.systemSelectedItem = "";
                $scope.disableForm = true;
                $scope.disableSelectSystem =true;
                $scope.tableGroup = null;
                $scope.tableGroup = {};
                enableGrid();
            }

            $scope.initializeForm();
            //******** آماده سازی فرم برای ایجاد **********
            $scope.prepareFormForInsert = function () {
                $scope.initializeForm();
                $scope.formOperationState = pnenum.pnformstate.insert;
                $scope.disableSystemForm = false;
                $scope.disableForm = false;
                $scope.disableSelectSystem = false;
                disableGrid();
            }

            //********** آماده سازی فرم برای ویرایش ************
            $scope.prepareFormForEdit = function () {
                $scope.formOperationState = pnenum.pnformstate.update;
                disableGrid();
                $scope.disableSystemForm = false;
                $scope.disableSelectSystem = true;
                $scope.disableForm = false;
                //$scope.systemSelectedItem = null;
            }

            // اعتبار سنجی اطلاعات
            $scope.ValidationDataFrom = function () {
                if ($scope.createForm.$valid) { return true; }
                else {

                    var result = {
                        ErrorMessage: null
                       , ValidationErrors: []
                    };
                    angular.forEach($scope.createForm.$error, function (error, index) {

                        angular.forEach(error, function (item, index) {
                            switch (item.$name.trim()) {

                                case "System":
                                    result.ValidationErrors.push({ ErrorMessage: "سیستم انتخاب نشده است." });
                                    break;
                                case "Description":
                                    result.ValidationErrors.push({ ErrorMessage: "نا م گروه خالی است" });
                                    break;
                                case "Abbreviation":
                                    result.ValidationErrors.push({ ErrorMessage: "مخفف سیستم خالی است" });
                                    break;
                                case "TablesGroupProc":
                                    result.ValidationErrors.push({ ErrorMessage: "نام SP خالی است" });
                                    break;
                            }
                        });
                        errorHandler.ShowError(result);
                    });
                    return false;
                }
            };

            //***************Standrad From Events****************
            //******* حذف *******
            $scope.doDelete = function () {
                if ($scope.tableGroup.TableGroupId != null &&  $scope.tableGroup.IsSys==false ) {
                    $scope.delete();
                    return true;
                }
                else { dialog.showMessage("خطا", "رکورد مناسبی برای حذف انتخاب نشده است");
                return false;
                }
            }

            //******* ویرایش *********
            $scope.doEdit = function () {

                if ($scope.tableGroup.TableGroupId != null &&  $scope.tableGroup.IsSys==false) {
                    $scope.formOperationState = pnenum.pnformstate.update;
                    $scope.prepareFormForEdit();
                    focus.setFocus('tableGroup.Description');
                    return true;
                }

                else {
                    dialog.showMessage("خطا", "رکوردی مناسبی برای ویرایش انتخاب نشده است");
                    return false;
                }
            }

             //******* ایجاد *******
            $scope.doInsert = function () {
                if ($scope.systemSelectedItem !== null ) {
                    disableGrid();
                    $scope.prepareFormForInsert();
                    focus.setFocus('systemSelectedItem');
                    return true;
                }
                else {
                    dialog.showMessage("خطا", "لطفا سیستم را انتخاب نمایید");    
                    focus.setFocus('systemSelectedItem');
                    return false;
                }
            };

            //****** انصراف ******
            $scope.doCancel = function () {
                $scope.initializeForm();
                enableGrid();
                return true;
            }
            //******* تایید ******
            $scope.doApplay = function () {
                if ($scope.ValidationDataFrom()) {
                if ($scope.formOperationState === pnenum.pnformstate.insert || $scope.formOperationState === pnenum.pnformstate.update ) {
                    $scope.applyForm();
                    return true;
                }
                else {
                    dialog.showMessage("توجه", "عملیاتی برای ثبت یافت نشد");
                    return false;
                    }
                }
            }
           
            //*******Private Crud********
            //ایجاد
            $scope.insert = function () {
                if ($scope.systemSelectedItem !== null ) {
                   $scope.tableGroup.ParentSystemId = $scope.systemSelectedItem;   
                }
                remoteService.post($scope.tableGroup, WebAccess + "api/tableGroup/CreateTableGroup").then(function (result) {
                    if (result.Success) {
                        notify.success({ message: 'اطلاعات سیستم با موفقیت ثبت شد', title: 'ثبت اطلاعات' });
                        reloadGrid();
                        $scope.initializeForm();
                        $scope.enableGrid();
                    }

                    else {                 
                    errorHandler.ShowError(result);
                    }
                });
            }

            //ویرایش
            $scope.update = function () {
                $scope.tableGroup.FormOperationState = pnenum.pnformstate.update;
                remoteService.post($scope.tableGroup, WebAccess + "api/TableGroup/UpdateTableGroup").then(function (result) {
                    if (result.Success) {
                        notify.success({ message: 'اطلاعات سیستم با موفقیت ویرایش شد', title: 'ویرایش اطلاعات' });
                        reloadGrid();
                        $scope.initializeForm();
                        $scope.enableGrid();
                    }

                    else {
                        errorHandler.ShowError(result);
                    }

                    $scope.tableGroup = null;
                });
            }

            //**********حذف**********
            $scope.delete = function () {
                dialog.showYesNo("توجه", "آیا مطمئن به حذف اطلاعات هستید ؟", "بله", "خیر").then(function (resultConfrim) {
                    if (resultConfrim == null) { return; }
                    else if (resultConfrim == true) {
                        remoteService.post($scope.tableGroup, WebAccess + "api/TableGroup/DeleteTableGroup").then(function (result) {
                            if (result.Success) {
                                notify.success({ message: 'اطلاعات سیستم با موفقیت حذف شد', title: ' حذف اطلاعات' });                                
                                $scope.initializeForm();
                                reloadGrid();
                            }
                            else { $scope.ShowError(result); }
                        });
                    }
                });
            };

            //تایید
            $scope.applyForm = function () {

                if ($scope.formOperationState == pnenum.pnformstate.insert) {
                    $scope.insert();
                }

                if ($scope.formOperationState == pnenum.pnformstate.update) {
                    $scope.update();
                }
            }

            //GetActiveSubSystems
            $scope.getSystemGroup = function () {
                remoteService.post(null, WebAccess + "api/system/GetActiveSubSystems").then(function (loadDataResult) {
                    $scope.systemSelectedItem = "0";
                    $scope.names = loadDataResult.Entities;
                });
            }

            $scope.getSystemGroup();

            // نمایش اطلاعات در گرید
            $scope.showGridSelectedRowInForm = function (entity) {
                $scope.systemSelectedItem = entity.ParentSystemId;
                $scope.tableGroup.Name = entity.Name;
                $scope.tableGroup.Description = entity.Description;
                $scope.tableGroup.Abbreviation = entity.Abbreviation;
                $scope.tableGroup.TablesGroupProc = entity.TablesGroupProc;
                $scope.tableGroup.ParentSystemId = entity.ParentSystemId;
                $scope.tableGroup.TableGroupId = entity.TableGroupId;
                $scope.tableGroup.IsSys=entity.IsSys;
            }

            //************** انتخاب اولین سطر بطور پیش فرض ****************
            $scope.TableGroupGrid_onDataBound = function (kendo) {
                kendo.select(kendo.tbody.find('tr:first').next());
                kendo.select(3);
            }

            //*********** بارگذاری سیستم*********
            $scope.loadTableGroup = function () {
                remoteService.post(null, WebAccess + "api/System/GetMainTableGroup").then(function (loadDataResult) {
                    $scope.tableGroup = loadDataResult.Entities;
                });
            }

            $scope.$watch('selectedItems', function (newVal, oldVal) {
                if ($scope.selectedItems.length <= 0)
                    return;

                $scope.showGridSelectedRowInForm($scope.selectedItems[0]);
            });

            $scope.selectedItems = [];
            $scope.gridConfig = {
                inlineOperationalUrl: {
                    read: {
                        url: WebAccess + "api/TableGroup/GetTableGroup",
                        data: function () {
                            return $scope.filterQuery;
                        }
                    }
                },
                group: {
                    fieldName: "SystemName"
                }
            };

            $scope.gridColumns = [

                {
                    field: "SystemName",
                    editable: false,
                    title: "نام زیر سیستم",
                    allownull: false,
                    width: 90
                },
                {
                    field: "Description",
                    editable: false,
                    title: "نام گروه",
                    allownull: false,
                    width: 90
                },
                {
                    field: "Abbreviation",
                    editable: false,
                    template: "<div style=\"text-align:left;\">#= Abbreviation #</div>",
                    title: "مخفف جدوال گروه",
                    allownull: false,
                    width: 90
                },
                {
                    field: "TablesGroupProc",
                    editable: false,
                    title: "نام SP",
                    allownull: false,
                    width: 90
                },
                {
                     field: 'SystemId',
                     hidden: true,
                     editable: false,
                     title: "شماره والد",
                     allownull: false,
                     width: 130
                 },
                {
                      field: 'TableGroupId',
                      hidden: true,
                      editable: false,
                      title: "کد",
                      allownull: false,
                      width: 130
                  },
            ];

            $scope.gridSchema = {
                model: {
                    id: "Id",
                    fields: {
                        Code: {
                            type: "number",
                            editable: false
                        }
                    }
                },
                data: "Entities",
                total: "TotalCount"
            };
        }]);
});

