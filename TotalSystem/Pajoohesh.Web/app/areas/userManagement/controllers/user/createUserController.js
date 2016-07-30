define(["areas/userManagement/app.areas.userManagement"], function (userManagement) {
    userManagement.register.controller("createUserController",
        ["$scope", "pn.remote.service", "pn.focus", "Notification",
        "pn.enum", "userManagementWebAccess", "cache", "$state",
        "pn.dialog", "pn.message", "pn.errorHandler", "$q", "$rootScope",
    function ($scope, remoteService, focus, notify, pnenum, WebAccess, cache, $state, dialog, message, errorHandler, $q, $rootScope) {

        //#region -----Watch Events & Helper Function-----

        var setRealConfig = function () {
            $scope.disableEmployee = false;
            $scope.isSystemUser = false;
            $scope.hidePersonliSearch = true;
            $scope.hidePersonRegion = false;
        };
 
        var setPersoneliConfig = function () {
            $scope.disableEmployee = true;
            $scope.hidePersonliSearch = false;
            $scope.hidePersonRegion = false;
        };

        var setLegalOrSystemConfig = function () {
            $scope.hidePersonliSearch = true;
            $scope.hidePersonRegion = true;
        }

        //#endregion -----Watch Events & Helper Function-----

    

        $scope.optionsPersonnel = {
            allowDuplicate: true,
            required: true,
            lookup: {
                fields: [
                         { latinName: "EMPT1_Employees_Pkey", persianName: "Id", length: 0, minRange: null, maxRange: null, allowDuplicate: false, required: false, typeKey: 101, items: null, showInSearchPanel: false, showInGrid: false, width: 500 },
                         { latinName: "EMPT1_Employees_NationalID", persianName: "کد ملی", length: 10, minRange: null, maxRange: null, allowDuplicate: false, required: false, typeKey: 101, items: null, showInSearchPanel: true, showInGrid: true, },
                         { latinName: "EMPT1_Employees_Name", persianName: "نام", length: 10, minRange: null, maxRange: null, allowDuplicate: false, required: false, typeKey: 101, items: null, showInSearchPanel: true, showInGrid: true, },
                         { latinName: "EMPT1_Employees_LastName", persianName: "نام خانوادگی", length: 10, minRange: null, maxRange: null, allowDuplicate: false, required: false, typeKey: 101, items: null, showInSearchPanel: true, showInGrid: true, },
                         { latinName: "EMPT1_Employees_FatherName", persianName: "نام پدر", length: 10, minRange: null, maxRange: null, allowDuplicate: false, required: false, typeKey: 101, items: null, showInSearchPanel: true, showInGrid: true, },
                ],
                url: WebAccess + "api/EmpOData/get/",
                table: 'EMP.EMPT1_Employees',
                textField: "EMPT1_Employees_LastName",
                valueField: "EMPT1_Employees_Pkey",

            },
        };

        $scope.$watch('optionsPersonnel.value', function () {
            if ($scope.optionsPersonnel.value != null) {
                if ($scope.optionsPersonnel.value != "") {
                    remoteService.get(null, WebAccess + "api/Employee/GetEmployeebyKey?id=" + $scope.optionsPersonnel.value).then(function (result) {
                        $scope.configPersonel(result.Entity);
                    });
                }
            }
        });

        $scope.user = {};
        $scope.user.UserTypeId = null;

        $scope.$watch('user.UserTypeId', function (newVal, oldVal) {
            $scope.isCompany = false;
            $scope.isSystemUser = false;

            switch ($scope.user.UserTypeId) {
                case pnenum.pnUserType.personeli:
                    setPersoneliConfig();
                    break;
                case pnenum.pnUserType.legal:
                    setLegalOrSystemConfig();
                    $scope.isCompany = true;
                    break;
                case pnenum.pnUserType.system:
                    setLegalOrSystemConfig();
                    $scope.isSystemUser = true;
                    break;
                default:
                    setRealConfig();
                    break;
            }
        });

        $scope.doInsert = function () {
            $scope.user = {};
            $scope.formOperationState = pnenum.pnformstate.insert;
            return true;
        };

        $scope.initializeForm = function () {
            //برگشت به حالت اولیه دکمه ها
            $scope.$emit("toolbar:DoRibbonFalse");
            $scope.user = {};
            $scope.messageRegionHide = true;
            $scope.userSelectedItem = {};
            $scope.isSystemUser = false;
            $scope.suffixIdSelected = "";
            $scope.languageIdSelected = "";
            $scope.personNoSearchValue = "";
            $scope.errorMessage = "شخصی با شماره پرسنل وارد شده موجود نمی باشد";
            $scope.userTypes = {};
            $scope.suffixes = {};
            $scope.languages = {};
            $scope.personelNoSearchValue = "";
            $scope.formOperationState = pnenum.pnformstate.update;

            if (cache.umsCache != null && cache.umsCache.selectedUser != null) {
                if ((cache.umsCache.selectedUser.Key == null || cache.umsCache.selectedUser.Key == "") && cache.umsCache.selectedUser.Mode == null) {
                    dialog.showMessage('عدم انتخاب کاربر', message.common.noSelectedUser);
                    $state.go('home.tab.user.listUser');
                    return;
                }

                $scope.user = cache.umsCache.selectedUser;
                $scope.formOperationState = $scope.user.Key == null || $scope.user.Key == "" ? pnenum.pnformstate.insert : pnenum.pnformstate.update;


                if ($scope.user.Key == null || $scope.user.Key == "") {
                    $scope.doInsert();
                    $scope.user.UserTypeId = pnenum.pnUserType.personeli;
                }
                else {
                    remoteService.get($scope.user.Key, WebAccess
                        + "api/User/GetUserById").then(function (result) {
                            if (result.Success)
                                $scope.user = result.Entity;
                            else {
                                debugger;
                                dialog.showMessage(result.ErrorMessage, message.common.noSelectedUser);
                                $state.go('home.tab.user.listUser');
                            }
                        });
                }
            }
            else {
                dialog.showMessage(message.error, message.common.noSelectedUser);
                $state.go('home.tab.user.listUser');
            }
        };

        $scope.initializeForm();

        var currentName = $state.current.name;
        $rootScope.$on('$stateChangeSuccess',
            function (event, toState, toParams, fromState, fromParams) {
                if (currentName === toState.name) {
                    $scope.initializeForm();
                }
            }
        );

        $scope.doDelete = function () { return true; }

        $scope.doEdit = function () { return true; }

        $scope.doCancel = function () {
            $state.go('home.tab.user.listUser');
            return true;
        }

        $scope.doSearchPerson = function () {
            remoteService.get($scope.personelNoSearchValue, WebAccess + "api/CommonServices/GetEmployeebyEmployeeId").then(function (result) {
                if (result != null)
                    $scope.configPersonel(result);
                else
                    $scope.emptyPersonel();
            });
        };

        $scope.emptyPersonel = function () {
            $scope.personelSelectedItem = {};
            $scope.messageRegionHide = false;
            $scope.errorMessage = "شماره پرسنلی وارد شده موجود نمی باشد";
        };

        $scope.configPersonel = function (entity) {
            $scope.user.FirstName = entity.FirstName;
            $scope.user.LastName = entity.LastName;
            $scope.user.BirthCertificateId = entity.BirthCertificateId;
            $scope.user.BirthDate = entity.BirthDate;
            $scope.user.EmployeeId = entity.EmployeeId;
            $scope.user.EmployeeKey = entity.Key;
            $scope.user.NationalId = entity.NationalId;
            $scope.user.FatherName = entity.FatherName;

            $scope.messageRegionHide = true;
            $scope.errorMessage = "";
        };

        $scope.doApplay = function () {

            var defferd = $q.defer();

            if ($scope.user.UserTypeId == pnenum.pnUserType.personeli
                && ($scope.user.FirstName == "" || $scope.user.FirstName == null)) {
                notify.error({ message: "اطلاعات پرسنلی بارگذاری نشده است", title: "خطا" })
                defferd.resolve(false);
            }
            else {

                var saveUrl = $scope.formOperationState == pnenum.pnformstate.insert ? "api/User/CreateUser" : "api/User/UpdateUser";
                remoteService.post($scope.user, WebAccess + saveUrl).then(function (result) {
                    if (result.Success) {
                            notify.success({ message: message.common.successfullInsert, title: message.common.insert });
                            $scope.doInsert();// empty user data for ready new User insertion
                            defferd.resolve(true);
                    }
                    else {
                            errorHandler.ShowError();
                            defferd.resolve(false);
                    }
                });
            }

            defferd.promise;
            $state.go('home.tab.user.listUser');
            return true;
        };

        var update = function () {

        };

        //#region -----Implemenation Autoload items-----

        $scope.getSuffixes = function () {
            remoteService.get(null, WebAccess + "api/UsmCommonServices/GetTitles").then(function (loadDataResult) {
                $scope.suffixes = loadDataResult.Entities;
            });
        };

        $scope.getLanguages = function () {
            remoteService.get(null, WebAccess + "api/UsmCommonServices/GetLanguages").then(function (loadDataResult) {
                $scope.languages = loadDataResult.Entities;
            });
        };

        $scope.getUserTypes = function () {
            remoteService.get(null, WebAccess + "api/UsmCommonServices/GetUserTypes").then(function (result) {
                $scope.userTypes = result.Entities;
            });
        };

        //var loadCities = function () {
        //    remoteService.get(null, WebAccess + "CommonServices/GetGeographicAreas").then(function (data) {
        //        cache.empCache.cities = data.Entities;
        //    });
        //}

        //#endregion -----Implemenation Autoload items-----

        //#region -----Autoload items-----

        //loadCities();
        $scope.getSuffixes();
        $scope.getLanguages();
        $scope.getUserTypes();

        //#endregion -----Autoload items-----
    }]);
});


