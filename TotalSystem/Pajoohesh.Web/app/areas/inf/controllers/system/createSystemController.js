define(["areas/inf/app.areas.inf"], function (inf) {
    inf.register.controller("createSystemController", ["$scope", "$timeout", "pn.remote.service", "pn.dialog", "pn.focus",
        "pn.enum", "pn.array", "Notification", "$rootScope", "infWebAccess", "pn.errorHandler", "pn.message",
        function ($scope, $timeout, remoteService, dialog, focus, pnenum, pnarray, notify, $rootScope, WebAccess, errorHandler, pnMessage) {

            var enableGrid = function () {
                if ($scope.gridApi)
                    $scope.gridApi.setActive(true);
            };

            var disableGrid = function (gridId) {
                $scope.gridApi.setActive(false);
            };

            var reloadGrid = function () {
                $scope.gridApi.refresh();
            };

            var resultHandler = function (result, notifyP) {
                if (result.Success) {
                    notify.success(notifyP);
                    $scope.loadSystems();
                }

                else {
                    errorHandler.ShowError(result);
                }

                return result.Success;
            };

            //****************** Initilize Form Data********************
            $scope.initializeForm = function () {
                $scope.system = {}
                $scope.subsystem = {}
                $scope.isCreateSubSystem = true;
                $scope.disableSystemGroupForm = false;
                $scope.disableSystemForm = true;
                $scope.disableTotalCode = true;
                $scope.disableSystemGroupTextBox = false;
                $scope.systemMaxCode = 10;
                $scope.subSystemMaxCode = '01';
                $scope.formOperationState = pnenum.pnformstate.browse;
                $scope.systemSelectedItem = null;
                enableGrid();
            };

            $scope.initializeForm();

            //**********************************************************************************ایجاد کد تجمعی************************************************************************************** 

            $scope.initializeCodes = function () {
                if ($scope.formOperationState == pnenum.pnformstate.insert) {
                    var custom = angular.isUndefined($scope.system.SystemCode) ? "" : $scope.system.SystemCode;
                    var getSystemQuery = { ParentId: $scope.systemSelectedItem };
                    if ($scope.isCreateSubSystem) {
                        remoteService.post(getSystemQuery, WebAccess + "api/system/GetInfoSystem").then(function (result) {
                            $scope.system.ParentSystemCode = result.SystemCode;
                            if (custom) {
                                if (custom.length < 2) {
                                    custom = FormatNumberLength(custom, 2)
                                }
                                $scope.system.TotalCode = result.SystemCode + custom;
                            }
                            else {
                                $scope.system.SystemCode = $scope.subSystemMaxCode;
                                $scope.system.TotalCode = result.SystemCode + $scope.system.SystemCode;
                            }
                        });
                    }
                    else {
                        if (custom) {
                            $scope.system.SystemCode = custom;
                            $scope.system.TotalCode = custom;

                        } else {
                            $scope.system.SystemCode = $scope.systemMaxCode;
                            $scope.system.TotalCode = $scope.systemMaxCode;
                        }
                    }
                }
            };

            //****************************************************************تغییرات همزمان کد سیستم و کد تجمعی*******************************************************
            $scope.changeSystemCode = function (custom) {

                if ($scope.formOperationState == pnenum.pnformstate.insert) {
                    $scope.system.TotalCode = "در حال محاسبه";
                    {
                        setTimeout(function () {
                            $scope.initializeCodes();
                        }, 1500);
                    }
                }
                else if ($scope.formOperationState == pnenum.pnformstate.update) {
                    if ($scope.isCreateSubSystem) {
                        $scope.system.TotalCode = $scope.system.TotalCode.toString().substring(0, 2) + FormatNumberLength(custom, 2);
                    }
                    else {
                        $scope.system.TotalCode = custom;
                    }
                }
            };
            //------------------  تبدیل عدد یک رقمی به دو رقمی -----------------------
            function FormatNumberLength(num, length) {
                var r = "" + num;
                while (r.length < length) {
                    r = "0" + r;
                }
                return r;
            };

            //****************************************************************************** Events **********************************************************************
            // ******حذف******
            $scope.doDelete = function () {
                var resultDelete = false;
                if ($scope.system.SystemId != null && $scope.system.IsSys == false) {
                    Delete();
                    return true;
                }

                else {
                    dialog.showMessage("خطا", "رکورد مناسبی برای حذف انتخاب نشده است");
                    return false;
                }
            };

            //******* ویرایش **********
            $scope.doEdit = function () {
                if ($scope.system.SystemId != null && $scope.system.IsSys == false) {
                    if ($scope.system.ParentSystemId == "" || $scope.system.ParentSystemId == null) {
                        $scope.isCreateSubSystem = false;
                    }
                    else {
                        $scope.isCreateSubSystem = true;
                    }
                    $scope.formOperationState = pnenum.pnformstate.update;
                    $scope.prepareFormForEdit();
                    focus.setFocus('system.SystemCode');
                    return true;
                }
                else {
                    dialog.showMessage("خطا", "رکورد مناسبی برای ویرایش انتخاب نشده است");
                    $scope.isCreateSubSystem = true;
                    return false;
                }
            };

            //*********انصراف*********
            $scope.doCancel = function () {
                $scope.initializeForm();
                $scope.initializeCodes();
                return true;
            };

            //*********تایید***********
            $scope.doApplay = function () {
                if ($scope.ValidationDataFrom) {
                    if ($scope.formOperationState === pnenum.pnformstate.insert ||
                        $scope.formOperationState === pnenum.pnformstate.update) {
                        $scope.applyForm();
                        return true;
                    }

                    else {
                        dialog.showMessage("توجه", "عملیاتی برای ثبت یافت نشد");
                        return false;
                    }
                }
            };

            //*********ایجاد **********
            $scope.doInsert = function () {
                dialog.showYesNo("توجه", "مایل به تعریف چه نوع سیستمی هستید ؟", "ایجاد یک سیستم", "ایجاد یک گروه سیستم").then(function (result) {
                    if (result == null) {
                        $scope.$emit("toolbar:doCancel");
                        return false;
                    }

                    $scope.formOperationState = pnenum.pnformstate.insert;

                    $scope.system = {};
                    if (result) {
                        if ($scope.systemSelectedItem == null || $scope.systemSelectedItem <= 0) {
                            dialog.showMessage("خطا", "لطفا گروه سیستم را انتخاب نمایید");
                            $scope.$emit("toolbar:doCancel");
                            return false;
                        }

                        disableGrid();
                        $scope.isCreateSubSystem = true;
                        $scope.prepareFormForCreateSubSystem();
                        focus.setFocus('system.SystemCode');
                        return true;

                    } else {
                        disableGrid();
                        $scope.system = {};
                        $scope.isCreateSubSystem = false;
                        $scope.prepareFormForCreateSystem();
                        focus.setFocus('system.SystemCode');
                        return true;
                    }
                });
            };

            //************آماده سازی فرم برای ایجاد سیستم **************
            $scope.prepareFormForCreateSystem = function () {

                $scope.systemSelectedItem = "";
                $scope.disableSystemForm = false;
                $scope.disableSystemGroupForm = true;
                $scope.disableSystemGroupTextBox = true;
                $scope.loadSystems();
                $scope.disableTotalCode = true;
            };

            //************آماده سازی فرم برای ایجاد زیر سیستم ************
            $scope.prepareFormForCreateSubSystem = function () {
                $scope.loadMaxSubSystemCode();
                $scope.disableSystemForm = false;
                $scope.disableSystemGroupForm = true;
                $scope.disableTotalCode = true;
                $scope.disableSystemGroupTextBox = false;
            };

            //************ آماده سازی فرم برای ویرایش************
            $scope.prepareFormForEdit = function () {
                disableGrid();
                $scope.disableSystemForm = false;
                $scope.disableSystemGroupForm = true;
                if ($scope.system.ParentSystemId == null) {
                    $scope.disableSystemGroupTextBox = true;
                }
                else {
                    $scope.disableSystemGroupTextBox = false;
                }
            };

            //***********************************************************************اعتبار سنجی اطلاعات ***************************************************************
            $scope.ValidationDataFrom = function () {
                if ($scope.createForm.$valid) { return true; }

                else {
                    var result = {
                        ErrorMessage: null
                       , ValidationErrors: []
                    };

                    angular.forEach($scope.createForm.$error, function (error, index) {
                        angular.forEach(error, function (item, index) {
                            if ($scope.system.ParentSystemCode != null) {
                                switch (item.$name.trim()) {

                                    case "Name":
                                        result.ValidationErrors.push({ ErrorMessage: "سیستم انتخاب نشده است." });
                                        break;
                                    case "Code":
                                        result.ValidationErrors.push({ ErrorMessage: "کد خالی است" });
                                        break;
                                    case "AbbreviationSystem":
                                        result.ValidationErrors.push({ ErrorMessage: "مخفف سیستم خالی است" });
                                        break;
                                    case "DataBaseName":
                                        result.ValidationErrors.push({ ErrorMessage: "نام بانک اطلاعاتی خالی است" });
                                        break;
                                    case "UserName":
                                        result.ValidationErrors.push({ ErrorMessage: "نام کاربری بانک خالی است" });
                                        break;
                                    case "Password":
                                        result.ValidationErrors.push({ ErrorMessage: "رمز بانک اطلاعاتی خالی است" });
                                        break;
                                    case "Title":
                                        result.ValidationErrors.push({ ErrorMessage: "نام خالی است" });
                                        break;
                                    case "LinkServer":
                                        result.ValidationErrors.push({ ErrorMessage: "نام لینک سرور خالی است" });
                                        break;
                                    case "DataBaseServerAddress":
                                        result.ValidationErrors.push({ ErrorMessage: "آدرس سرور دیتابیس  خالی است" });
                                        break;
                                    case "WebAppAddress":
                                        result.ValidationErrors.push({ ErrorMessage: "آدرس وب سرور خالی است" });
                                        break;
                                    case "EndPointAddress":
                                        result.ValidationErrors.push({ ErrorMessage: "آدرس سرویس باس خالی است" });
                                        break;
                                }
                            }

                            else {
                                switch (item.$name.trim()) {
                                    case "Code":
                                        result.ValidationErrors.push({ ErrorMessage: "کد خالی است" });
                                        break;
                                    case "Title":
                                        result.ValidationErrors.push({ ErrorMessage: "نام خالی است" });
                                        break;
                                }
                            }
                        });

                        if (result.ValidationErrors.length > 0) {
                            errorHandler.ShowError(result);
                            return false;
                        }

                        else
                            return true;
                    });

                    return false;
                }
            };

            //************* نمایش اطلاعات گرید در تکست باکس ها***************
            $scope.showGridSelectedRowInForm = function (entity) {
                if (entity.ParentId == null) {
                    $scope.systemSelectedItem = entity.SystemId;
                }

                else {
                    $scope.systemSelectedItem = entity.ParentId;
                }

                $scope.system.Title = entity.Title;
                $scope.system.Abbreviation = entity.Abbreviation;
                $scope.system.TotalCode = entity.TotalCode;
                $scope.system.DataBaseServerAddress = entity.DataBaseServerAddress;
                $scope.system.WebAppAddress = entity.WebAppAddress;
                $scope.system.EndPointAddress = entity.EndPointAddress;
                $scope.system.DataBaseName = entity.DataBaseName;
                $scope.system.SystemCode = entity.SystemCode;
                $scope.system.LinkServer = entity.LinkServer;
                $scope.system.UserName = entity.UserName;
                $scope.system.SystemId = entity.SystemId;
                $scope.system.ParentSystemId = entity.ParentId;
                $scope.system.IsSys = entity.IsSys;
                $scope.system.IsActive = entity.IsActive;
                $scope.system.IsLastLevel = entity.IsLastLevel;

                if ($scope.system.SystemCode < 10) {
                    $scope.system.SystemCode = "0" + $scope.system.SystemCode;
                }

                if ($scope.system.TotalCode < 10) {
                    $scope.system.TotalCode = "0" + $scope.system.TotalCode;
                }
            };

            //************** انتخاب اولین سطر بطور پیش فرض ****************
            $scope.SystemGrid_onDataBound = function (kendo) {
                kendo.select(kendo.tbody.find('tr:first').next());
                kendo.select(3);
            };

            //*********** بارگذاری سیستم*********
            $scope.loadSystems = function () {
                remoteService.post(null, WebAccess + "api/System/GetMainSystems").then(function (loadDataResult) {
                    $scope.systems = loadDataResult.Entities;
                    $scope.systemMaxCode = loadDataResult.MaxSystemCode;
                    $scope.initializeCodes();
                });
            };

            //************ بارگذاری زیرسیستم *************
            $scope.loadMaxSubSystemCode = function () {
                var test = {};
                test.SystemId = $scope.systemSelectedItem;
                remoteService.post(test, WebAccess + "api/system/GetMaxSystemCodeByParentCode").then(function (loadDataResult) {
                    $scope.subSystemMaxCode = loadDataResult.MaxSubSystemCode;
                    $scope.initializeCodes();
                });
            };

            //************ Private CRUD Functions**************
            $scope.applyForm = function () {
                if ($scope.formOperationState === pnenum.pnformstate.insert) {
                    $scope.insert();
                }

                if ($scope.formOperationState === pnenum.pnformstate.update) {
                    $scope.update();
                }
            }

            //************ ایجاد **************
            $scope.insert = function () {
                if ($scope.systemSelectedItem != null && $scope.systemSelectedItem != "") {
                    $scope.system.ParentSystemId = $scope.systemSelectedItem;
                }

                remoteService.post($scope.system, WebAccess + "api/system/CreateSystem").then(function (result) {
                    console.log(result);
                    if (result.Success) {
                        notify.success({ message: 'اطلاعات سیستم با موفقیت ثبت شد', title: ' ثبت اطلاعات' });
                        $scope.initializeForm();
                        $scope.loadSystems();
                        enableGrid();
                        reloadGrid();
                    } else { errorHandler.ShowError(result); }
                    $scope.CreateSystem = null;
                });
            };

            //*********** ویرایش *************
            $scope.update = function () {
                remoteService.post($scope.system, WebAccess + "api/system/UpdateSystem").then(function (result) {
                    if (result.Success) {
                        notify.success({ message: 'اطلاعات سیستم با موفقیت ویرایش شد', title: ' ویرایش اطلاعات' });
                        $scope.initializeForm();
                        $scope.loadSystems();
                        enableGrid();
                        reloadGrid();
                    }

                    else {
                        errorHandler.ShowError(result);
                    }

                    $scope.CreateSystem = null;
                });
            };

            $scope.loadSystems();

            //********************* حذف **************************
            function Delete() {
                var resultDelete = false;

                //چک کردن سیستم
                if ($scope.system == null)
                    notify.error({ message: pnMessage.common.errorDelete, title: pnMessage.common.error });

                //چک کردن خالی بودن سیستم
                else if ($scope.system.SystemId == null)
                    notify.error({ message: pnMessage.common.errorDelete, title: pnMessage.common.error });
                  
                // چک کردن زیر سیستم های یک سیستخم
                else {
                    $scope.DataSystem = { Key: $scope.system.SystemId };                    
                    remoteService.post($scope.DataSystem, WebAccess + "api/system/GetExistSubSystem").then(function (result) {
                      
                        if (result.Entity.IsHasKey == true && $scope.system.IsLastLevel == false) {
                                notify.error({ message: " ایتدا زیر سیستم ها را حذف نمایید.", title: pnMessage.common.error });
                        }

                        else {
                            dialog.showYesNo(pnMessage.common.note, pnMessage.common.deleteSure, pnMessage.common.yes, pnMessage.common.no).then(function (resultConfrim) {
                                if (resultConfrim == null) { return resultDelete; }

                                else if (resultConfrim == true) {
                                    remoteService.post($scope.system, WebAccess + "api/system/DeleteSystems").then(function (resultDeleteReq) {
                                        var notifyP = { message: pnMessage.common.successfullDelete, title: pnMessage.common.delete };
                                        resultDelete = resultHandler(resultDeleteReq, notifyP);
                                        $scope.initializeForm();                                 
                                        $scope.loadSystems();
                                        reloadGrid();
                                    });
                                }
                            });
                        }
                    });
                }

                return resultDelete;
            };

            //********************** grid Config********************
            $scope.selectedItems = [];
            $scope.gridConfig = {
                inlineOperationalUrl: {
                    read: {
                        url: WebAccess + "api/system/GetAllSystems",
                        data: function () {
                            return $scope.filterQuery;
                        }
                    }
                },
                group: { fieldName: 'ParentName' }
            };

            $scope.gridColumns = [
                {
                    field: 'ParentName',
                    editable: false,
                    title: "گروه سیستم",
                    allownull: false,
                    width: 100,
                },
                {
                    field: 'TotalCode',
                    editable: false,
                    title: "کد تجمعی",
                    allownull: false,
                    width: 90
                },
                {
                    field: 'Name',
                    editable: false,
                    title: "نام",
                    allownull: false,
                    width: 90
                },
                {
                    field: 'Abbreviation',
                    editable: false,
                    title: "مخفف سیستم",
                    template: "<div style=\"text-align:left;\">#= Abbreviation #</div>",
                    allownull: false,
                    width: 130,
                    attributes: { style: "text-align:left" }
                },
                {
                    field: 'DataBaseName',
                    editable: false,
                    title: "نام بانک اطلاعاتی",
                    allownull: false,
                    width: 130,
                    attributes: { style: "text-align:left" }
                },
                {
                    field: 'DataBaseServerAddress',
                    editable: false,
                    title: "آدرس دیتابیس ",
                    allownull: false,
                    width: 130,
                    attributes: { style: "text-align:left" }
                },
                {
                    field: 'WebAppAddress',
                    editable: false,
                    title: "آدرس وب سرور",
                    allownull: false,
                    width: 130,
                    attributes: { style: "text-align:left" }
                },
                {
                    field: 'EndPointAddress',
                    editable: false,
                    title: "آدرس سرویس باس ",
                    allownull: false,
                    width: 130,
                    attributes: { style: "text-align:left" }
                },
                {
                    field: 'LinkServer',
                    hidden: true,
                    editable: false,
                    title: "نام لینک سرور",
                    allownull: false,
                    width: 130,
                    attributes: { style: "text-align:left" }
                },
                {
                    field: 'UserName',
                    hidden: true,
                    editable: false,
                    title: "نام کاربری",
                    allownull: false,
                    width: 130,
                    attributes: { style: "text-align:left" }
                },
                {
                    field: 'SystemCode',
                    hidden: true,
                    editable: false,
                    title: "کد سیستم",
                    allownull: false,
                    width: 130
                },
                {
                    field: 'SystemId',
                    hidden: true,
                    editable: false,
                    title: "شماره سیستم",
                    allownull: false,
                    width: 130
                },
                {
                    field: 'ParentId',
                    hidden: true,
                    editable: false,
                    title: "شماره والد",
                    allownull: false,
                    width: 130
                },
                {
                    field: 'IsActive',
                    editable: false,
                    title: "فعال ",
                    allownull: false,
                    width: 100,
                    attributes: { style: "text-align:Center" },
                    template: '<input type="checkbox" ng-checked=\"this.dataItem.IsActive\" ng-disabled="true" />'
                },
            ];

            $scope.gridSchema = {
                model: {
                    id: 'Id',
                    fields: {
                        Code: {
                            type: 'number',
                            editable: false
                        }
                    }
                },
                data: 'Entities',
                total: 'TotalCount',
            };

            $scope.gridGroups = {};

            $scope.$watch('selectedItems', function (newVal, oldVal) {
                if ($scope.selectedItems.length <= 0)
                    return;
                $scope.showGridSelectedRowInForm($scope.selectedItems[0]);
            });

        }]);
});


