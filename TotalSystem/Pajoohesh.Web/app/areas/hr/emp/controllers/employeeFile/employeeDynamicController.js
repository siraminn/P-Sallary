define(["areas/hr/emp/app.areas.hr.emp"], function (emp) {

    emp.register.controller("employeeDynamicController",

        ["$scope", "pn.remote.service", "pn.dialog",
        "pn.enum", "Notification", "$rootScope", "empWebAccess", "cache", "$state", "pn.errorHandler","$q", 
        function ($scope, remoteService, dialog, pnenum,notify, $rootScope, empWebAccess, cache, $state, errorHandler,$q) 
        
        {
        
            var currentForm = $state.current.data;
            var currentName = $state.current.name;

            $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                    if (currentName === toState.name) {
                        event.preventDefault();
                        init();
                    }
                }
            );


            function init() {
               
               
                if (cache.empCache.person.EMPT1_Employees_Pkey == null) {
                     notify.error({
                            message: 'لطفا یک شخص را برای نمایش اطلاعات انتخاب کنبد', title: 'خطا'
                        });
                    //$state.go('home.tab.createEmployeeFile.personelInfo');
                }
                 else {
                    if (!$scope.options) {
                        $scope.options = {
                            metaDataUri: empWebAccess + 'api/EmpCommonServices/GettingStructureTable?id=' + currentForm + '-1,2,3'
                        }
                    }

                    if ($scope.entityViwerApi == null)
                        return;

                    if (!$scope.gridOptions) {
                        var i = 0; cnt = $scope.entityViwerApi.getFieldsCount();
                        $scope.gridOptions = $scope.kendo.getOptions();
                        $scope.gridOptions.columns = [];
                        $scope.col = [];
                        var template = function (field) {
                            return function (dataItem) {
                                var label = field.items.filter(function (item) { return item.Key == dataItem[field.latinName] })
                                if (label.length == 1)
                                    return kendo.htmlEncode(label[0].Value);
                                return "";
                            }
                        }
                        for (i = 0; i, i < cnt; i++) {
                            var field = $scope.entityViwerApi.getField(i)
                            var col = {
                                field: field.latinName,
                                title: field.persianName
                            };
                            if (field.isPrimarykey || field.isIdentity || field.isForiegnKey) {
                                col.hidden = true
                            }
                            if (field.typeKey == 109) {
                                col.template = template(field);
                            }
                            if (field.typeKey == 124) {
                                //col.template = miladiToJalaliTemplate(field);
                            }
                            $scope.gridOptions.columns.push(col);
                            $scope.col.push(field.latinName);
                        }
                        $scope.gridOptions.autoBind = true;
                        $scope.kendo.setOptions($scope.gridOptions);
                    }
                }

                
                if (!$scope.lastEMPT1_Employees_Pkey || $scope.lastEMPT1_Employees_Pkey !== cache.empCache.person.EMPT1_Employees_Pkey) {
                    $scope.lastEMPT1_Employees_Pkey = cache.empCache.person.EMPT1_Employees_Pkey;
                    reloadGrid();
                }
                
            }

            init();;


            $scope.empCache = cache.empCache;
            $scope.$watch('empCache.DynamicTable', function () {
                if ($scope.empCache.DynamicTable == null || $scope.empCache.DynamicTable.length <= 0)
                    return;
                var formTitle = $scope.empCache.DynamicTable.filter(function (x) { return x.LatinName == currentForm });
                $scope.enityViewerTitle = formTitle[0].PersianName;
                if (formTitle[0].TypesCode == 401) {
                    disableActionButtons();
                }
            });



            function enableGrid() {
                if ($scope.gridApi)
                    $scope.gridApi.setActive(true);
            }
            function disableGrid() {
                if ($scope.gridApi)
                    $scope.gridApi.setActive(false);
            }
            function reloadGrid() {
                if ($scope.gridApi)
                    $scope.gridApi.refresh();
            };


            // Standrad From Events
            $scope.doDelete = function () {
                $scope.delete();
                return true;
            }
            $scope.doEdit = function () {
                
                if (scope.selectedItems == null) {
                    dialog.showMessage("خطا", "رکوردی برای ویرایش انتخاب نشده است");
                    return;
                }

                $scope.entityViwerApi.enable();
                disableGrid();
                $scope.formOperationState = pnenum.pnformstate.update;
                return true;
            }
            $scope.doCancel = function () {

                $scope.entityViwerApi.disable();
                 var a = {};
                $scope.entityViwerApi.load(a);
                return true;
            }

            $scope.doApplay = function () {

                var defferd = $q.defer();

                if ($scope.formOperationState === pnenum.pnformstate.insert ||
                    $scope.formOperationState === pnenum.pnformstate.update
                    || $scope.formOperationState === pnenum.pnformstate.deletee) {

                    if ($scope.formOperationState === pnenum.pnformstate.insert) {

                        var dynamicEntity = {};
                        $scope.entityViwerApi.getData(function (empDynamicData) {
                            dynamicEntity.Fields = empDynamicData;
                        });

                        dynamicEntity.Fields.EMPT1_Employees_Pkey = cache.empCache.person.EMPT1_Employees_Pkey;
                        dynamicEntity.Table = currentForm;
                        

                        remoteService.post(dynamicEntity, empWebAccess + "api/EmpOData/Create").then(function (result) {
                            if (result.Success) {
                                notify.success({
                                    message: 'اطلاعات سیستم با موفقیت ثبت شد', title: ' ثبت اطلاعات'
                                });
                                enableGrid();
                                reloadGrid();
                                $scope.entityViwerApi.disable();
                                defferd.resolve(true);

                            } else {

                                errorHandler.ShowError(result);
                                defferd.resolve(false);
                            }
                        });
                    }

                    if ($scope.formOperationState === pnenum.pnformstate.update) {
                        var dynamicEntity = {};
                        $scope.entityViwerApi.getData(function (empDynamicData) {
                            dynamicEntity = empDynamicData;
                        });

                        dynamicEntity.CurrentTableName = currentForm;
                        dynamicEntity.PrimaryKey = "key";
                        dynamicEntity.PrimaryKeyValue = "keyValue";
                        remoteService.post(dynamicEntity, empWebAccess + "api/OData/UpdateEntity").then(function (result) {
                            if (result.Success) {
                                notify.success({
                                    message: 'اطلاعات سیستم با موفقیت ثبت شد', title: ' ثبت اطلاعات'
                                });
                                $scope.initializeForm();
                                $scope.loadSystems();
                                enableGrid();
                                reloadGrid();
                                defferd.resolve(true);

                            } else {

                                errorHandler.ShowError(result);
                                defferd.resolve(false);

                            }
                        });

                    }
                } else {
                    dialog.showMessage("توجه", "عملیاتی برای ثبت یافت نشد");
                    defferd.resolve(true);
                }
                return defferd.promise;
            }
            $scope.doInsert = function () {
                $scope.formOperationState = pnenum.pnformstate.insert;
                $scope.entityViwerApi.enable();
                disableGrid();
                return true;
            };



            // Private CRUD Functions
            $scope.delete = function () {
                var dynamicEntity = {};
                dynamicEntity.CurrentTableName = currentForm;
                remoteService.post(dynamicEntity, empWebAccess + "api/OData/DeleteEntity").then(function (result) {
                    if (result.Success) {
                        notify.success({
                            message: 'اطلاعات سیستم با موفقیت حذف شد', title: ' ثبت اطلاعات'
                        });
                        $scope.initializeForm();
                        $scope.loadSystems();
                        enableGrid();
                        reloadGrid();

                    } else {

                        errorHandler.ShowError(result);
                    }

                    $scope.CreateSystem = null;

                });
            }
            $scope.showGridSelectedRowInForm = function (entity) {
                $rootScope.person = entity;
                $scope.entityViwerApi.load(entity);
            }
            
            // grid Config
            $scope.selectedItems = [];
            $scope.gridConfig = {
                autoBind: false,
                inlineOperationalUrl: {
                    read: {
                        url: empWebAccess + "api/EmpOData/Get/",
                        data: function () {
                            return {
                                table: currentForm,
                                fields: $scope.col,
                                filter: {
                                            Logic: "and",
                                            filters: [
                                                {
                                                    field: "EMPT1_Employees_Pkey",
                                                    Value: cache.empCache.person.EMPT1_Employees_Pkey,
                                                    operator: "eq",
                                                    dataType: 104,
                                                    ParameterName: "p25"
                                                }]
                                        }
                            }
                        }
                    }
                }
            };

            $scope.onKendoReady = function (kendo) {

                $scope.kendo = kendo;
            };

            $scope.onEnityViewerReady = function () {
                $scope.entityViwerApi.disable();
                var i = 0; cnt = $scope.entityViwerApi.getFieldsCount();
                $scope.gridOptions = $scope.kendo.getOptions();
                $scope.gridOptions.columns = [];
                $scope.col = [];

                var miladiToJalaliTemplate = function (field) {
                    return function (dataItem) {
                        var miladiString = dataItem[field.latinName];
                        if (miladiString && miladiString.length > 0) {
                            var miladi = new Date(miladiString);
                            var jalai = new JalaliDate(miladi.getTime());
                            dataItem[field.latinName] = jalai.toString();
                            return jalai.toDateString();
                        }
                        return ""
                    }
                }
                var Template = function (field) {
                    return function (dataItem) {
                        var label = field.items.filter(function (item) { return item.Key == dataItem[field.latinName] })
                        if (label.length == 1)
                            return kendo.htmlEncode(label[0].Value);
                        return "";
                    }
                }
                for (i = 0; i, i < cnt; i++) {
                    var field = $scope.entityViwerApi.getField(i)
                    var col = {
                        field: field.latinName,
                        width: "150px",
                        title: field.persianName
                    };

                    if (field.isPrimarykey || field.isIdentity || field.isForiegnKey) {
                        col.hidden = true
                    }

                    if (field.typeKey == 109) {
                        col.template = Template(field);
                    }

                    if (field.typeKey == 124) {

                        //col.template = miladiToJalaliTemplate(field);
                    }

                    $scope.gridOptions.columns.push(col);
                    $scope.col.push(field.latinName);
                }
                $scope.gridOptions.autoBind = true;
                $scope.kendo.setOptions($scope.gridOptions);
            }
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
            var disableActionButtons = function () {
                for (var i = 0; i < 4; i++) {
                    $rootScope.tabItems[15].toolbar[i].disabled = "disabled";
                }


            }

        }]);
});


