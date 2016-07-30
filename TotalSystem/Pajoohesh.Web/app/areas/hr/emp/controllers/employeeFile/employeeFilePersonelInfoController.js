define(["areas/hr/emp/app.areas.hr.emp"], function (emp) {


    emp.register.controller("employeeFilePersonelInfoController", ["$scope", "pn.remote.service", "pn.dialog", "pn.focus",
        "pn.enum", "Notification", "cache", "pn.errorHandler", "empWebAccess", "$rootScope", "$q", '$state', 'blockUI',

        function ($scope, remoteService, dialog, focus, pnenum, notify, cache, errorHandler, empWebAccess, $rootScope, 
                  $q, $state,blockUI) {

            
            var currentName = $state.current.name;
            $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                if (currentName === toState.name) {
                    event.preventDefault();
                    setPersonelCodeTitle();
                    getFormIds();
                    checkGridStatus();
                }
            }
            );


            var ctrCache = cache.empCache;

            var checkGridStatus = function () {
                if ($scope.gridOptions.columns === undefined || $scope.gridOptions.columns.length <= 0) {
                    reloadGrid();
                }
            }


            $scope.onKendoReady = function (kendo) {
                $scope.kendo = kendo;
            };

            function reloadGrid  () {
                $scope.gridApi.refresh();
            }

            var enableGrid = function () {
                if ($scope.gridApi)
                    $scope.gridApi.setActive(true);
            }
            var disableGrid = function () {
                $scope.gridApi.setActive(false);
            }

            var initializeForm = function () {
                ctrCache.person.disablePersonBaseInfo = true;
                //ctrCache.person.EMPT1_Employees_Pkey = "";
                $rootScope.birthLocation.showValue = "";
                $rootScope.birthLocation.value = null;


                if ($scope.options == null) {
                    $scope.options = { metaDataUri: empWebAccess +
                    'api/EmpCommonServices/GettingStructureTable?id=EMP.EMPT1_Employees-2,3' };
                }

                enableGrid();
            }

            initializeForm();

            var resultHandler = function (result, notifyMessage) {
                if (result.Success) {
                    notify.success(notifyMessage);
                    $scope.entityViwerApi.disable();
                    reloadGrid();
                    initializeForm();
                }
                else {
                    errorHandler.ShowError(result);
                }
                return result.Success;

            }

            var createEmployeeDynamic = function () {
                var employee = {};
                var defferd = $q.defer();
                $scope.entityViwerApi.isValid(function (invalids) {
                    if (invalids.length > 0) {
                        dialog.showMessage("توجه", invalids[0].persianName + " وارد نشده است ");
                        defferd.reject(false);
                    } else {
                        $scope.entityViwerApi.getData(function (empDynamicData) {
                            employee = angular.copy(ctrCache.person);
                            employee.DynamicProperties = empDynamicData;
                            employee.PUBT1_GeographicAreas_Pkey_BirthPlace = $rootScope.birthLocation.value;
                            employee.EMPT5_GroupEmployees_Code = $rootScope.CurrenTabState.systemId;
                            employee.EMPT1_Employees_BirthDate=JalaliDate.parse(ctrCache.person.EMPT1_Employees_BirthDate).gregoriandate

                            remoteService.post(employee, empWebAccess + "api/Employee/CreateDynamicEmployee").then(
                                function (result) { defferd.resolve(result) },
                                function (error) { defferd.reject(error) });
                        });
                    }
                });

                return defferd.promise;
            }
            var updateEmployeeDynamic = function () {
                var employee = {};
                var defferd = $q.defer();
                $scope.entityViwerApi.isValid(function (invalids) {
                    if (invalids.length > 0) {
                        dialog.showMessage("توجه", invalids[0].persianName + " وارد شده صحیح نیست ");
                        defferd.reject(false);
                    } else {
                        $scope.entityViwerApi.getData(function (empDynamicData) {
                            employee = angular.copy(ctrCache.person);
                            employee.DynamicProperties = empDynamicData;
                            employee.PUBT1_GeographicAreas_Pkey_BirthPlace = $rootScope.birthLocation.value;
                            employee.EMPT5_GroupEmployees_Code = $rootScope.CurrenTabState.systemId;
                            employee.EMPT1_Employees_BirthDate = JalaliDate.parse(ctrCache.person.EMPT1_Employees_BirthDate).gregoriandate

                            remoteService.post(employee, empWebAccess + "api/Employee/UpdateDynamicEmployee").then(
                                function (result) { defferd.resolve(result) },
                                function (error) { defferd.reject(error) });
                        });
                    }
                });

                return defferd.promise;
            }


            $scope.delete = function () {
                var deffred = q.defer();
                var employee = {};
                employee.EMPT1_Employees_Pkey = ctrCache.person.EMPT1_Employees_Pkey;
                  if (employee.EMPT1_Employees_Pkey == null) {
                     notify.error({
                            message: ' یک شخص را  اطلاعات انتخاب کنبد', title: 'خطا'
                        });
                      deffred.resolve(true);
                  }
                remoteService.post(employee, empWebAccess + "api/Employee/DeleteEmployee").then(function (result) {
                    if (result.Success) {
                        notify.success({ message: 'اطلاعات سیستم با موفقیت حدف شد', title: ' ثبت اطلاعات' });
                        reloadGrid();
                         
                    }
                    else {
                        errorHandler.ShowError(result);
                    }
                  deffred.resolve(result);

                });
            }
            $scope.cancel = function () {
                initializeForm();
                return true;
            }

            // Standrad From Events
            $scope.doDelete = function () {
                var defferd = $q.defer();
                dialog.showYesNo("توجه", "آیا مطمئن به حذف اطلاعات هستید ؟", "بله", "خیر").then(function (resultConfrim) {
                    if (resultConfrim == null) {
                        defferd.resolve(false);
                    } else if (resultConfrim === true) {
                        $scope.delete();
                         defferd.resolve(true);
                    }
                });

                return defferd.promise;
            }

            $scope.doEdit = function () {
                if (ctrCache.person.EMPT1_Employees_Pkey == null) {
                    dialog.showMessage("خطا", "رکوردی برای ویرایش انتخاب نشده است");
                    return false;
                }

                $scope.formOperationState = pnenum.pnformstate.update;
                prepareFormForEdit();
                $scope.entityViwerApi.enable();
                return true;
            }
            $scope.doCancel = function () {
                initializeForm();
                $scope.entityViwerApi.disable();
                return true;
            }
            $scope.doApplay = function () {
                
                var defferd = $q.defer();
                if (validationCheck() === false) {
                    return false;
                }
                // validationCheck
                if ($scope.formOperationState === pnenum.pnformstate.insert) {
                    createEmployeeDynamic().then(function (result) {
                        resultHandler(result, { message: 'اطلاعات سیستم با موفقیت ثبت شد', title: ' ثبت اطلاعات' });
                        defferd.resolve(result.Success);
                    });

                }

                if ($scope.formOperationState === pnenum.pnformstate.update) {
                    updateEmployeeDynamic().then(function (result) {

                        resultHandler(result, { message: 'اطلاعات سیستم با موفقیت ثبت شد', title: ' ثبت اطلاعات' });
                        defferd.resolve(result.Success);
                    });
                }

                return defferd.promise;
            }
            $scope.doInsert = function () {
                $scope.formOperationState = pnenum.pnformstate.insert;
                prepareFormForInsert();
                $scope.entityViwerApi.enable();
                return true;
            }

            $scope.doDispose = function() {
                var defferd = $q.defer();
                ctrCache.person = null;
                defferd.resolve(true);
                return defferd.promise;
            };

            $scope.doBtnUser2 = function () {
                dialog.showYesNo("تخصیص کد", "آیا مایل به تخصیص کد پرسنلی جدید هستید؟", "بلی", "خیر")
                    .then(function (result) {
                        if (result == undefined) {
                            return;
                        }
                        var employee = {};
                        employee.GroupEmployeeKey = 2;
                        employee.EmployeeKey = ctrCache.person.EMPT1_Employees_Pkey;
                        remoteService.post(employee, empWebAccess + "api/HgEmployee/GetHgEmployeeLastState")
                            .then(function (result) {
                                reloadGrid();
                            });
                    });
            }
            $scope.doBtnUser1 = function () {
                dialog.showYesNo("استعلام", "آیا مایل به استعلام جدید هستید ؟", "بلی", "خیر")
                    .then(function (result) {
                        if (result == undefined) {
                            return true;
                        }
                        var employee = {};
                        employee.NationalID = ctrCache.person.EMPT1_Employees_NationalID;
                        employee.BirthDate = ctrCache.person.EMPT1_Employees_BirthDate;
                        remoteService.post(employee, empWebAccess + "api/EmpCommonServices/InquiryPersonSabteAhvalInfoByNationalID").then(function () {
                            reloadGrid();
                        });
                        return true;
                    });


            };


            function getFormIds() {
                for (var j = 0; j < $rootScope.tabItems.length; j++) {
                    if ($rootScope.tabItems[j].action === $state.current.name) {
                       
                        $scope.SystemId = $rootScope.tabItems[j].SystemKey;
                        $scope.FormId = $rootScope.tabItems[j].FormId;
                        break;
                    }
                }
            }

            function validationCheck() {
                

                

                // Static Validation
                if (checkMelliCode(ctrCache.person.EMPT1_Employees_NationalID) === false) {
                    notify.error("کد ملی صحیح نیست  ");
                    return false;
                }
                
                if (
                    ctrCache.person.EMPT1_Employees_Name == undefined ||
                    ctrCache.person.EMPT1_Employees_BirthCertificateID == undefined ||
                    ctrCache.person.EMPT1_Employees_LastName == undefined ||
                    ctrCache.person.EMPT1_Employees_FatherName == undefined )
                     {
                    notify.error("اطلاعات پایه را به کامل و به درستی وارد کنید ");

                    return false;
                }

                var SHAMSI_REGEXP = /^1[34][0-9][0-9]\/((0[1-6]\/((3[0-1])|([1-2][0-9])|(0[1-9])))|((1[0-2]|(0[7-9]))\/(30|([1-2][0-9])|(0[1-9]))))$/gi;
                if (SHAMSI_REGEXP.test(ctrCache.person.EMPT1_Employees_BirthDate) === false) {
                    notify.error("تاریخ وارد شده صحیح نیست");
                    return false;
                }
                

                if ($rootScope.birthLocation.value == undefined) {
                    notify.error("محل تولد را انتخاب کنید");
                    return false;
                }
                return true;
            }

            var prepareFormForInsert = function () {
                disableGrid();
                ctrCache.person.disablePersonBaseInfo = false;
                ctrCache.person = {};
                var a = {};
                $scope.entityViwerApi.load(a);
                focus.setFocus('empCache.person.EMPT1_Employees_NationalID');
                $rootScope.birthLocation.showValue = "";
                $rootScope.birthLocation.value = null;
            }
            var prepareFormForEdit = function () {
                disableGrid();
                ctrCache.person.disablePersonBaseInfo = false;
                focus.setFocus('empCache.person.EMPT1_Employees_NationalID');
            }


            $scope.selectedItems = [];
            $scope.gridConfig = {
                autoBind: false,
                inlineOperationalUrl: {
                    read: {
                        url: empWebAccess + "api/Employee/GetEmployeesDyncData",
                        data: function () {
                            console.log('sadasd');
                            var t = $scope.filterQuery || {};
                            t.EmployeesGroup = $rootScope.CurrenTabState.systemId;
                            t.FormId = $scope.FormId;
                            t.SystemId = $scope.SystemId;
                            return t;
                        }
                    }
                }
            };
            $scope.gridColumns = [
                {
                    field: 'EMPT1_Employees_NationalID',
                    editable: false,
                    title: "کد ملی",
                    allownull: false,
                    width: 100,
                },
                {
                    field: 'EMPT2_Employees_lD',
                    editable: false,
                    title: "شماره پرسنلی",
                    allownull: false,
                    width: 130
                },
                {
                    field: 'EMPT1_Employees_Name',
                    editable: false,
                    title: "نام",
                    allownull: false,
                    width: 130
                },
                {
                    field: 'EMPT1_Employees_LastName',
                    editable: false,
                    title: "نام خانوادگی",
                    allownull: false,
                    width: 130
                },
                {
                    field: 'EMPT1_Employees_BirthCertificateID',
                    editable: false,
                    title: "شماره شناسنامه",
                    allownull: false,
                    width: 130
                },
                {
                    field: 'EMPT1_Employees_FatherName',
                    editable: false,
                    title: "نام پدر",
                    allownull: false,
                    width: 130
                },
                {
                    field: 'EMPT1_Employees_BirthDate',
                    editable: false,
                    title: "تاریخ تولد",
                    allownull: false,
                    width: 130
                },
                {
                    field: 'PUBT1_GeographicAreas_Pkey_BirthPlace_Text',
                    editable: false,
                    title: "محل تولد",
                    allownull: false,
                    width: 130
                },
                {
                    field: 'PUBT1_GeographicAreas_Pkey_IssuePlace_Text',
                    editable: false,
                    title: "محل صدور",
                    allownull: false,
                    width: 130
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

            $scope.$watch('selectedItems', function () {
                if ($scope.selectedItems.length <= 0)
                    return;
                $scope.showGridSelectedRowInForm($scope.selectedItems[0]);

            });
            $scope.showGridSelectedRowInForm = function (entity) {
                var newEntity = angular.copy(entity);
                ctrCache.person = newEntity;
                ctrCache.person.disablePersonBaseInfo = true;
                $rootScope.birthLocation.showValue = entity.PUBT1_GeographicAreas_Pkey_BirthPlace_Text;
                $rootScope.birthLocation.value = entity.PUBT1_GeographicAreas_Pkey_BirthPlace;
                $scope.entityViwerApi.load(entity);

            }
            $scope.onEnityViewerReady = function () {
                $scope.entityViwerApi.disable();
                var i = 0; cnt = $scope.entityViwerApi.getFieldsCount();
                $scope.gridOptions = $scope.kendo.getOptions();
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
                        col.template = miladiToJalaliTemplate(field);
                    }

                    $scope.gridOptions.columns.push(col);
                    $scope.col.push(field.latinName);
                }

                $scope.gridOptions.autoBind = true;
                $scope.kendo.setOptions($scope.gridOptions);

            }

            function checkMelliCode(meliCode) {
                if (meliCode == null)
                    return false;

                if (meliCode.length == 10) {
                    if (meliCode == '1111111111' ||
                        meliCode == '0000000000' ||
                        meliCode == '2222222222' ||
                        meliCode == '3333333333' ||
                        meliCode == '4444444444' ||
                        meliCode == '5555555555' ||
                        meliCode == '6666666666' ||
                        meliCode == '7777777777' ||
                        meliCode == '8888888888' ||
                        meliCode == '9999999999') {
                        return false;
                    }
                    c = parseInt(meliCode.charAt(9));
                    n = parseInt(meliCode.charAt(0)) * 10 +
                        parseInt(meliCode.charAt(1)) * 9 +
                        parseInt(meliCode.charAt(2)) * 8 +
                        parseInt(meliCode.charAt(3)) * 7 +
                        parseInt(meliCode.charAt(4)) * 6 +
                        parseInt(meliCode.charAt(5)) * 5 +
                        parseInt(meliCode.charAt(6)) * 4 +
                        parseInt(meliCode.charAt(7)) * 3 +
                        parseInt(meliCode.charAt(8)) * 2;
                    r = n - parseInt(n / 11) * 11;
                    if ((r == 0 && r == c) || (r == 1 && c == 1) || (r > 1 && c == 11 - r)) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }
            function setPersonelCodeTitle() {
                var systemId = parseInt($rootScope.CurrenTabState.systemId);
                switch (systemId) {
                    case 2006:
                        {
                            ctrCache = cache.empCache;
                            ctrCache.testTitle = " شماره پرونده :";

                            break;
                        }
                    case 3001:
                        {
                            ctrCache = cache.empCache2;
                            ctrCache.testTitle = " شماره پرسنلی :";
                            break;
                        }
                    default: ctrCache.testTitle = " شماره پرونده :";
                }
            }

            setPersonelCodeTitle();
        }]);
});


