define(["areas/hr/emp/app.areas.hr.emp"], function (emp) {

    emp.register.controller("employeeFileTakafolController", 
    ["$scope", "$timeout", "pn.remote.service", "pn.dialog", "pn.focus",
        "pn.enum", "Notification", "$rootScope", "$stateParams", "cache", "pn.errorHandler", 
        "empWebAccess", "$state", "$q",

        function ($scope, $timeout, remoteService, dialog, focus, pnenum, notify
                  , $rootScope, $stateParams, cache, errorHandler, empWebAccess, $state,$q) {



            var currentForm = $state.current.data;
            var currentName = $state.current.name;
            $rootScope.$on('$stateChangeSuccess',
                function (event, toState, toParams, fromState, fromParams) {
                    if (currentName === toState.name) {
                        reloadGrid();
                        init();
                    }
                }
            );


            cache.empCache.person.EMPT1_Employees_NationalOptions = {
                kendoOptions: {}
            }


            var ctrCache = cache.empCache;
            function init() {
                if (cache.empCache.person.EMPT1_Employees_Pkey == null) {
                   notify.error({message: 'لطفا یک شخص را برای نمایش اطلاعات انتخاب کنید', title: 'خطا'});
                    $state.go('home.tab.createEmployeeFile.personelInfo');
                   }


                $rootScope.disablePersonBaseInfo = true;
                initializeForm();
                if ($scope.options == null) {
                    $scope.options = { metaDataUri: empWebAccess + 'api/EmpCommonServices/GettingStructureTable?id=EMP.EMPT4_Family-1,2' };
                }
                enableGrid();

                var systemId = parseInt($rootScope.CurrenTabState.systemId);
                switch (systemId) {
                    case 2006:
                        {
                            ctrCache = cache.empCache;
                            break;
                        }
                    case 3001:
                        {
                            ctrCache = cache.empCache2;
                            break;
                        }
                }
                
            };
            init();

            

            function reloadGrid () {
                $scope.gridApi.refresh();
            }
            function enableGrid() {
                if ($scope.gridApi)
                    $scope.gridApi.setActive(true);
            }
            var disableGrid = function (gridId) {
                $scope.gridApi.setActive(false);
            }


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
                        debugger;
                        col.template = Template(field);
                    }

                    if (field.typeKey == 124) {
                        col.template = miladiToJalaliTemplate(field);
                    }

                    $scope.gridOptions.columns.push(col);
                    $scope.col.push(field.latinName);
                }

                $scope.gridOptions.autoBind = true;
                $scope.kendo.setOptions($scope.gridOptions);

            }



            function initializeForm() {
               // $scope.entityViwerApi.disable();
            }


            $scope.insert = function () {

            $scope.entityViwerApi.isValid(function (invalids) {
                  
                    if (invalids.length > 0) {
                        debugger;
                        dialog.showMessage("توجه", invalids[0].persianName + " وارد شده صحیح نیست ");
                        defferd.reject(false);
                    } 
                    });

                var family = {};
                $scope.entityViwerApi.getData(function (data) {
                    family.Fields = data;
                });
                family.Fields.EMPT1_Employees_Pkey = ctrCache.person.EMPT1_Employees_Pkey;
                family.Table = "EMP.EMPT4_Family";
                return remoteService.post(family, empWebAccess + "api/EmpOData/Create").then(function (result) {
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
            $scope.update = function () {
                var family = {};
                $scope.entityViwerApi.getData(function (data) {
                    family = data;
                });

                family.EMPT4_Family_Pkey = $scope.entityViwerApi.familyPk;
                family.EMPT1_Employees_Pkey = ctrCache.person.EMPT1_Employees_Pkey;
                return remoteService.post(family, empWebAccess + "api/Family/UpdateFamily");
            }
            $scope.delete = function () {
                var person = {};
                person.EMPT4_Family_Pkey = $scope.entityViwerApi.familyPk;

                remoteService.post(person, empWebAccess + "api/Family/DeleteFamily").then(function (result) {
                    if (result.Success) {
                        notify.success({ message: 'اطلاعات سیستم با موفقیت حدف شد', title: ' ثبت اطلاعات' });
                        reloadGrid();
                    }
                    else {
                        errorHandler.ShowError(result);
                    }
                });
            }

            // Standrad From Events
            $scope.doDelete = function () {
                $scope.delete();
                return false;
            }
            $scope.doEdit = function () {
                if (cache.empCache.person == null) {
                    dialog.showMessage("خطا", "رکوردی برای ویرایش انتخاب نشده است");
                    return false;
                }
                $scope.formOperationState = pnenum.pnformstate.update;
                $scope.entityViwerApi.enable();
                return true;

            }
            $scope.doCancel = function () {
                initializeForm();
                return true;
            }
            $scope.doInsert = function () {
                $scope.formOperationState = pnenum.pnformstate.insert;
                $rootScope.disablePersonBaseInfo = false;
                $scope.entityViwerApi.enable();
                var a = {};
                $scope.entityViwerApi.load(a);
                return true;
            };
            $scope.doApplay = function () {

                var defferd = $q.defer();

                if ($scope.formOperationState === pnenum.pnformstate.insert) {
                    $scope.insert().then(function (result) {
                        resultHandler(result, { message: 'اطلاعات  با موفقیت ثبت شد', title: ' ثبت اطلاعات' });
                        defferd.resolve(result.Success);
                    }
                )
                };


                if ($scope.formOperationState === pnenum.pnformstate.update) {
                    $scope.update().then(function (result) {
                        resultHandler(result, { message: 'اطلاعات سیستم با موفقیت ثبت شد', title: ' ثبت اطلاعات' });
                        defferd.resolve(result.Success);
                    }
                )
                };

                return defferd.promise;
            }


            var resultHandler = function (result, notify1) {
                if (result.Success) {
                    notify.success(notify1);
                    $scope.entityViwerApi.disable();
                    reloadGrid();
                    initializeForm();
                    var a = {};
                    $scope.entityViwerApi.load(a);
                }
                else {
                    errorHandler.ShowError(result);
                }

                return result.Success;

            }
            
            $scope.showGridSelectedRowInForm = function (entity) {

                $scope.entityViwerApi.familyPk = entity.EMPT4_Family_Pkey;
                $scope.entityViwerApi.load(entity);
            }

            var prepareFormForInsert = function () {
                disableGrid();
            }
            var prepareFormForEdit = function () {
                disableGrid();
            }

            $scope.selectedItems = [];
            $scope.gridConfig = {
                inlineOperationalUrl: {
                    read: {
                        url: empWebAccess + "api/Family/GetFamilyDynmcData",
                        data: function () {
                            var t = $scope.filterQuery || {};
                            t.EmployeeKey = ctrCache.person.EMPT1_Employees_Pkey;
                            return t;
                        }
                    }
                }
            };
            $scope.gridColumns = [];

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

            $scope.$watch('selectedItems', function (newVal, oldVal) {
                if ($scope.selectedItems.length <= 0)
                    return;
                $scope.showGridSelectedRowInForm($scope.selectedItems[0]);
            });
           

        }]);
});


