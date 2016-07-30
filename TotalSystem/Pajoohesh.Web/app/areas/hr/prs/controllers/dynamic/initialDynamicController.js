define(["areas/hr/prs/app.areas.hr.prs"], function (prs) {

    prs.register.controller("initialDynamicController",

        ["$scope", "pn.remote.service", "pn.dialog",
        "pn.enum", "Notification", "$rootScope", "empWebAccess", "cache", "$state", "pn.errorHandler","$q", 
        function ($scope, remoteService, dialog, pnenum,notify, $rootScope, empWebAccess, cache, $state, errorHandler,$q) 
        
        {
            /*
            define vaiables
            */
            cache.prsCache = cache.prsCache || {};
            var routePrefix = 'home.tab.basicTables';
            cache.prsCache = cache.prsCache || {};
            cache.prsCache.person = cache.prsCache.person || {};
            cache.prsCache.DynamicTable = cache.prsCache.DynamicTable || [];
            cache.prsCache.person.disablePersonBaseInfo = true;
            cache.prsCache.person.EMPT1_Employees_NationalOptions =
            cache.prsCache.person.EMPT1_Employees_NationalOptions || {
                kendoOptions: {}
            }

            $scope.prsCache = cache.prsCache;

            //if ($state.current && $state.current.name &&
            //    $state.current.name.indexOf('home.tab.createEmployeeFile2') === 0) {
            //    routePrefix = 'home.tab.createEmployeeFile2';
            //    cache.empCache2 = cache.empCache2 || {};
            //    cache.empCache2.person = cache.empCache2.person || {};
            //    cache.empCache2.DynamicTable = cache.empCache2.DynamicTable || [];
            //    cache.empCache2.person.disablePersonBaseInfo = true;
            //    cache.empCache2.person.EMPT1_Employees_NationalOptions = cache.empCache2.person.EMPT1_Employees_NationalOptions || {
            //        kendoOptions: {}
            //    }
            //    $scope.prsCache = cache.empCache2;
            //}


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
                //if (cache.prsCache.person.EMPT1_Employees_Pkey == null) {
                //     //notify.error({
                //     //       message: 'لطفا یک شخص را برای نمایش اطلاعات انتخاب کنبد', title: 'خطا'
                //     //   });
                //    // $state.go('home.tab.basicTables');
                //}
                //else {

                    if (!$scope.options) {
                        $scope.options = {
                            metaDataUri: empWebAccess + 'api/PRSCommonService/GettingStructureTable?id=' + currentForm + '-1,2,3'
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
               // }
                reloadGrid();
            }



            init();


            $scope.prsCache = cache.prsCache;
            $scope.$watch('prsCache.DynamicTable', function () {
                if ($scope.prsCache.DynamicTable == null || $scope.prsCache.DynamicTable.length <= 0)
                    return;
                var formTitle = $scope.prsCache.DynamicTable.filter(function (x) { return x.LatinName == currentForm });
                $scope.enityViewerTitle = formTitle[0].PersianName;
                if (formTitle[0].TypesCode == 401) {
                    disableActionButtons();
                }
            });



            function enableGrid() {
                console.log('enableGrid');
                if ($scope.gridApi)
                    $scope.gridApi.setActive(true);
            }
            function disableGrid() {
                console.log('disableGrid');
                if ($scope.gridApi)
                    $scope.gridApi.setActive(false);
            }
            function reloadGrid() {
                console.log('reloadGrid');
                if ($scope.gridApi)
                    $scope.gridApi.refresh();
            };


            // Standrad From Events
            $scope.doDelete = function () {
                console.log('doDelete');
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
                console.log('doApplay');
                var defferd = $q.defer();

                if ($scope.formOperationState === pnenum.pnformstate.insert ||
                    $scope.formOperationState === pnenum.pnformstate.update
                    || $scope.formOperationState === pnenum.pnformstate.deletee) {

                    if ($scope.formOperationState === pnenum.pnformstate.insert) {

                        var dynamicEntity = {};
                        $scope.entityViwerApi.getData(function (empDynamicData) {
                            dynamicEntity.Fields = empDynamicData;
                        });

                        dynamicEntity.Fields.EMPT1_Employees_Pkey = cache.prsCache.person.EMPT1_Employees_Pkey;
                        dynamicEntity.Table = currentForm;
                        

                        remoteService.post(dynamicEntity, empWebAccess + "api/PRSOData/Create").then(function (result) {
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
                        remoteService.post(dynamicEntity, empWebAccess + "api/PRSOData/Update").then(function (result) {
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
                console.log('doInsert');
                $scope.formOperationState = pnenum.pnformstate.insert;
                $scope.entityViwerApi.enable();
                disableGrid();
                return true;
            };



            // Private CRUD Functions
            $scope.delete = function () {
                console.log('delete');
                var dynamicEntity = {};
                dynamicEntity.CurrentTableName = currentForm;
                remoteService.post(dynamicEntity, empWebAccess + "api/PRSOData/Delete").then(function (result) {
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
                console.log('showGridSelectedRowInForm ');
                $rootScope.person = entity;
                $scope.entityViwerApi.load(entity);
            }
            
            // grid Config
            $scope.selectedItems = [];
            $scope.gridConfig = {
                autoBind: false,
                inlineOperationalUrl: {
                    read: {
                        url: empWebAccess + "api/PRSOData/Get/",
                        data: function () {
                            return {
                                table: currentForm,
                                fields: $scope.col,
                                filter: {
                                            Logic: "and",
                                            filters: [
                                                {
                                                    field: "EMPT1_Employees_Pkey",
                                                    Value: cache.prsCache.person.EMPT1_Employees_Pkey,
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


