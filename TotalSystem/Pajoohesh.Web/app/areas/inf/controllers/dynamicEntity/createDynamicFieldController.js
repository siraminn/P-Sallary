define(["areas/inf/app.areas.inf"], function (inf) {
    inf.register.controller("createDynamicFieldController", [
        "$scope", "pn.remote.service", "pn.enum", "pn.dialog", "pn.focus", "Notification",
        "infWebAccess", "cache", "$state", "pn.errorHandler", "pn.validator", "$q", "pn.message", "structureTableService",
    function ($scope, remoteService, pnenum, dialog, focus, notify, WebAccess, cache, $state, errorHandler, validator, $q, pnMessage, structureTableService) {

        $scope.cacheDynamicEntity = cache.dynamicEntity;

       
        //  If State Changed 
        var isDoInsertClicked = false;

        //----------------------------------------------           
        var reloadGrid = function () {
            $scope.gridApi.refresh();
        }

        //----------------------------------------------
        var enableGrid = function () {
            if ($scope.gridApi)
                $scope.gridApi.setActive(true);
        }

        //----------------------------------------------
        var disableGrid = function () {
            if ($scope.gridApi)
                $scope.gridApi.setActive(false);
        }

        // Initilize Form Data
        $scope.initializeForm = function () {
            $scope.dynamicEntity = {};
            $scope.dynamicField = {};
            $scope.disableItemGroup = true;
            $scope.formOperationState = pnenum.pnformstate.browse;
            $scope.disableTableGroup = true;
            $scope.disableCreateForm = true;
            $scope.hideOtherTablesSturctureBtn = true;
            enableGrid();
            isDoInsertClicked = false;
        }

        // Initilize Create Form Data
        $scope.initializeCreateForm = function () {
            $scope.dynamicField.TablesKey = "";
            $scope.dynamicField.FieldCode = "";
            $scope.dynamicField.FieldOrder = "";
            $scope.dynamicField.MinRange = "";
            $scope.dynamicField.ModifyVersion = false;
            $scope.dynamicField.LatinName = "";
            $scope.dynamicField.MaxRange = "";
            $scope.dynamicField.IsPrimaryKey = false;
            $scope.dynamicField.FieldAlias = "";
            $scope.dynamicField.Length = "";
            $scope.dynamicField.IsIdentity = false;
            $scope.dynamicField.PersianName = "";
            $scope.dynamicField.FieldItemsTypeEditKey = null;
            $scope.dynamicField.Sys5FieldGroup = "";
            $scope.dynamicField.FieldKindKey = null;
            $scope.dynamicField.IsEmpty = false;
            $scope.dynamicField.TypesCode = null;
            $scope.dynamicField.ItemGroupKey = null;
            $scope.dynamicField.IsYes = false;
            $scope.dynamicField.FieldGroupKey = null;
            $scope.dynamicField.IsRepeated = false;
            $scope.dynamicField.StructureOtherTables = "";
            $scope.dynamicField.IsSys = false;
        };

        //----برای نمایش پیام ها و خطا ها----
        var resultHandler = function (result, notifyP) {
            if (result.Success) {
                notify.success(notifyP);
                $scope.initializeForm();
            }
            else {
                errorHandler.ShowError(result);
            }
            return result.Success;
        }

        //فقط حروف انگلیسی مورد قبول است 
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

        //******************** نوع فیلد****************************
        var getFieldSqlType = function () {
            remoteService.post(null, WebAccess + "api/Types/GetFieldSqlType").then(function (loadDataResult) {
                $scope.FieldSructure = loadDataResult.Entities;
            });
        }

        //******************** حالت فیلد***************************
        var getFieldKinds = function () {
            remoteService.post(null, WebAccess + "api/FieldKinds/GetFieldKinds").then(function (loadDataResult) {
                $scope.FieldKinds = loadDataResult.Entities;
            });
        }

        //******************** نوع ویرایش جدول*********************
        var getTableTypeEdit = function () {
            remoteService.post(null, WebAccess + "api/ItemGroup/GetItemGroupForTableTypeItems").then(function (loadDataResult) {
                $scope.TableTypeEdit = loadDataResult.Entities[0].FieldItems;
            });
        }

        //******************** گروه آیتم ها************************
        var getItemGroup = function () {
            remoteService.post(null, WebAccess + "api/ItemGroup/GetAllItemGroupByTypesKey").then(function (loadDataResult) {
                $scope.ItemGroup = loadDataResult.Entities;
            });
        }

        //******************** گروه فیلد **************************
        var getFieldGroup = function () {
            remoteService.post(null, WebAccess + "api/FieldGroup/GetAllFieldGroup").then(function (loadDataResult) {
                //-----------حذف گزینه ی بدون گروه -----------
                if (!isDoInsertClicked)
                    $scope.FieldGroup = loadDataResult.Entities;
                else
                    $scope.FieldGroup = loadDataResult.Entities.slice(1);
            });
        }

        // **************************************************** Standrad From Events **********************************************************
        //*********************** Do Insert ***********************
        $scope.doInsert = function () {
            isDoInsertClicked = true;
            if ($scope.cacheDynamicEntity.PersianName !== null) {
                $scope.prepareFormForInsert();
                return true;
            }
            else {
                dialog.showMessage("خطا", "لطفا جدول مورد نظر را انتخاب نمایید");
                return false;
            }
        }

        //************************ Do Delete **********************
        $scope.doDelete = function () {
            if ($scope.cacheDynamicEntity.PersianName !== null && $scope.dynamicField.FieldsKey !== null && $scope.dynamicField.IsSys == false) {
                $scope.delete();
                return true;
            }
            else {
                dialog.showMessage("خطا", "رکورد مناسبی برای حذف انتخاب نشده است");
                return false;
            }
        }

        //**********************Delete*****************************
        $scope.delete = function () {
            dialog.showYesNo("توجه", "آیا مطمئن به حذف اطلاعات هستید ؟", "بله", "خیر").then(function (resultConfrim) {
                if (resultConfrim == null) { return; }
                else if (resultConfrim == true) {
                    remoteService.post($scope.dynamicField, WebAccess + "api/DynamicFields/DeleteDynamicFeild").then(function (result) {
                        if (result.Success) {
                            notify.success({ message: 'اطلاعات با موفقیت حذف شد', title: ' حذف اطلاعات' });
                            $scope.initializeForm();
                            reloadGrid();
                        }
                        else { $scope.ShowError(result); }
                    });
                }
            });
        };

        //*********************** Do Edit *************************
        $scope.doEdit = function () {
            isDoInsertClicked = false;
            if ($scope.cacheDynamicEntity.PersianName !== null && $scope.dynamicField.FieldsKey !== null && $scope.dynamicField.IsSys == false) {
                $scope.prepareFormForEdit();
                focus.setFocus("dynamicEntity.Code");
                return true;
            }

            else {
                dialog.showMessage("خطا", "رکوردی مناسبی برای ویرایش انتخاب نشده است");
                return false;
            }
        }

        //********************** Do Cancel ************************
        $scope.doCancel = function () {
            $scope.initializeForm();
            enableGrid();
            isDoInsertClicked = false;
            return true;
        }

        // ****************************************************اعتبار سنجی اطلاعات******************************************************
        $scope.ValidationDataFrom = function () {
            var result = {
                ErrorMessage: null,
                ValidationErrors: []
            };
            if ($scope.createForm.$valid == false)
                var result = validator.Validate($scope.createForm);

            if ($scope.dynamicField.FieldCode == null || $scope.dynamicField.FieldCode == "")
                result.ValidationErrors.push({ ErrorMessage: " ورود کد الزامی است." });
            if ($scope.dynamicField.FieldOrder == null || $scope.dynamicField.FieldOrder == "")
                result.ValidationErrors.push({ ErrorMessage: " ورود ردیف الزامی است." });
            if ($scope.dynamicField.LatinName == null || $scope.dynamicField.LatinName == "")
                result.ValidationErrors.push({ ErrorMessage: " شرح لاتین را وارد نمایید." });
            if ($scope.dynamicField.FieldAlias == null || $scope.dynamicField.FieldAlias == "")
                result.ValidationErrors.push({ ErrorMessage: " نام مستعار را وارد نمایید." });
            if ($scope.dynamicField.PersianName == null || $scope.dynamicField.PersianName == "")
                result.ValidationErrors.push({ ErrorMessage: " نام فارسی را وارد نمایید." });
            if ($scope.dynamicField.Sys5FieldGroup == null || $scope.dynamicField.Sys5FieldGroup == "")
                result.ValidationErrors.push({ ErrorMessage: " شرح گروه فیلد را وارد نمایید." });
            if ($scope.dynamicField.MinRange == null || $scope.dynamicField.MinRange == "")
                result.ValidationErrors.push({ ErrorMessage: " کمترین مقدار را وارد نمایید." });
            if ($scope.dynamicField.MaxRange == null || $scope.dynamicField.MaxRange == "")
                result.ValidationErrors.push({ ErrorMessage: " بیشترین مقدار را وارد نمایید." });
            if ($scope.dynamicField.Length == null || $scope.dynamicField.Length == "")
                result.ValidationErrors.push({ ErrorMessage: " طول را وارد نمایید." });
            if ($scope.dynamicField.FieldItemsTypeEditKey == null || $scope.dynamicField.FieldItemsTypeEditKey == "")
                result.ValidationErrors.push({ ErrorMessage: " ویرایش فیلد را انتخاب نمایید" });
            if ($scope.dynamicField.FieldKindsKey == null || $scope.dynamicField.FieldKindsKey == "")
                result.ValidationErrors.push({ ErrorMessage: " حالت فیلد را انتخاب نمایید" });
            if ($scope.dynamicField.FieldGroupKey == null || $scope.dynamicField.FieldGroupKey == "")
                result.ValidationErrors.push({ ErrorMessage: " گروه فیلد را انتخاب نمایید" });
            if ($scope.dynamicField.TypesCode == null || $scope.dynamicField.TypesCode == "")
                result.ValidationErrors.push({ ErrorMessage: " نوع فیلد را انتخاب نمایید" });

            if ($scope.dynamicField.TypesCode === 119) {
                if ($scope.dynamicField.StructureOtherTables == null || $scope.dynamicField.StructureOtherTables == "")
                    result.ValidationErrors.push({ ErrorMessage: " لطفا اطلاعات  ساختار دیگر جداول را وارد نمایید" });
            }

            if ($scope.dynamicField.TypesCode === 109 || $scope.dynamicField.TypesCode === 110 || $scope.dynamicField.TypesCode === 123) {
                if ($scope.dynamicField.ItemGroupKey == null || $scope.dynamicField.ItemGroupKey == "")
                    result.ValidationErrors.push({ ErrorMessage: " گروه آیتم را انتخاب نمایید" });
            }

            //-------------------------------------------------------------------------------------------------------------           
            if (result.ValidationErrors.length > 0) {
                errorHandler.ShowError(result);
                return false;
            }
            else
                return true;
        }

        //***************************************************** Insert & Update *********************************************************
        createData = function (newData) {
            $scope.dynamicField.TablesKey = $scope.cacheDynamicEntity.DynamicEntityKey;
            return remoteService.post(newData, WebAccess + "api/DynamicFields/CraeteDynamicFields");
        }

        updateData = function (newData) {
            return remoteService.post(newData, WebAccess + "api/DynamicFields/UpdateDynamicFeild");
        }

        //************************** Do Apply ********************************            
        $scope.doApplay = function () {
            var defferd = $q.defer();
            if ($scope.ValidationDataFrom()) {
                //insert
                if ($scope.formOperationState === pnenum.pnformstate.insert) {
                    createData($scope.dynamicField).then(function (result) {
                        var notifyP = { message: pnMessage.common.successfullInsert, title: pnMessage.common.insert };
                        var resultStatus = resultHandler(result, notifyP);
                        defferd.resolve(resultStatus);
                        $scope.initializeForm();
                        enableGrid();
                        reloadGrid();
                    });
                }
                    //Update
                else if ($scope.formOperationState === pnenum.pnformstate.update) {
                    updateData($scope.dynamicField).then(function (result) {
                        var notifyP = { message: pnMessage.common.SuccessfullUpdate, title: pnMessage.common.update };
                        var resultStatus = resultHandler(result, notifyP);
                        defferd.resolve(resultStatus);
                        $scope.initializeForm();
                        enableGrid();
                        reloadGrid();
                    });
                }
            }
            else {
                defferd.resolve(false);
            }
            return defferd.promise;
        };

        //*********************  تغییرات نوع فیلد ***************************
        $scope.changeFieldTypes = function () {
            if ($scope.dynamicField.TypesCode === 119) {
                $scope.hideOtherTablesSturctureBtn = false;
                $scope.disableItemGroup = true;
            }
            if ($scope.dynamicField.TypesCode === 109 ||
                $scope.dynamicField.TypesCode === 110 ||
                $scope.dynamicField.TypesCode === 123) {
                $scope.hideOtherTablesSturctureBtn = true;
                $scope.disableItemGroup = false;
            }
            if ($scope.dynamicField.TypesCode !== 109 &&
                $scope.dynamicField.TypesCode !== 110 &&
                $scope.dynamicField.TypesCode !== 123 &&
                $scope.dynamicField.TypesCode !== 119) {
                $scope.hideOtherTablesSturctureBtn = true;
                $scope.disableItemGroup = true;
            }
        };

        //****************** آماده سازی فرم برای ایجاد *********************
        $scope.prepareFormForInsert = function () {
            $scope.formOperationState = pnenum.pnformstate.insert;
            $scope.initializeCreateForm();
            getFieldGroup();
            $scope.disableTableGroup = true;
            $scope.disableCreateForm = false;
            $scope.disableItemGroup = true;
            disableGrid();
            focus.setFocus('dynamicField.FieldCode');
        };

        //******************* درج ساختار سایر جداول ************************
        $scope.doInsertOtherTablesStructure = function () {
            structureTableService.addJson($scope.dynamicField.StructureOtherTables);
            dialog.show("/app/areas/inf/views/dynamicEntity/InsertStructureOtherTablesView.html",
                        'InsertStructureOtherTablesController', "توجه", "", "تایید", "انصراف", false).then(function (result) {
                            if (result.dialogResult)
                                $scope.dynamicField.StructureOtherTables = angular.toJson(result.data);
                            return result;
                        });
        };

        //***************** آماده سازی فرم برای ویرایش *********************
        $scope.prepareFormForEdit = function () {
            $scope.formOperationState = pnenum.pnformstate.update;
            $scope.disableTableGroup = true;
            $scope.disableCreateForm = false;
            $scope.disableItemGroup = true;
            disableGrid();
            $scope.changeFieldTypes();
            focus.setFocus('dynamicField.FieldCode');
        }

        //********************* نمایش اطلاعات از گرید************************
        $scope.showGridSelectedRowInForm = function (entity) {

            $scope.dynamicField.FieldCode = entity.FieldCode;
            $scope.dynamicField.MinRange = entity.MinRange;
            $scope.dynamicField.ModifyVersion = entity.ModifyVersion;
            $scope.dynamicField.LatinName = entity.LatinName;
            $scope.dynamicField.MaxRange = entity.MaxRange;
            $scope.dynamicField.IsPrimaryKey = entity.IsPrimaryKey;
            $scope.dynamicField.FieldAlias = entity.FieldAlias;
            $scope.dynamicField.Length = entity.Length;
            $scope.dynamicField.IsIdentity = entity.IsIdentity;
            $scope.dynamicField.PersianName = entity.PersianName;
            $scope.dynamicField.FieldItemsTypeEditKey = entity.FieldItemsTypeEditKey;
            $scope.dynamicField.Sys5FieldGroup = entity.Sys5FieldGroup;
            $scope.dynamicField.FieldKindsKey = entity.FieldKindsKey;
            $scope.dynamicField.IsEmpty = entity.IsEmpty;
            $scope.dynamicField.TypesCode = entity.TypesCode;
            $scope.dynamicField.ItemGroupKey = entity.ItemGroupKey;
            $scope.dynamicField.IsYes = entity.IsYes;
            $scope.dynamicField.FieldGroupKey = entity.FieldGroupKey;
            $scope.dynamicField.IsRepeated = entity.IsRepeated;
            $scope.dynamicField.StructureOtherTables = entity.StructureOtherTables;
            $scope.dynamicField.FieldOrder = entity.FieldOrder;
            $scope.dynamicField.TablesKey = $scope.cacheDynamicEntity.DynamicEntityKey;
            $scope.dynamicField.FieldsKey = entity.FieldsKey;
            $scope.dynamicField.IsSys = entity.IsSys;

        }

        ////Calling Functions
        getFieldSqlType();
        getTableTypeEdit();
        getItemGroup();
        getFieldKinds();
        getFieldGroup();
        $scope.initializeForm();

        //****************انتخاب اولین سطر بطور پیش فرض*********************
        $scope.DynamicFieldGrid_onDataBound = function (kendo) {
            kendo.select(kendo.tbody.find('tr:first'));
        }
        //****************************gridConfig******************************          
        $scope.gridConfig = {
            inlineOperationalUrl: {
                read: {
                    url: WebAccess + "api/DynamicFields/GetDynamicFields",
                    data: { Key: $scope.cacheDynamicEntity.DynamicEntityKey }
                }
            }
        };
        //****************************gridColumns*****************************
        $scope.gridColumns = [
              {
                  field: 'FieldOrder',
                  editable: false,
                  title: "ردیف ",
                  allownull: false,
                  width: 90
              },
            {
                field: 'LatinName',
                editable: false,
                title: "شرح لاتین",
                allownull: false,
                width: 130,
                attributes: { style: "text-align:left" }
            },
            {
                field: 'PersianName',
                editable: false,
                title: "شرح فارسی",
                allownull: false,
                width: 130
            },
              {
                  field: 'FieldCode',
                  editable: false,
                  title: "کد ",
                  allownull: false,
                  width: 90,
                  attributes: { style: "text-align:Center" }
              },
            {
                field: 'FieldAlias',
                editable: false,
                title: "شرح مستعار",
                allownull: false,
                width: 130
            },
            {
                field: 'IsPrimaryKey',
                editable: false,
                title: "کلید ",
                allownull: false,
                width: 100,
                attributes: { style: "text-align:Center" },
                template: '<input type="checkbox" ng-checked=\"this.dataItem.IsPrimaryKey\" ng-disabled="true" />'
            },
             {
                 field: 'IsIdentity',
                 editable: false,
                 title: "شماره اتوماتیک ",
                 allownull: false,
                 width: 100,
                 attributes: { style: "text-align:Center" },
                 template: '<input type="checkbox" ng-checked=\"this.dataItem.IsIdentity\" ng-disabled="true" />'
             },
                {
                    field: 'IsSys',
                    editable: false,
                    title: "سیستمی  ",
                    allownull: false,
                    width: 100,
                    attributes: { style: "text-align:Center" },
                    template: '<input type="checkbox" ng-checked=\"this.dataItem.IsSys\" ng-disabled="true" />'
                },

               {
                   field: 'TypesTitle',
                   editable: false,
                   title: "نوع فیلد ",
                   allownull: false,
                   width: 90
               },
                 {
                     field: 'Sys5FieldGroup',
                     editable: false,
                     title: "شرح گروه فیلد",
                     allownull: false,
                     width: 130
                 },
               {
                   field: 'FieldGroupDesc',
                   editable: false,
                   title: "گروه فیلد ",
                   allownull: false,
                   width: 90
               },
                 {
                     field: 'Length',
                     editable: false,
                     title: "طول ",
                     allownull: false,
                     width: 90,
                     attributes: { style: "text-align:Center" }
                 },


               {
                   field: 'MinRange',
                   editable: false,
                   title: "کمترین ",
                   allownull: false,
                   width: 100
               },
                {
                    field: 'MaxRange',
                    editable: false,
                    title: "بیشترین ",
                    allownull: false,
                    width: 100
                },
            {
                field: 'IsRepeated',
                editable: false,
                title: "تکراری پذیری",
                allownull: false,
                width: 130,
                attributes: { style: "text-align:Center" },
                template: '<input type="checkbox" ng-checked=\"this.dataItem.IsRepeated\" ng-disabled="true" />'
            },
            {
                field: 'IsEmpty',
                editable: false,
                title: "خالی",
                allownull: false,
                width: 130,
                attributes: { style: "text-align:Center" },
                template: '<input type="checkbox" ng-checked=\"this.dataItem.IsEmpty\" ng-disabled="true" />'
            },
            {
                field: 'FieldKindsDesc',
                editable: false,
                title: "حالت فیلد",
                allownull: false,
                width: 130
            },
            {
                field: 'ItemGroupDesc',
                editable: false,
                title: "گروه آیتم ها",
                allownull: false,
                width: 130
            },
                 {
                     field: 'ModifyVersion',
                     editable: false,
                     title: " ورژن",
                     allownull: false,
                     width: 130,
                     attributes: { style: "text-align:Center" },
                     template: '<input type="checkbox" ng-checked=\"this.dataItem.ModifyVersion\" ng-disabled="true" />'
                 },
              {
                  field: 'FieldItemsTypeEdit',
                  editable: false,
                  title: "نوع ویرایش جدول",
                  allownull: false,
                  width: 100
              },
               {
                   field: 'IsYes',
                   editable: false,
                   title: "IsYes",
                   allownull: false,
                   width: 130,
                   attributes: { style: "text-align:Center" },
                   template: '<input type="checkbox" ng-checked=\"this.dataItem.IsYes\" ng-disabled="true" />'
               },
                {
                    field: 'StructureOtherTables',
                    editable: false,
                    title: "ساختار دیگر جداول ",
                    allownull: false,
                    width: 90
                }
        ];
        //****************************gridSchema******************************
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
            total: 'TotalCount'
        };
        //**************************** watch *********************************
        $scope.$watch('selectedItems', function (newVal, oldVal) {
            if ($scope.selectedItems.length <= 0)
                return;
            $scope.showGridSelectedRowInForm($scope.selectedItems[0]);
        });
        //**The End**
    }]);
});

