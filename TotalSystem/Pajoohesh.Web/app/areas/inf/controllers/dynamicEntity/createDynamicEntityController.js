define(["areas/inf/app.areas.inf"], function (inf) {
    inf.register.controller("createDynamicEntityController", ["$rootScope", "$scope", "pn.remote.service", "pn.enum", "pn.dialog", "pn.focus",
    "Notification", "infWebAccess", "cache", "$state", "pn.errorHandler", "pn.validator", "$q", "pn.message", "cache",
        function ($rootScope, $scope, remoteService, pnenum, dialog, focus, notify, WebAccess, cache, $state, errorHandler, validator, $q, pnMessage) {

            //  If State Changed 
            var isDoInsertClicked = false;
            $rootScope.selectedItemDynamicEntity = false;
            //  disable Grid
            var disableGrid = function () {
                $scope.gridApi.setActive(false);
            }
            //  reload Grid
            var reloadGrid = function () {
                $scope.gridApi.refresh();
            }
            //  enableGrid
            var enableGrid = function () {
                if ($scope.gridApi)
                    $scope.gridApi.setActive(true);
            }
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

            //****************************************************
            cache.dynamicEntity = cache.dynamicEntity || {};
            $scope.dynamicEntity = {};

            // ***************Initilize Form *********************
            $scope.initializeForm = function () {

                $scope.dynamicEntity.ParentKey = null;
                $scope.dynamicEntity.SystemKey = null;
                $scope.dynamicEntity.TableGroupKey = null;
                $scope.dynamicEntity.VersionInfo = null;
                $scope.dynamicEntity.FieldItemsTypeEditKey = null;
                $scope.dynamicEntity.TypesCode = null;
                $scope.dynamicEntity.FieldItemsTypeOfBranchesKey = null;
                $scope.dynamicEntity.Code = "";
                $scope.dynamicEntity.TableOrder = "";
                $scope.dynamicEntity.FieldItemOrder = null;
                $scope.dynamicEntity.EnglishName = "";
                $scope.dynamicEntity.PersianName = "";
                $scope.dynamicEntity.DynamicEntityKey = null;
                $scope.dynamicEntity.IsDistributed = false;
                $scope.dynamicEntity.IsSys = false;
                $scope.dynamicEntity.GroupNameDescription = "";
                $scope.formOperationState = pnenum.pnformstate.browse;
                $scope.disableTableGroup = false;
                $scope.disableEntityForm = true;
                $scope.disableTableTree = true;
                isDoInsertClicked = false;

            }

            //*************** Initilize Create Form **************
            $scope.initializeCreateForm = function () {

                $scope.dynamicEntity.ParentKey = null;
                $scope.dynamicEntity.SystemKey = null;
                $scope.dynamicEntity.TableGroupKey = null;
                $scope.dynamicEntity.VersionInfo = null;
                $scope.dynamicEntity.FieldItemsTypeEditKey = null;
                $scope.dynamicEntity.TypesCode = null;
                $scope.dynamicEntity.FieldItemsTypeOfBranchesKey = null;
                $scope.dynamicEntity.Code = "";
                $scope.dynamicEntity.TableOrder = "";
                $scope.dynamicEntity.FieldItemOrder = null;
                $scope.dynamicEntity.EnglishName = "";
                $scope.dynamicEntity.PersianName = "";
                $scope.dynamicEntity.DynamicEntityKey = null;
                $scope.dynamicEntity.IsDistributed = false;
                $scope.dynamicEntity.IsSys = false;
                $scope.dynamicEntity.GroupNameDescription = "";
                disableGrid();
            }

            //************** نوع ویرایش جدول*********************
            var getTableTypeEdit = function () {
                remoteService.post(null, WebAccess + "api/ItemGroup/GetItemGroupForTableTypeItems").then(function (loadDataResult) {
                    $scope.TableTypeEdit = loadDataResult.Entities[0].FieldItems;
                });
            }

            //********************* نوع ورژن*********************
            var getVersionInformationIs = function () {
                remoteService.post(null, WebAccess + "api/ItemGroup/GetItemGroupForVersionInformationIs").then(function (loadDataResult) {
                    $scope.VersionInformationIs = loadDataResult.Entities[0].FieldItems;
                });
            }

            //********************* نوع جدول*********************
            var getTableSqlType = function () {
                remoteService.post(null, WebAccess + "api/Types/GetTableSqlTypeDynamicEntity").then(function (loadDataResult) {
                    $scope.dynamicEntity.Types = '0';
                    $scope.TableSqlType = loadDataResult.Entities;
                });
            }

            //******************* نوع ساختار جدول****************
            var getTableSructure = function () {
                remoteService.post(null, WebAccess + "api/ItemGroup/GetItemGroupForTableSructure").then(function (loadDataResult) {
                    $scope.TableSructure = loadDataResult.Entities[0].FieldItems;
                });
            }

            //******************* سطح عملیات*********************
            var getTypeOfBranches = function () {
                remoteService.post(null, WebAccess + "api/ItemGroup/GetItemGroupForTypeOfBranches").then(function (loadDataResult) {
                    $scope.TypeOfBranches = loadDataResult.Entities[0].FieldItems;
                });
            }

            // *****************Systems ComboBox *****************
            $scope.getSystems = function () {
                remoteService.post(null, WebAccess + "api/System/GetMainSystems").then(function (loadDataResult) {
                    $scope.systemNames = loadDataResult.Entities;
                });
            }

            // ****************Sub Systems ComboBox **************
            $scope.getSubSystemsByParentId = function () {
                var selectedSubSystem = { ParentId: $scope.dynamicEntity.ParentKey };
                if ($scope.dynamicEntity.ParentKey != null) {
                    remoteService.post(selectedSubSystem, WebAccess + "api/System/GetActiveSubSystemsByParentId").then(function (loadDataResult) {
                        $scope.subSystemNames = loadDataResult.Entities;
                    });
                }
            }

            // ****************Table Group ComboBox **************
            $scope.getTableGroupByParentId = function () {
            
                var selectedTableGroup = { SystemId: $scope.dynamicEntity.SystemKey }
                if ($scope.dynamicEntity.SystemKey != null) {
                    remoteService.post(selectedTableGroup, WebAccess + "api/TableGroup/GetAllTableGroupBySubSystemId").then(function (loadDataResult) {
                        //-----------حذف گزینه ی همه جداول-----------
                        if (!isDoInsertClicked)
                            $scope.tableGroupNames = loadDataResult.Entities;
                        else
                            $scope.tableGroupNames = loadDataResult.Entities.slice(1);
                    });
                }
            }

            //***************************************** بارگذاری گرید بر اساس انتخاب سیستم ها *****************************************************
            $scope.gridkendo = null;
            $scope.onReadyGrid = function (kendo) {
                $scope.gridkendo = kendo;
            };

            //********* watch ***********
            $scope.$watch('dynamicEntity.TableGroupKey', function (newVal, oldVal) {
            
                if (!isDoInsertClicked) {
                    var option = $scope.gridkendo.getOptions();

                    option.dataSource.transport.read.data = { Key: "", };
                    option.dataSource.transport.read.data = { Key: $scope.dynamicEntity.TableGroupKey, SystemKey: $scope.dynamicEntity.SystemKey };
                    option.dataSource.transport.read.url = WebAccess + "api/DynamicEntity/GetDynamicEntities";
                    $scope.gridkendo.setOptions(option);
                }
            });

            //**********************************************************خالی کردن گرید**************************************************************
            $scope.GridSetClear = function () {
                var option = $scope.gridkendo.getOptions();
                option.dataSource.transport.read.data = { Key: "", };
                $scope.gridkendo.setOptions(option);
            };

            //************************************************************* Write Data **************************************************************
            function GetDataForm() {
                for (var i = 0; i < $scope.TableSructure.length; i++) {
                    if ($scope.TableSructure[i].Order == $scope.dynamicEntity.FieldItemOrder) {
                        $scope.dynamicEntity.FieldItemsKindKey = $scope.TableSructure[i].FieldItemId;
                    }
                }
            }

            //**********************************************************اعتبار سنجی اطلاعات**********************************************************
            $scope.ValidationDataFrom = function () {
                var result = {
                    ErrorMessage: null,
                    ValidationErrors: []
                };
                if ($scope.createForm.$valid == false)
                    var result = validator.Validate($scope.createForm);

                if ($scope.dynamicEntity.TableGroupKey == null || $scope.dynamicEntity.TableGroupKey == "")
                    result.ValidationErrors.push({ ErrorMessage: "  انتخاب گروه جدول الزامیست" });

                if ($scope.dynamicEntity.Code == null || $scope.dynamicEntity.Code == "")
                    result.ValidationErrors.push({ ErrorMessage: " کد خالی است" });
                if ($scope.dynamicEntity.TableOrder == null || $scope.dynamicEntity.TableOrder == "")
                    result.ValidationErrors.push({ ErrorMessage: "  ردیف نمی تواند خالی باشد" });
                if ($scope.dynamicEntity.EnglishName == null || $scope.dynamicEntity.EnglishName == "")
                    result.ValidationErrors.push({ ErrorMessage: "  نام لاتین نمیتواند خالی باشد" });
                if ($scope.dynamicEntity.PersianName == null || $scope.dynamicEntity.PersianName == "")
                    result.ValidationErrors.push({ ErrorMessage: "  نام فارسی نمی تواند خالی باشد" });
                if ($scope.dynamicEntity.GroupNameDescription == null || $scope.dynamicEntity.GroupNameDescription == "")
                    result.ValidationErrors.push({ ErrorMessage: "  شرح گروه نمایش نمی تواند خالی باشد" });
                if ($scope.dynamicEntity.VersionInfo == null || $scope.dynamicEntity.VersionInfo == "")
                    result.ValidationErrors.push({ ErrorMessage: "  نوع ورژن انتخاب نشده است" });
                if ($scope.dynamicEntity.FieldItemsTypeEditKey == null || $scope.dynamicEntity.FieldItemsTypeEditKey == "")
                    result.ValidationErrors.push({ ErrorMessage: "  نوع ویرایش جداول انتخاب نشده است" });
                if ($scope.dynamicEntity.TypesCode == null || $scope.dynamicEntity.TypesCode == "")
                    result.ValidationErrors.push({ ErrorMessage: "  نوع جدول انتخاب نشده است" });
                if ($scope.dynamicEntity.FieldItemOrder == null || $scope.dynamicEntity.FieldItemOrder == "")
                    result.ValidationErrors.push({ ErrorMessage: "  نوع ساختار جداول انتخاب نشده است" });
                //-------------------------------------------------------------------------------------------------------------
                if ($scope.dynamicEntity.FieldItemOrder == "2") {
                    if ($scope.TypeOfBranches === null || $scope.TypeOfBranches === "")
                        result.ValidationErrors.push({ ErrorMessage: "سطح عملیات انتخاب نشده است" });

                    if ($scope.dynamicEntity.Treestructure == null || $scope.dynamicEntity.Treestructure == "")
                        result.ValidationErrors.push({ ErrorMessage: " ساختار درختی خالیست" });
                }
                //-------------------------------------------------------------------------------------------------------------
                if (result.ValidationErrors.length > 0) {
                    errorHandler.ShowError(result);
                    return false;
                }
                else
                    return true;
            }
            //*********************************************************** Insert & Update ******************************************************************
            createData = function (newData) {
                return remoteService.post(newData, WebAccess + "api/DynamicEntity/CreateDynamicEntity");
            }

            updateData = function (newData) {
                return remoteService.post(newData, WebAccess + "api/DynamicEntity/UpdateDynamicEntity");
            }

            //*********************************************************Standrad From Events**************************************************************
            //*********** تایید ************
            $scope.doApplay = function () {
                var defferd = $q.defer();
                GetDataForm();
                if ($scope.ValidationDataFrom()) {
                    //insert
                    if ($scope.formOperationState === pnenum.pnformstate.insert) {
                        createData($scope.dynamicEntity).then(function (result) {
                            var notifyP = { message: pnMessage.common.successfullInsert, title: pnMessage.common.insert };
                            var resultStatus = resultHandler(result, notifyP);
                            defferd.resolve(resultStatus);
                            $scope.initializeForm();
                            $scope.GridSetClear();
                            enableGrid();
                        });
                    }
                        //Update
                    else if ($scope.formOperationState === pnenum.pnformstate.update) {
                        updateData($scope.dynamicEntity).then(function (result) {
                            var notifyP = { message: pnMessage.common.SuccessfullUpdate, title: pnMessage.common.update };
                            var resultStatus = resultHandler(result, notifyP);
                            defferd.resolve(resultStatus);
                            $scope.initializeForm();
                            $scope.GridSetClear();
                            enableGrid();
                        });
                    }
                }
                else {
                    defferd.resolve(false);
                }
                return defferd.promise;
            };

            //********** ایجاد *******
            $scope.doInsert = function () {        
                isDoInsertClicked = true;
                if ($scope.dynamicEntity.ParentKey != 0) {
                    $scope.prepareFormForInsert();
                    return true;
                }
                else {
                    dialog.showMessage("خطا", "لطفا سیستم ها را انتخاب نمایید");
                    focus.setFocus('dynamicEntity.ParentKey');
                    return false;
                }
            }

            //***************** حذف ***********************
            $scope.doDelete = function () {
                if ($scope.dynamicEntity.DynamicEntityKey != null && $scope.dynamicEntity.IsSys == false) {
                    $scope.delete();
                    return true;
                }
                else {
                    dialog.showMessage("خطا", "رکورد مناسبی برای حذف انتخاب نشده است");
                    return false;
                }
            }

            //***************** ویرایش ********************
            $scope.doEdit = function () {
                isDoInsertClicked = true;
                if ($scope.dynamicEntity.DynamicEntityKey != null) {
                    $scope.prepareFormForEdit();
                    focus.setFocus("dynamicEntity.Code");
                    return true;
                }

                else {
                    dialog.showMessage("خطا", "رکوردی مناسبی برای ویرایش انتخاب نشده است");
                    return false;
                }
            }

            //***************** انصراف ********************
            $scope.doCancel = function () {
                $scope.initializeCreateForm();
                $scope.GridSetClear();
                $scope.disableEntityForm = true;
                $scope.disableTableGroup = false;
                isDoInsertClicked = false;
                $scope.TreeSturcture();
                return true;
            }

            //******************Delete**********************
            $scope.delete = function () {
                dialog.showYesNo("توجه", "آیا مطمئن به حذف اطلاعات هستید ؟", "بله", "خیر").then(function (resultConfrim) {
                    if (resultConfrim == null) { return; }
                    else if (resultConfrim == true) {
                        remoteService.post($scope.dynamicEntity, WebAccess + "api/DynamicEntity/DeleteDynamicEntity").then(function (result) {
                            if (result.Success) {
                                notify.success({ message: 'اطلاعات با موفقیت حذف شد', title: ' حذف اطلاعات' });
                                reloadGrid();
                                $scope.initializeForm();
                            }
                            else { $scope.ShowError(result); }
                        });
                    }
                });
            };

            //************** آماده سازی فرم برای ایجاد *****************
            $scope.prepareFormForInsert = function () {
                $scope.formOperationState = pnenum.pnformstate.insert;
                $scope.initializeCreateForm();
                $scope.disableTableGroup = false;
                $scope.disableEntityForm = false;
                $scope.disableTableTree = true;
                disableGrid();
                focus.setFocus('systemSelectedItemId');
            }

            //*************** در صورت ساختار درختی **********************
            $scope.TreeSturcture = function () {
                if ($scope.dynamicEntity.FieldItemOrder == 2) {
                    $scope.disableTableTree = false;
                } else {
                    $scope.disableTableTree = true;
                }
            }

            //***************** درج ساختار درختی*************************
            $scope.doInsertTreeStructure = function () {

                dialog.show("/app/areas/inf/views/dynamicEntity/InsertTreeStructureView.html",
                            'InsertTreeStructureController',
                "توجه", "", "تایید", "انصراف", false).then(function (result) {
                    if (result.dialogResult) {
                        $scope.dynamicEntity.Treestructure = JSON.stringify(result.data);
                    }
                    return result;
                });
            };

            //**************** آماده سازی فرم برای ویرایش **************
            $scope.prepareFormForEdit = function () {
                $scope.formOperationState = pnenum.pnformstate.update;
                $scope.disableTableGroup = true;
                $scope.disableEntityForm = false;
                $scope.disableTableTree = true;
                disableGrid();
                $scope.TreeSturcture();
                focus.setFocus('dynamicEntity.Code');
            }

            //******************دریافت اطلاعات از گرید*******************
            $scope.showGridSelectedRowInForm = function (entity) {
              
                $scope.dynamicEntity.DynamicEntityKey = entity.DynamicEntityKey;

                $scope.dynamicEntity.Code = entity.Code;
                $scope.dynamicEntity.TableOrder = entity.TableOrder;
                $scope.dynamicEntity.EnglishName = entity.EnglishName;
                $scope.dynamicEntity.PersianName = entity.PersianName;
                $scope.dynamicEntity.IsDistributed = entity.IsDistributed;
                $scope.dynamicEntity.IsSys = entity.IsSys;
                $scope.dynamicEntity.GroupNameDescription = entity.GroupNameDescription;

                $scope.dynamicEntity.FieldItemsTypeOfBranchesKey = entity.FieldItemsTypeOfBranchesKey;
                $scope.dynamicEntity.Treestructure = entity.Treestructure;

                $scope.dynamicEntity.VersionInfo = entity.VersionInfo;
                $scope.dynamicEntity.FieldItemsTypeEditKey = entity.FieldItemsTypeEditKey;
                $scope.dynamicEntity.FieldItemOrder = entity.FieldItemOrder;
                $scope.dynamicEntity.TypesCode = entity.TypesCode;
                $rootScope.selectedItemDynamicEntity = true;

            }

            //Show data at ComboBoxs
            $scope.getSystems();
            $scope.getSubSystemsByParentId();
            $scope.getTableGroupByParentId();
            $scope.initializeForm();
            getVersionInformationIs();
            getTableSructure();
            getTableTypeEdit();
            getTableSqlType();
            getTypeOfBranches();

            //انتخاب اولین سطر بطور پیش فرض
            $scope.DynamicEntityGrid_onDataBound = function (kendo) {
              
                kendo.select(kendo.tbody.find('tr:first'));
                if (kendo.dataSource.data().length>0) {
                    $rootScope.selectedItemDynamicEntity = true;
                }
            }

            //*********************gridConfig************************    
            $scope.selectedItems = [];
            $scope.gridConfig = {
                inlineOperationalUrl: {
                    read: {
                        url: "",
                        data: function () {
                            return $scope.filterQuery;
                        }
                    }
                }
            };

            //********** grid Columns *************
            $scope.gridColumns = [
                     {
                         field: 'TableOrder',
                         editable: false,
                         title: "ردیف ",
                         allownull: false,
                         width: 90
                     },
                     {
                         field: 'EnglishName',
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
                         field: 'Code',
                         editable: false,
                         title: "کد ",
                         allownull: false,
                         attributes: { style: "text-align:Center" },
                         width: 90
                     },
                     {
                         field: 'IsSys',
                         editable: false,
                         title: "سیستمی ",
                         allownull: false,
                         width: 100,
                         attributes: { style: "text-align:Center" },
                         template: '<input type=\"checkbox\" ng-checked=\"this.dataItem.IsSys\"  ng-disabled="true"/>',
                     },
                     {
                         field: 'IsDistributed',
                         editable: false,
                         title: "توزیع شده ",
                         allownull: false,
                         width: 110,
                         attributes: { style: "text-align:Center" },
                         template: '<input type="checkbox" ng-checked=\"this.dataItem.IsDistributed\" ng-disabled="true" />'
                     },
                     {
                         field: 'GroupNameDescription',
                         editable: false,
                         title: " شرح گروه نمایش",
                         allownull: false,
                         width: 130
                     },
                     {
                         field: 'TableGroup',
                         editable: false,
                         title: "گروه جدول ",
                         allownull: false,
                         width: 100

                     },
                     {
                         field: 'FieldItemsKind',
                         editable: false,
                         title: "نوع ساختار جدول",
                         allownull: false,
                         width: 100
                     },
                     {
                         field: 'FieldItemsTypeEdit',
                         editable: false,
                         title: "نوع ویرایش جدول",
                         allownull: false,
                         width: 100
                     },
                     {
                         field: 'StrVersionInfo',
                         editable: false,
                         title: "نوع ورژن",
                         allownull: false,
                         width: 100
                     },
                     {
                         field: 'TypesTitle',
                         editable: false,
                         title: "نوع جدول",
                         allownull: false,
                         width: 100,
                         attributes: { style: "text-align:left" }
                     },
                     {
                         field: 'FieldItemsTypeOfBranches',
                         editable: false,
                         title: "سطح عملیات",
                         allownull: false,
                         width: 100
                     },
                     {
                         field: 'Treestructure',
                         editable: false,
                         title: "ساختار جداول درختی",
                         allownull: false,
                         width: 100
                     }
            ];

            //*********** grid Schema *************
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

            //************** watch ****************
            $scope.$watch('selectedItems', function (newVal, oldVal) {
                if ($scope.selectedItems.length <= 0)
                    return;

                $scope.showGridSelectedRowInForm($scope.selectedItems[0]);
                cache.dynamicEntity = $scope.selectedItems[0];
            });

            //******** END ***********

        }]);
});
