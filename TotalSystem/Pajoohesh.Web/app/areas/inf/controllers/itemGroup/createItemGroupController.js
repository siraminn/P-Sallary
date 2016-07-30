define(["areas/inf/app.areas.inf"], function (inf) {
    inf.register.controller("createItemGroupController", ["$scope", "pn.remote.service", "pn.enum", "pn.dialog", "pn.focus",
    "Notification", "infWebAccess", "$state", "pn.errorHandler", "pn.validator", "$q", "pn.message",
    function ($scope, remoteService, pnenum, dialog, focus, notify, WebAccess, $state, errorHandler, validator, $q, pnMessage) {


        //***************enable ItemGroup Grid*************
        var enableItemGroupGrid = function () {
            if ($scope.gridApiItemGroup)
                $scope.gridApiItemGroup.setActive(true);
        }

        //*************enable FieldItems Grid***************
        var enableFieldItemsGrid = function () {
            if ($scope.gridApiFieldItems)
                $scope.gridApiFieldItems.setActive(true);
        }

        // ********* disable ItemGroup Grid **************
        var disableItemGroupGrid = function () {
            $scope.gridApiItemGroup.setActive(false);
        }

        // **********disable FieldItems Grid***************
        var disableFieldItemsGrid = function () {
            $scope.gridApiFieldItems.setActive(false);
        }

        // *************************Initilize Form Data************************************
        $scope.initializeForm = function () {
            $scope.formOperationState = pnenum.pnformstate.browse;
            $scope.disableCtrlFieldItemsForm = true;
            $scope.disableCtrlItemGroupForm = true;

            //تعریف پارامتر های مربوط به فرم
            $scope.ItemGroup = {}
            $scope.ItemGroup.ItemGroupId;
            $scope.ItemGroup.Code;
            $scope.ItemGroup.Description = "";
            $scope.ItemGroup.Alias = "";

            $scope.FieldItems = {}
            $scope.FieldItems.Value = "";
            $scope.FieldItems.Alias = "";
            $scope.FieldItems.IsActive = false;
            $scope.FieldItems.Order;
            $scope.FieldItems.Code;

            $scope.FieldItems.ItemGroupId;
            $scope.FieldItems.FieldItemsId;

            //متغیری جهت تعیین نوع فرم انتخابی
            $scope.IsItemGroupDo = true;
            //--------------------
            enableItemGroupGrid();
            enableFieldItemsGrid();
        };
        $scope.initializeForm();

        //************************* Just In English *****************************
        $(".enAlpha").keypress(function (event) {
            var ew = event.which;
            if (ew == 32)
                return true;
            if (48 <= ew && ew <= 57)
                return false;
            if (65 <= ew && ew <= 90)
                return true;
            if (97 <= ew && ew <= 122)
                return true;
            return false;
        });

        //************** Upper Case  *************
        $(".upperCase").keyup(function () {
            this.value = this.value.toUpperCase();
        });

        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Item Group +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        $scope.$watch('selectedItemsItemGroup', function (newVal, oldVal) {
            if ($scope.selectedItemsItemGroup.length <= 0)
                return;
            $scope.showGridSelectedRowInFormItemGroup($scope.selectedItemsItemGroup[0]);
        });

        $scope.selectedItemsItemGroup = [];
        //------------------Grid Config---------------------------------
        $scope.gridConfigItemGroup = {
            inlineOperationalUrl: {
                read: {
                    url: WebAccess + "api/itemGroup/GetAllItemGroup",
                    data: function () {
                        return $scope.filterQuery;
                    }
                }
            }
        };

        //----------------------grid Columns----------------------------
        $scope.gridColumnsItemGroup = [
            {
                field: "Code",
                editable: false,
                title: "کد",
                allownull: false,
                width: 90
            },
            {
                field: "Description",
                editable: false,
                title: "شرح",
                allownull: false,
                width: 90
            },
            {
                field: "Alias",
                editable: false,
                title: "نام مستعار",
                allownull: false,
                attributes: { style: "text-align:left" },
                width: 90
            }
        ];

        //----------------------grid Schema----------------------------
        $scope.gridSchemaItemGroup = {
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
        //****************دریافت اطلاعات  از گرید**********************
        $scope.showGridSelectedRowInFormItemGroup = function (entity) {
            $scope.ItemGroup.Description = entity.Description;
            $scope.ItemGroup.Code = entity.Code;
            $scope.ItemGroup.ItemGroupId = entity.ItemGroupId;
            $scope.ItemGroup.IsSys = entity.IsSys;
            $scope.FieldItemsArray = entity.FieldItems;
            $scope.ItemGroup.Alias = entity.Alias;
            $scope.objoptions.dataSource = $scope.FieldItemsArray;
            $scope.objkendo.setOptions($scope.objoptions)
        };
        //انتخاب اولین سطر بطور پیش فرض
        $scope.ItemGroupGrid_onDataBound = function (kendo) {
            kendo.select(kendo.tbody.find('tr:first'));
            kendo.select(3);
        }
        //ریفریش اطلاعات گرید اول
        var reloadGridItemGroup = function () {
            $scope.gridApiItemGroup.refresh();
            $scope.showGridSelectedRowInFormItemGroup($scope.selectedItemsItemGroup[0]);
        }

        //********************************************************** doInsert ****************************************************************
        $scope.doInsert = function () {
            dialog.showYesNo("توجه", "ایتم مورد نظر خود را جهت ثبت اطلاعات انتخاب کنید", "ردیف لیست", "گروه لیست").then(function (result) {
                if (result == null) {
                    return false;
                }
                //ItemGroup
                if (result == false) {
                    $scope.formOperationState = pnenum.pnformstate.insert;
                    $scope.IsItemGroupDo = true;
                    $scope.ItemGroup.Code = "";
                    $scope.ItemGroup.Description = "";
                    $scope.ItemGroup.Alias = "";
                    $scope.disableCtrlFieldItemsForm = true;
                    $scope.disableCtrlItemGroupForm = false;
                    focus.setFocus('ItemGroup.Code');
                    disableItemGroupGrid();
                    disableFieldItemsGrid();
                    return true;
                }
                    //FieldItems
                else {

                    if ($scope.ItemGroup.ItemGroupId != null) {
                        $scope.formOperationState = pnenum.pnformstate.insert;
                        $scope.IsItemGroupDo = false;
                        $scope.FieldItems.Value = "";
                        $scope.FieldItems.IsActive = false;
                        $scope.FieldItems.Order = "";
                        $scope.FieldItems.Code = "";
                        $scope.FieldItems.Alias = "";
                        $scope.FieldItems.ItemGroupId = $scope.ItemGroup.ItemGroupId;
                        $scope.disableCtrlItemGroupForm = true;
                        $scope.disableCtrlFieldItemsForm = false;
                        focus.setFocus('FieldItems.Order');
                        disableItemGroupGrid();
                        disableFieldItemsGrid();
                        return true;
                    }
                    else {
                        dialog.showMessage("توجه", "گروه لیست نمی تواند خالی باشد. ");
                        return false;
                    }
                }
            });
        };

        //************************************************** Do Delete *******************************************************************************
        $scope.doDelete = function () {
            dialog.showYesNo("توجه", "ایتم مورد نظر خود را جهت حذف اطلاعات انتخاب کنید", "ردیف لیست", "گروه لیست").then(function (result) {
                if (result == null) { return; }
                //ItemGroup
                if (result == false) {
                    if ($scope.ItemGroup != null) {
                        if ($scope.ItemGroup.ItemGroupId != null && $scope.ItemGroup.IsSys == false) {
                            $scope.deleteItemGroup();
                            return true;
                        }
                        else {
                            dialog.showMessage("توجه", "رکورد مناسبی برای حذف انتخاب نشده است ");
                            return false;
                        }
                    }
                }
                    //fieldItems
                else {
                    if (result == true) {
                        if ($scope.FieldItems != null) {
                            if ($scope.FieldItems.FieldItemsId != null && $scope.FieldItems.IsSys == false) {
                                $scope.deleteFieldItems();
                                return true;
                            }
                            else {
                                dialog.showMessage("توجه", "رکورد مناسبی برای حذف انتخاب نشده است");
                                return false;
                            }
                        }
                        else {
                            dialog.showMessage("توجه", "اطلاعاتی برای حذف وجود ندارد");
                            return false;
                        }
                    }
                }
            });
        };

        //*******************************************************************do Apply*******************************************************************
        $scope.doApplay = function () {

            var isValid = $scope.IsItemGroupDo ? $scope.ValidationDataFromItemGroup() : $scope.ValidationDataFromFieldItems();

            if (isValid && $scope.formOperationState == pnenum.pnformstate.insert || $scope.formOperationState == pnenum.pnformstate.update) {
                $scope.applyForm();
                return true;
            }
            else if(isValid){
                dialog.showMessage("توجه", "عملیاتی برای ثبت یافت نشد");
                return false;
            }
        };

        // ***********************************************   اعتبار سنجی اطلاعات لیست آیتم ها ****************************************************
        $scope.ValidationDataFromItemGroup = function () {
            var result = {
                ErrorMessage: null,
                ValidationErrors: []
            };

            if ($scope.createFormItemGroup.$valid == false)
                var result = validator.Validate($scope.createFormItemGroup);
            if ($scope.IsItemGroupDo == true) {
                if ($scope.ItemGroup.Code == null || $scope.ItemGroup.Code == "")
                    result.ValidationErrors.push({ ErrorMessage: "کد گروه لیست خالی است" });

                if ($scope.ItemGroup.Description == null || $scope.ItemGroup.Description == "")
                    result.ValidationErrors.push({ ErrorMessage: "نام گروه لیست خالی است" });

                if ($scope.ItemGroup.Alias == null || $scope.ItemGroup.Alias == "")
                    result.ValidationErrors.push({ ErrorMessage: "نام مستعار لیست خالی است" });
            }

            if (result.ValidationErrors.length > 0) {
                errorHandler.ShowError(result);
                return false;
            }
            else
                return true;
        };

        //*************************************************** اعتبار سنجی اطلاعات فیلد آیتم ها **************************************************
        $scope.ValidationDataFromFieldItems = function () {
            var result = {
                ErrorMessage: null,
                ValidationErrors: []
            };
            if ($scope.createFormFieldItem.$valid == false)
                var result = validator.Validate($scope.createFormFieldItem);

            if ($scope.IsItemGroupDo == false) {
                if ($scope.FieldItems.Code == null || $scope.FieldItems.Code == "")
                    result.ValidationErrors.push({ ErrorMessage: "کد لیست خالی است" });
                if ($scope.FieldItems.Order == null || $scope.FieldItems.Order == "")
                    result.ValidationErrors.push({ ErrorMessage: "ردیف لیست خالی است" });
                if ($scope.FieldItems.Value == null || $scope.FieldItems.Value == "")
                    result.ValidationErrors.push({ ErrorMessage: "شرح ردیف لیست خالی است" });
                if ($scope.FieldItems.Alias == null || $scope.FieldItems.Alias == "")
                    result.ValidationErrors.push({ ErrorMessage: "نام مستعار لیست خالی است" });
            }

            if (result.ValidationErrors.length > 0) {
                errorHandler.ShowError(result);
                return false;
            }
            else
                return true;
        };

        // ************************************************doEdit************************************************************
        $scope.doEdit = function () {
            dialog.showYesNo("توجه", "ایتم مورد نظر خود را جهت اصلاح اطلاعات انتخاب کنید", "ردیف لیست", "گروه لیست").then(function (result) {
                if (result == null) {
                    return false;
                }
                if (result == false) {
                    if ($scope.ItemGroup.ItemGroupId !== null && $scope.ItemGroup.IsSys == false) {
                        $scope.formOperationState = pnenum.pnformstate.update;
                        $scope.IsItemGroupDo = true;
                        $scope.disableCtrlItemGroupForm = false;
                        $scope.disableCtrlFieldItemsForm = true;
                        focus.setFocus('ItemGroup.Code');
                        disableItemGroupGrid();
                        disableFieldItemsGrid();
                        return true;
                    }
                    else {
                        dialog.showMessage("خطا", "رکورد مناسبی برای ویرایش انتخاب نشده است");
                        $scope.IsItemGroupDo = false;
                        return false;
                    }
                }
                else {
                    if ($scope.FieldItems.FieldItemsId !== null && $scope.FieldItems.IsSys == false) {
                        $scope.formOperationState = pnenum.pnformstate.update;
                        $scope.IsItemGroupDo = false;
                        $scope.disableCtrlItemGroupForm = true;
                        $scope.disableCtrlFieldItemsForm = false;
                        focus.setFocus('FieldItems.Order');
                        disableItemGroupGrid();
                        disableFieldItemsGrid();
                        return true;

                    }
                    else {
                        dialog.showMessage("خطا", "رکورد مناسبی برای ویرایش انتخاب نشده است");
                        return false;
                    }
                }
            });
        };
        //*********انصراف*********
        $scope.doCancel = function () {
            $scope.initializeForm();
            return true;
        }
        //*******************تایید**********************
        $scope.applyForm = function () {
            if ($scope.formOperationState == pnenum.pnformstate.insert) {

                if ($scope.IsItemGroupDo == true) {
                    $scope.insertItemGroup();
                }
                else
                    $scope.insertFieldItems();
            }

            else if ($scope.formOperationState == pnenum.pnformstate.update) {
                if ($scope.IsItemGroupDo == true)
                    $scope.updateItemGroup();
                else
                    $scope.updateFieldItems();
            }
        };

        //******************************************* 
        function GetNewItemGroup() {
            if ($scope.ItemGroup.Code.length == 0)
                $scope.ItemGroup.Code = 0;
        };
        //***************************************************** insert *******************************************************
        $scope.insertItemGroup = function () {
            GetNewItemGroup();
            remoteService.post($scope.ItemGroup, WebAccess + "api/ItemGroup/CreateItemGroup").then(function (result) {

                if (result.Success) {
                    notify.success({ message: 'اطلاعات سیستم با موفقیت ثبت شد', title: ' ثبت اطلاعات' });
                    $scope.initializeForm();
                    reloadGridItemGroup();
                }

                else {
                    if ($scope.ItemGroup.Code == 0) {
                        $scope.ItemGroup.Code = "";                        
                    }
                    else {
                        errorHandler.ShowError(result);
                    }
                }

                $scope.ItemGroup = null;
            });
        }

        //*************************************Edit Item Group**********************************
        $scope.updateItemGroup = function () {
            GetNewItemGroup();
            remoteService.post($scope.ItemGroup, WebAccess + "api/ItemGroup/UpdateItemGroup").then(function (result) {

                if (result.Success) {
                    notify.success({ message: 'اطلاعات سیستم با موفقیت اصلاح شد', title: ' اصلاح اطلاعات' });
                    reloadGridItemGroup();
                    $scope.initializeForm();
                }

                else {

                    if ($scope.ItemGroup.Code == 0){
                        $scope.ItemGroup.Code = "";
                    }

                    else {
                        errorHandler.ShowError(result);
                    }              
                }
            });
        }

        //***************************************************Delete Item group********************************************************
        $scope.deleteItemGroup = function () {
            dialog.showYesNo("توجه", "آیا مطمئن به حذف اطلاعات هستید ؟", "بله", "خیر").then(function (resultConfrim) {
                if (resultConfrim == null) { return; }
                else if (resultConfrim == true) {
                    remoteService.post($scope.ItemGroup, WebAccess + "api/ItemGroup/DeleteItemGroup").then(function (resultDelete) {
                        if (resultDelete.Success) {
                            notify.success({ message: 'اطلاعات سیستم با موفقیت حذف شد', title: ' حذف اطلاعات' });
                            $scope.initializeForm();
                            reloadGridItemGroup();
                        }
                        else { $scope.ShowError(resultDelete); }
                    });
                }
            });
        };

        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  گرید دوم    +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        $scope.selectedItemsFieldItems = [];
        $scope.objkendo;
        $scope.objoptions;
        $scope.FieldItems_onKendoReady = function (kendo, options) {
            $scope.objkendo = kendo;
            $scope.objoptions = Option;
            $scope.objoptions.dataSource = $scope.FieldItemsArray;
            $scope.objkendo.setOptions($scope.objoptions);
        }

        $scope.gridConfigFieldItems = {
            inlineOperationalUrl: {
                read: {
                    url: WebAccess + "api/itemGroup/GetAllItemGroup",
                    data: {}
                }
            },
            pageSizes: true
        };

        $scope.gridColumnsFieldItems = [
           {
               field: "Order",
               editable: false,
               title: "ردیف",
               allownull: false,
               width: 90
           },
           {
               field: "Code",
               editable: false,
               title: "کد",
               allownull: false,
               width: 90
           },
           {
               field: "Value",
               editable: false,
               title: "شرح",
               allownull: false,
               width: 90
           },
           {
                field: "Alias",
                editable: false,
                title: "نام مستعار",
                allownull: false,
                attributes: { style: "text-align:left" },
                width: 90
            },
           {
               field: "IsActive",
               editable: false,
               title: "فعال",
               allownull: false,
               width: 90,
               attributes: { style: "text-align:Center" },
               template: '<input type="checkbox" ng-checked=\"this.dataItem.IsActive\" ng-disabled="true" />'
           }
        ];
        $scope.gridSchemaFieldItems = {
            data: "Entities",
            total: "TotalCount"
        };

        // ریفرش کردن گرید فیلد آیتم
        var reloadGridFieldItems = function () {
            $scope.gridApiFieldItems.refresh();
        }
        //********************************* نمایش اطلاعات گرید فیلد آتیم ***************************************

        $scope.showGridSelectedRowInFormFieldItems = function (entity) {

            $scope.FieldItems.Value = entity.Value;
            $scope.FieldItems.IsActive = entity.IsActive == 1 ? true : false;
            $scope.FieldItems.Order = entity.Order;
            $scope.FieldItems.Code = entity.Code;
            $scope.FieldItems.Alias = entity.Alias;
            $scope.FieldItems.FieldItemsId = entity.FieldItemId;
            $scope.FieldItems.ItemGroupId = entity.ItemGroupId;
            $scope.FieldItems.IsSys = entity.IsSys;
        }
        //انتخاب اولین سطر بطور پیش فرض
        $scope.FieldItemsGrid_onDataBound = function (kendo) {
            kendo.select(kendo.tbody.find('tr:first'));
            kendo.select(3);

        }
        $scope.$watch('selectedItemsFieldItems', function (newVal, oldVal) {
            if ($scope.selectedItemsFieldItems.length <= 0)
                return;

            $scope.showGridSelectedRowInFormFieldItems($scope.selectedItemsFieldItems[0]);
        });
        //*******************************************  
        function GetNewFieldItems() {
            if ($scope.FieldItems.Order == 0)
                $scope.FieldItems.Order = 0;
        };
        //***************************************************** insert FieldItems **********************************************
        $scope.insertFieldItems = function () {
            GetNewFieldItems();
            remoteService.post($scope.FieldItems, WebAccess + "api/ItemGroup/CreateFieldItems").then(function (result) {
             
                if (result.Success) {
                    notify.success({ message: 'اطلاعات سیستم با موفقیت ثبت شد', title: ' ثبت اطلاعات' });
                    //اضافه کردن به ارایه مورد نظر
                    $scope.FieldItemsArray = $scope.FieldItemsArray.push($scope.FieldItems);
                    $scope.initializeForm();
                    reloadGridItemGroup();
                    
                }

                else {
                    if ($scope.FieldItems.Order == 0){
                        $scope.FieldItems.Order = "";
                    }

                    else {
                        errorHandler.ShowError(result);
                    }
                }
                $scope.FieldItems = null;
            });
        }
        //******************************************************* update FieldItems **********************************************************
        $scope.updateFieldItems = function () {
            GetNewFieldItems();
            remoteService.post($scope.FieldItems, WebAccess + "api/ItemGroup/UpdateFieldItems").then(function (result) {
                if (result.Success) {
                    notify.success({ message: 'اطلاعات سیستم با موفقیت اصلاح شد', title: ' اصلاح اطلاعات' });
                    //ویرایش ایتم مورد نظر
                    $scope.selectedItemsFieldItems[0];
                    $scope.selectedItemsFieldItems[0].Value = $scope.FieldItems.Value;
                    $scope.selectedItemsFieldItems[0].IsActive = $scope.FieldItems.IsActive;
                    $scope.selectedItemsFieldItems[0].Order = $scope.FieldItems.Order;
                    $scope.selectedItemsFieldItems[0].Code = $scope.FieldItems.Code;
                    $scope.selectedItemsFieldItems[0].Alias = $scope.FieldItems.Alias;
                    $scope.selectedItemsFieldItems[0].FieldItemId = $scope.FieldItems.FieldItemsId;
                    $scope.initializeForm();
                    reloadGridItemGroup();
                }

                else {
                    if ($scope.FieldItems.Order == 0) {
                        $scope.FieldItems.Order = "";
                    }

                    else{
                        errorHandler.ShowError(result);
                    }
                }
            });
        }

        //****************************************************** Delete FieldItems  **************************************************
        $scope.deleteFieldItems = function () {
            dialog.showYesNo("توجه", "آیا مطمئن به حذف اطلاعات هستید ؟", "بله", "خیر").then(function (resultConfrim) {
                if (resultConfrim == null) { return; }
                else if (resultConfrim == true) {
                    remoteService.post($scope.FieldItems, WebAccess + "api/ItemGroup/DeleteFieldItems").then(function (resultDelete) {
                        if (resultDelete.Success) {
                            notify.success({ message: 'اطلاعات سیستم با موفقیت حذف شد', title: ' حذف اطلاعات' });
                            $scope.initializeForm();
                            reloadGridItemGroup();

                        }
                        else {

                            $scope.ShowError(resultDelete);
                        }

                        //  $scope.FieldItems = null;

                    });
                }
            });
        };

        //    The End

    }]);
});
