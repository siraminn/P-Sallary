define(["areas/hr/rec/app.areas.hr.rec"], function (rec) {
    rec.register.controller("assignLicenseOrgUnitsCreateController", ["$scope", "$state", "pn.remote.service", "pn.enum", "pn.focus", "pn.errorHandler",
        "Notification", "recWebAccess", "$q", "pn.validator", "cache", "pn.message",
    function ($scope, $state, remoteService, pnenum, focus, errorHandler, notify, WebAccess, $q, validator, cache, pnMessage) {
        //*******************************************************************************************

        //تعریف متغیر های مربوطه
        $scope.FieldItems = {};
        $scope.AssignLicense = {};
        $scope.AssignLicense.Province = {};
        $scope.AssignLicense.Regions = {};
        $scope.PersonnelArray = [];
        $scope.rdOrgUnit = true;
        $scope.rdRegions = false;
        $scope.showUI = true;
        $scope.tagChangeValue= true;
        $scope.disableCtrFormCountTotal = true;
        $scope.disableCtrFormRd = false;
        $scope.disableCtrFormRegion = false;
        //فعال و غیر فعال کردن کردن گرید
        function enableGrid(value) {
            if ($scope.gridApi)
                $scope.gridApi.setActive(value);
        }
        //**********************************************************************************************************************************************
        $scope.SelectRadioOrgUnit = function () {
            $scope.rdOrgUnit = true;
            $scope.rdRegions = false;
            $scope.optionsPersonnel.lookup.data[0].value = cache.recCache.AssignLicense.Province.OrgUnitsID;
            ClearDataGridPersonel();
        }
        $scope.SelectRadioRegions = function () {
            if ($scope.rdRegions == false) {
                $scope.rdRegions = true;
                $scope.rdOrgUnit = false;
                ClearDataGridPersonel();
                if ($scope.optionsRegions.value != "")
                     $scope.optionsPersonnel.lookup.data[0].value = $scope.optionsRegions.value;
         
            }
        }
        //**********************************************************************************
        //lookup مناطق
        $scope.optionsRegions = {
            allowDuplicate: true,
            required: true,
            lookup: {
                fields: [
                    { latinName: "Description", persianName: "منطقه", typeKey: 104, showInSearchPanel: true, showInGrid: true, }
                ],
                filter: {
                    Logic: "and",
                    filters: [
                        {
                            field: "Parent",
                            Value: "" + cache.recCache.AssignLicense.Province.OrgUnitsID + "",
                            ParameterName: "p0",
                            operator: "eq",
                            dataType: 104,
                        }]
                },
                url: WebAccess + "/api/OrgForRec/GetRegion/",
                textField: "Description",
                valueField: "Key",
            },
        }


        $scope.$watch('optionsRegions.value', function () {
            if ($scope.optionsRegions.value != null) {
                if ($scope.optionsRegions.value != "") {
                    $scope.AssignLicense.Regions.Select = $scope.optionsRegions.value;
                    debugger;
                    if ($scope.tagChangeValue)
                        ClearDataGridPersonel();
                    $scope.tagChangeValue = true;
                    $scope.optionsPersonnel.lookup.data[0].value = $scope.optionsRegions.value;
                }
            }
        });
        $scope.$watch('optionsPersonnel.lookup.data[0].value', function () {
            $scope.apiPersonnel.refreshGrid();
        });

        $scope.extraPersonnel={id:1,name:'j'}
        //*****************************************************************************************************************************
        debugger;
        //lookup پرسنلی
        $scope.Personnel = {};
        $scope.Personnel.Attr = {};
        $scope.Personnel.Attr.disabledinfo = true;
        $scope.Personnel.Attr.hidesearch = false;
        $scope.Personnel.Attr.hideiInfo = true;
        $scope.optionsPersonnel = {
            allowDuplicate: true,
            required: true,
            lookup: {
                fields: [
                         { latinName: "EMPT1_Employees_NationalID", ParameterName: "p1", persianName: "کد ملی", length: 10, minRange: null, maxRange: null, allowDuplicate: false, required: false, typeKey: 101, items: null, showInSearchPanel: true, showInGrid: true, },
                         { latinName: "EMPT1_Employees_Name", ParameterName: "p2", persianName: "نام", length: 10, minRange: null, maxRange: null, allowDuplicate: false, required: false, typeKey: 104, items: null, showInSearchPanel: true, showInGrid: true, },
                         { latinName: "EMPT1_Employees_LastName", ParameterName: "p3", persianName: "نام خانوادگی", length: 10, minRange: null, maxRange: null, allowDuplicate: false, required: false, typeKey: 104, items: null, showInSearchPanel: true, showInGrid: true, },
                         { latinName: "EMPT1_Employees_FatherName", ParameterName: "p4", persianName: "نام پدر", length: 10, minRange: null, maxRange: null, allowDuplicate: false, required: false, typeKey: 104, items: null, showInSearchPanel: true, showInGrid: true, },
                         { latinName: "ORGT1_OrgUnits_Pkey", persianName: "Id", length: 0, minRange: null, maxRange: null, allowDuplicate: false, required: false, typeKey: 101, items: null, showInSearchPanel: false, showInGrid: false,  },
                ],
                url: WebAccess + "/api/Recodata/GetEmployee",              
                data: [
                    { name: "ORGT1_OrgUnits_Pkey", value: GetOrgUnitID(), },
                    { name: "EducationalDegreesStart", value: cache.recCache.AssignLicense.Province.EducationalDegreesIdFrom },
                    { name: "EducationalDegreesEnd", value: cache.recCache.AssignLicense.Province.EducationalDegreesIdTo },                    
                     ],
                table: 'EMP.EMPT1_Employees',
                textField: "EMPT1_Employees_LastName",
                valueField: "EMPT1_Employees_Pkey",   
            },

        }
        $scope.$watch('optionsPersonnel.value', function () {
            if ($scope.optionsPersonnel.value != null) {
                if ($scope.optionsPersonnel.value != "") {

                    remoteService.post({ EmployeeKey: $scope.optionsPersonnel.value }, WebAccess + "api/EmpForRec/GetEmployeebyKey").then(function (result) {

                        AddtoArray(result.Entity);


                    });
                }
            }
        });
        function GetOrgUnitID() {
            if ($scope.rdOrgUnit == true)
                return cache.recCache.AssignLicense.Province.OrgUnitsID;
            else if ($scope.rdRegions == true)
                return $scope.AssignLicense.Regions.Select;

        }
        //****************************************************************************************************************************

        $scope.ChangeFieldItems = function () {
            $scope.AssignLicense.Regions.WomenCount = "";
            $scope.AssignLicense.Regions.MenCount = "";

            if ($scope.AssignLicense.Regions.FieldItemsOrder == "2")//"انفرادی")
            {
                $scope.disableCtrFormCount = true;
                $scope.AssignLicense.Regions.Count = 1;
            }
            else {
                $scope.disableCtrFormCount = false;
                $scope.AssignLicense.Regions.Count = "";
            }
        };
        function GetFieldItems() {
            remoteService.post({Code:4}, WebAccess + "api/InfForRec/GetItemGroup").then(function (result) {
                $scope.FieldItems = result.Entities[0].FieldItems;
            });
        };
      
        /*********************************************************************/
        $scope.PersonnelSelectedItems = [];
        $scope.objkendoPersonnelSelect;
        $scope.objoptionsPersonnelSelect;
        $scope.PersonnelSelect_onKendoReady = function (kendo, options) {;
     debugger;
            $scope.objkendoPersonnelSelect = kendo;
            $scope.objoptionsPersonnelSelect = options;
            $scope.objoptionsPersonnelSelect.dataSource = $scope.PersonnelArray;
            $scope.objkendoPersonnelSelect.setOptions($scope.objoptionsPersonnelSelect);
            $scope.objkendoPersonnelSelect.dataSource.pageSize(10);
            calculationCount();
        }
        //اضافه کردن عنصر به ارایه
        function AddtoArray(info) {
            info.AssignLicenseId = null;
            var resultSearch = -1;
            for (var i = 0; i < $scope.PersonnelArray.length; i++) {
                if ($scope.PersonnelArray[i].Key == info.Key) {
                    resultSearch = i;
                }
            }

            if (resultSearch == -1) {
                $scope.PersonnelArray.push(info);
                debugger;
                var CurrentPage =  $scope.objkendoPersonnelSelect.dataSource._pageSize;
                $scope.objoptionsPersonnelSelect.dataSource = $scope.PersonnelArray;
                $scope.objkendoPersonnelSelect.setOptions($scope.objoptionsPersonnelSelect);
                if (CurrentPage == null)
                    $scope.objkendoPersonnelSelect.dataSource.pageSize(5);
                else
                    $scope.objkendoPersonnelSelect.dataSource.pageSize(CurrentPage);
                calculationCount();
            }

            else {
                var resultValidation = { ErrorMessage: null, ValidationErrors: [] };
                resultValidation.ValidationErrors.push({ ErrorMessage: pnMessage.common.errorRepeat });
                errorHandler.ShowError(resultValidation);
            }
        };
        //محاسبه تعداد زن و مرد
        function calculationCount() {
            var CountMen = 0;
            var CountWomen = 0;
            for (var i = 0; i < $scope.PersonnelArray.length; i++) {
                switch ($scope.PersonnelArray[i].SexValue) {
                    case "مرد": CountMen = CountMen + 1; break;
                    case "زن": CountWomen = CountWomen + 1; break;
                }
            };

            $scope.AssignLicense.Regions.WomenCountTotal = CountWomen;
            $scope.AssignLicense.Regions.MenCountTotal = CountMen;
            $scope.AssignLicense.Regions.CountTotal = $scope.PersonnelArray.length;
        };
        //حذف از ارایه
        //$scope.removeFromArray = function () { 
        $scope.doBtnUser1 = function () {
            var resultSearch = -1;
            if ($scope.PersonnelSelectedItems.length > 0) {
                for (var i = 0; i < $scope.PersonnelArray.length; i++) {
                    if ($scope.PersonnelArray[i].Key == $scope.PersonnelSelectedItems[0].Key) {
                        resultSearch = i;
                    }
                }
            };
            if (resultSearch != -1) {

                $scope.PersonnelArray.splice(resultSearch, 1);
                $scope.objoptionsPersonnelSelect.dataSource = $scope.PersonnelArray;
                $scope.objkendoPersonnelSelect.setOptions($scope.objoptionsPersonnelSelect);
                calculationCount();
            }

            else {
                var resultValidation = { ErrorMessage: null, ValidationErrors: [] };
                resultValidation.ValidationErrors.push({ ErrorMessage: pnMessage.common.errorDelete });
                errorHandler.ShowError(resultValidation);
            }
        };


        $scope.gridConfig_PersonnelSelect = {
            inlineOperationalUrl: {
                read: {
                    url: "",
                    data: function () {
                        return $scope.filterQuery;
                    }
                }
            },
            pageSizes: [5, 10, 15, 20, 25, 30, "All"]
        };
        $scope.gridColumns_PersonnelSelect = [
                                    { field: "EmployeeId", editable: false, title: "کد پرسنلی", allownull: false },
                                    { field: "NationalId", editable: false, title: "کد ملی", allownull: false },
                                    { field: "FirstName", editable: false, title: "نام", allownull: false },
                                    { field: "LastName", editable: false, title: "نام خانوادگی", allownull: false},
                                     { field: "SexValue", editable: false, title: "جنسیت", allownull: false},
                                    { field: "FatherName", editable: false, title: "نام پدر", allownull: false},
        ];
        $scope.gridSchema_PersonnelSelect = { model: { id: "Id", fields: { Code: { type: "number", editable: false } } }, data: "Entities", total: "total" };
        $scope.grid_onDataBound = function (kendo) {
            kendo.select(kendo.tbody.find('tr:first'));
        }
        //**********************************************************************************************************************************************************************
        //دریافت اطلاعات
        function GetDataForm() {
            $scope.optionsPersonnel.value = null;
            $scope.optionsPersonnel.text = null;
            $scope.optionsPersonnel.Key = null;
            if ($scope.AssignLicense.Regions.WomenCount == "")
                $scope.AssignLicense.Regions.WomenCount = "0";

            if ($scope.AssignLicense.Regions.MenCount == "")
                $scope.AssignLicense.Regions.MenCount = "0";


            for (var i = 0; i < $scope.FieldItems.length; i++) {
                if ($scope.FieldItems[i].Order == $scope.AssignLicense.Regions.FieldItemsOrder)
                    $scope.AssignLicense.Regions.FieldItemsID = $scope.FieldItems[i].FieldItemId;
            }
            $scope.AssignLicense.Regions.ParentId = $scope.AssignLicense.Province.Key;
            $scope.AssignLicense.Regions.Active = $scope.AssignLicense.Province.Active;
            $scope.AssignLicense.Regions.RecruitmentLicenseID = $scope.AssignLicense.Province.RecruitmentLicenseID;
            $scope.AssignLicense.Regions.EmployTypeId = $scope.AssignLicense.Province.EmployTypeId;
            $scope.AssignLicense.Regions.EducationalDegreesId = $scope.AssignLicense.Province.EducationalDegreesId;
            $scope.AssignLicense.Regions.OrgPositionId = $scope.AssignLicense.Province.OrgPositionId;

            if ($scope.rdOrgUnit == true)
                $scope.AssignLicense.Regions.OrgUnitsID = $scope.AssignLicense.Province.OrgUnitsID;
            else if ($scope.rdRegions == true)
                $scope.AssignLicense.Regions.OrgUnitsID = $scope.AssignLicense.Regions.Select;
            $scope.AssignLicense.Regions.AssignedPersonnel = [];
            for (var i = 0; i < $scope.PersonnelArray.length; i++) {
                $scope.AssignLicense.Regions.AssignedPersonnel.push({ EmployeeId: $scope.PersonnelArray[i].Key, AssignLicenseId: $scope.PersonnelArray[i].AssignLicenseId });
            }

            if ($scope.AssignLicense.Regions.FieldItemsOrder == "2")//انفرادی 
            {
                if ($scope.PersonnelArray.length == 1) {
                    $scope.AssignLicense.Regions.MenCount = $scope.AssignLicense.Regions.MenCountTotal;
                    $scope.AssignLicense.Regions.WomenCount = $scope.AssignLicense.Regions.WomenCountTotal;
                }
            }
        };

        // Initilize Form Data
        function initializeForm() {
            //برگشت به حالت اولیه دکمه ها
            $scope.$emit("toolbar:DoRibbonFalse");
            ClearDataForm();
            enableGrid(true);
            switch (cache.recCache.AssignLicense.formOperationState) {
                case pnenum.pnformstate.insert:
                    $scope.formOperationState = pnenum.pnformstate.insert;
                    if (cache.recCache.AssignLicense.Province == null || cache.recCache.AssignLicense.Province.Key == null)
                        $scope.showUI = false;
                    else {
                        $scope.AssignLicense.Province = cache.recCache.AssignLicense.Province;
                        $scope.showUI = true;
                        if ($scope.AssignLicense.Province.FieldItemsOrder == "2") {
                            notify.info("نوع مجوز استخدامی این تخصیص در سطح استان ، انفرادی می باشد لطفا فقط منطقه مورد نظر را انتخاب کنید");
                            $scope.rdOrgUnit = true;
                            $scope.rdRegions = false;


                            $scope.AssignLicense.Province = cache.recCache.AssignLicense.Province;
                            //   $scope.PersonnelArray = cache.recCache.AssignLicense.Regions.AssignedPersonnel;

                            $scope.AssignLicense.Regions.FieldItemsID = $scope.AssignLicense.Province.FieldItemsOrder;
                            $scope.AssignLicense.Regions.FieldItemsValue = $scope.AssignLicense.Province.FieldItemsValue;
                            $scope.AssignLicense.Regions.FieldItemsOrder = $scope.AssignLicense.Province.FieldItemsOrder;
                            $scope.AssignLicense.Regions.Count = $scope.AssignLicense.Province.Count;
                            $scope.AssignLicense.Regions.WomenCount = $scope.AssignLicense.Province.WomenCount;
                            $scope.AssignLicense.Regions.MenCount = $scope.AssignLicense.Province.MenCount;

                            remoteService.post({ AssignLicenseId: $scope.AssignLicense.Province.Key }, WebAccess + "api/AssignedPersonnel/GetAllAssignedPersonnel").then(function (result) {
                                for (var i = 0; i < result.Entities.length; i++)
                                    AddtoArray(result.Entities[i]);
                            });
                            $scope.disableCtrFormCount = true;
                         $scope.disableCtrForm = true; 
                         $scope.disableCtrFormRd = false;
                        }

                    };
                    break;
                case pnenum.pnformstate.update:
                    $scope.formOperationState = pnenum.pnformstate.update;

                    if (cache.recCache.AssignLicense.Province == null || cache.recCache.AssignLicense.Province.Key == null
                       || cache.recCache.AssignLicense.Regions == null || cache.recCache.AssignLicense.Regions.Key == null)
                        $scope.showUI = false;
                    else {
                        $scope.AssignLicense.Province = cache.recCache.AssignLicense.Province;
                        $scope.showUI = true;
                        $scope.tagChangeValue=false
                        LoadDataForm(cache.recCache.AssignLicense);
                       
                        if ($scope.AssignLicense.Province.FieldItemsOrder == "2") {
                            notify.info("نوع مجوز استخدامی این تخصیص در سطح استان ، انفرادی می باشد لطفا فقط منطقه مورد نظر زا انتخاب کنید");
                            $scope.disableCtrFormCount = true;
                            $scope.disableCtrForm = true;
                            $scope.disableCtrFormRd = false;
                        }
                    }
                    break;
                default:

                    if (cache.recCache.AssignLicense.Province == null || cache.recCache.AssignLicense.Province.Key == null
                     || cache.recCache.AssignLicense.Regions == null || cache.recCache.AssignLicense.Regions.Key == null)
                        $scope.showUI = false;
                    else {
                        $scope.showUI = true;
                        $scope.disableCtrForm = true;
                        $scope.disableCtrFormCount = true;
                        $scope.disableCtrFormRegion = true;
                         $scope.disableCtrFormRd = true;
                        $scope.optionsPersonnel.disabled = true;
                        $scope.optionsRegions.disabled = true;

                        LoadDataForm(cache.recCache.AssignLicense);
                        debugger;
                        enableGrid(false);
                    }
                    break;

            }





        };
        //پاک کردن اطلاعات فرم
        function ClearDataForm() {
            $scope.formOperationState = pnenum.pnformstate.insert;
            $scope.AssignLicense.Regions.FieldItemsID = null;
            $scope.AssignLicense.Regions.FieldItemsOrder = null;
            $scope.AssignLicense.Regions.OrgUnitsID = null;
            $scope.AssignLicense.Regions.Count = "";
            $scope.AssignLicense.Regions.WomenCount = "";
            $scope.AssignLicense.Regions.MenCount = "";
            $scope.AssignLicense.Regions.Desc = "";
            $scope.optionsRegions.value = "";
            $scope.optionsRegions.text = "";
            $scope.optionsRegions.Key = null;
            $scope.AssignLicense.Regions.Note = false;
            ClearDataGridPersonel();
            focus.setFocus('$scope.AssignLicense.Regions.OrgUnitsID');

        }
        function ClearDataGridPersonel() {
            //اگر نوع تخصیص مجوز ستاد گروهی بود لیست پرسنل پاک می شود
            if ($scope.AssignLicense.Province.FieldItemsOrder == "1") {
                $scope.optionsPersonnel.value = null;
                $scope.optionsPersonnel.text = null;
                $scope.optionsPersonnel.Key = null;
                $scope.AssignLicense.Regions.WomenCountTotal = "0";
                $scope.AssignLicense.Regions.MenCountTotal = "0";
                $scope.AssignLicense.Regions.CountTotal = "0";
          

                $scope.PersonnelArray = [];
                if ($scope.objoptionsPersonnelSelect != null) {
                    $scope.objoptionsPersonnelSelect.dataSource = [];
                    $scope.objkendoPersonnelSelect.setOptions($scope.objoptionsPersonnelSelect);
                }
         ظش    }
        }
        //نمایش اطلاعات
        function LoadDataForm(entity) {

            $scope.AssignLicense.Regions = entity.Regions;
            $scope.AssignLicense.Province = entity.Province;
            $scope.PersonnelArray = entity.Regions.AssignedPersonnel;          

            if ($scope.formOperationState == pnenum.pnformstate.update) {
                if ($scope.AssignLicense.Regions.FieldItemsOrder == "2")//"انفرادی")
                {
                    $scope.disableCtrFormCount = true;
                }
                else {
                    $scope.disableCtrFormCount = false;
                }
            }
            $scope.optionsPersonnel.value = $scope.AssignLicense.Regions.EmployID;

            if ($scope.AssignLicense.Regions.OrgUnitsID == $scope.AssignLicense.Province.OrgUnitsID) {
                $scope.rdOrgUnit = true;
                $scope.rdRegions = false;
            }
            else {
                $scope.rdRegions = true;
                $scope.rdOrgUnit = false;
                $scope.optionsRegions.value = $scope.AssignLicense.Regions.OrgUnitsID;
                $scope.optionsRegions.showValue = $scope.AssignLicense.Regions.OrgUnitsValue;
            }

        }
        //********************************************************************************************************************
        GetFieldItems();
        initializeForm();

        //****************************************************************************************************

        $scope.doCancel = function () {
            $state.go('home.tab.assignLicenseOrgUnits.list');

            return true;

        };
        $scope.doInsert = function () {


            if ($scope.AssignLicense.Province.Key == null) {
                var result = {
                    ErrorMessage: null,
                    ValidationErrors: []
                };
                result.ValidationErrors.push({ ErrorMessage: "هیچ مجوزی در سطح استان انتخاب نشده است" });
                errorHandler.ShowError(result);
                return false;
            }
            else {

                ClearDataForm();
                $scope.disableCtrForm = false;
                $scope.disableCtrFormCount = false;
                $scope.disableCtrFormRd = false;
                enableGrid(false);
                return true;
            }
        };
        var resultHandler = function (result, notifyP) {
            if (result.Success) {
                notify.success(notifyP);
                if ($scope.AssignLicense.Regions.FieldItemsOrder == "2")//"انفرادی")
                {
                    $state.go('home.tab.assignLicenseOrgUnits.list');
                }
                else
                {
                    initializeForm();
                    regionGridSetLoad();
                }
            }
            else {
                errorHandler.ShowError(result);
            }
            return result.Success;
        }
        $scope.doApplay = function () {
            debugger;
            var defferd = $q.defer();
            GetDataForm();
            $scope.ValidationDataFrom().then(function (result) {
                if (result) {
                    if ($scope.formOperationState === pnenum.pnformstate.insert) {
                        remoteService.post($scope.AssignLicense.Regions, WebAccess + "api/AssignLicense/CreateAssignLicense").then(function (result) {
                            var notifyP = { message: pnMessage.common.successfullInsert, title: pnMessage.common.insert };
                            var resultStatus = resultHandler(result, notifyP);
                            defferd.resolve(resultStatus);
                        });
                    }
                    else if ($scope.formOperationState === pnenum.pnformstate.update) {
                        remoteService.post($scope.AssignLicense.Regions, WebAccess + "api/AssignLicense/UpdateAssignLicense").then(function (result) {
                            var notifyP = { message: pnMessage.common.SuccessfullUpdate, title: pnMessage.common.update };
                            var resultStatus = resultHandler(result, notifyP);
                            defferd.resolve(resultStatus);
                        });
                    }
                }
                else
                    defferd.resolve(false);
            });
            return defferd.promise;
        };

        // اعتبار سنجی اطلاعات
        $scope.ValidationDataFrom = function () {

            var defferd = $q.defer();

            var resultValidation = {
                ErrorMessage: null,
                ValidationErrors: []
            };

            if ($scope.createForm.$valid == false)
                var resultValidation = validator.Validate($scope.createForm);


            if ($scope.AssignLicense.Regions.ParentId == null || $scope.AssignLicense.Regions.ParentId == "")
                resultValidation.ValidationErrors.push({ ErrorMessage: "هیچ مجوزی در سطح استان انتخاب نشده است" });
            if ($scope.AssignLicense.Regions.OrgUnitsID == null || $scope.AssignLicense.Regions.OrgUnitsID == "")
                resultValidation.ValidationErrors.push({ ErrorMessage: "منطقه انتخاب نشده است" });
            //************************************************************************************************************************************
            if (parseInt($scope.AssignLicense.Regions.Count) < parseInt($scope.AssignLicense.Regions.CountTotal))
                resultValidation.ValidationErrors.push({ ErrorMessage: " تعداد اشخاص انتخاب شده  نباید از تعداد افراد مورد نظر  بیشتر باشد" });
                //*****************************************************************************************************************************
            else {
                if ($scope.AssignLicense.Regions.FieldItemsOrder == "2")//انفرادی 
                {
                    //if ($scope.AssignLicense.Regions.CountTotal == null || $scope.AssignLicense.Regions.CountTotal == "")
                    //    resultValidation.ValidationErrors.push({ ErrorMessage: "هیچ فردی انتخاب نشده است" });
                    //else
                    if (parseInt($scope.AssignLicense.Regions.CountTotal) > 1)
                        resultValidation.ValidationErrors.push({ ErrorMessage: "باید فقط یک نفر انتخاب شود بیش از یک نفر انتخاب شده است" });

                    else {
                        $scope.AssignLicense.Regions.CountMen = $scope.AssignLicense.Regions.MenCountTotal;
                        $scope.AssignLicense.Regions.CountWomen = $scope.AssignLicense.Regions.WomenCountTotal;
                    }
                }

                else
                    if ($scope.AssignLicense.Regions.FieldItemsOrder == "1")//گروهی
                    {
                        if ($scope.AssignLicense.Regions.MenCount == "0" && $scope.AssignLicense.Regions.WomenCount == "0")
                            resultValidation.ValidationErrors.push({ ErrorMessage: "تعداد زن و مرد خالی است" });
                        else if (parseInt($scope.AssignLicense.Regions.MenCount) + parseInt($scope.AssignLicense.Regions.WomenCount) != parseInt($scope.AssignLicense.Regions.Count))
                            resultValidation.ValidationErrors.push({ ErrorMessage: "تعداد وارد شده با مجموع تعداد زن و مرد برابر نیست" });
                        else if ($scope.AssignLicense.Regions.MenCount < $scope.AssignLicense.Regions.MenCountTotal)
                            resultValidation.ValidationErrors.push({ ErrorMessage: " تعداد مرد انتخاب شده  نباید از تعداد مرد مورد نظر  بیشتر باشد" });
                        else if ($scope.AssignLicense.Regions.WomenCount < $scope.AssignLicense.Regions.WomenCountTotal)
                            resultValidation.ValidationErrors.push({ ErrorMessage: " تعداد زن انتخاب شده  نباید از تعداد زن مورد نظر  بیشتر باشد" });

                    }
            }

            if (resultValidation.ValidationErrors.length > 0) {
                errorHandler.ShowError(resultValidation);
                defferd.resolve(false);
            }
            else
                defferd.resolve(true);


            //*******************************************************************************

            return defferd.promise;
        };
        //******************************************* 
     
    }]);
});
