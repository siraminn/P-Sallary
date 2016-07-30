define(["areas/hr/rec/app.areas.hr.rec"], function (rec) {
    rec.register.controller("assignLicenseCreateController", ["$scope", "pn.remote.service", "pn.enum", "pn.dialog", "pn.focus", 
    "Notification", "recWebAccess", "cache", "$state", "pn.errorHandler", "pn.validator", "$q", "pn.message",
    function ($scope, remoteService, pnenum, dialog, focus, notify, WebAccess, cache, $state, errorHandler, validator, $q,pnMessage) {

        //  *************************************************************************************************************
        $scope.guidEmpty = "00000000-0000-0000-0000-000000000000";
        $scope.FieldItems = {};
        $scope.AssignLicense = {};
        $scope.AssignLicense.AssignedPersonnel = [];
        $scope.AssignLicense.AssignedPersonnel.push({ EmployeesId: "" });
        $scope.OrgUnits = {};
        $scope.showUI = false;
        //***********************************************************************************************************************

        //lookup پرسنلی
        $scope.Personnel = {};
        $scope.Personnel.Attr = {};
        $scope.Personnel.Attr.disabledinfo = true;
        $scope.Personnel.Attr.hidesearch = false;
        $scope.Personnel.Attr.hideiInfo = false;
        $scope.Personnel.Info = {};
        $scope.optionsPersonnel = {
            allowDuplicate: true,
            required: true,
            lookup: { 
                fields: [ 
                         { latinName: "NationalID", persianName: "کد ملی",  typeKey: 101, items: null, showInSearchPanel: true, showInGrid: true, },
                         { latinName: "FirstName",  persianName: "نام", typeKey: 104, items: null, showInSearchPanel: true, showInGrid: true, },
                         { latinName: "LastName",persianName: "نام خانوادگی", typeKey: 104, items: null, showInSearchPanel: true, showInGrid: true, },
                         { latinName: "FatherName", persianName: "نام پدر",  typeKey: 104, items: null, showInSearchPanel: true, showInGrid: true, },
                ],

                filter: {
                    Logic: "and",
                    filters: [
                                  { field: "ORGT1_OrgUnits_Pkey", Value: $scope.guidEmpty, ParameterName: "p0", operator: "eq", dataType: 104, }
                                , { field: "EducationalDegreesFrom", Value: cache.recCache.AssignLicense.EducationalDegreesIdFrom, ParameterName: "p0", operator: "eq", dataType: 104, }
                                , { field: "EducationalDegreesTo", Value: cache.recCache.AssignLicense.EducationalDegreesIdTo, ParameterName: "p0", operator: "eq", dataType: 104, }
                    ]
                },

    

                url: WebAccess + "/api/EmployeeLookupService/Get",
                textField: "LastName",
                valueField: "Key",

            },

        }
        $scope.$watch('optionsPersonnel.value', function () {
            if ($scope.optionsPersonnel.value != null) {
                if ($scope.optionsPersonnel.value != "") {
                    $scope.AssignLicense.optionsPersonnelId = $scope.optionsPersonnel.value;
                    remoteService.post({ EmployeeKey: $scope.optionsPersonnel.value }, WebAccess + "api/EmpForRec/GetEmployeebyKey").then(function (result) {
                        $scope.Personnel.Info = result.Entity;
                    });
                }
            }
        });
        $scope.$watch('optionsPersonnel.lookup.filter.filters[0].Value', function () {
            $scope.apiPersonnel.refreshGrid();

            $scope.Personnel.Info = {};
            $scope.Personnel.Info.Key = null;
            $scope.optionsPersonnel.value = null;
            $scope.optionsPersonnel.text = null;
        });
        $scope.$watch('optionsPersonnel.lookup.filter.filters[1].Value', function () {
            $scope.apiPersonnel.refreshGrid();

            $scope.Personnel.Info = {};
            $scope.Personnel.Info.Key = null;
            $scope.optionsPersonnel.value = null;
            $scope.optionsPersonnel.text = null;
        });
        $scope.$watch('optionsPersonnel.lookup.filter.filters[2].Value', function () {
            $scope.apiPersonnel.refreshGrid();

            $scope.Personnel.Info = {};
            $scope.Personnel.Info.Key = null;
            $scope.optionsPersonnel.value = null;
            $scope.optionsPersonnel.text = null;
        });

        //*******************************************************************************************
        //lookup استان
        $scope.optionsOrgUnits = {
            required: true,
            lookup: {
                fields: [
                          { latinName: "Description", persianName: "استان",  typeKey: 104,  showInSearchPanel: true, showInGrid: true, }
                ],
                url: WebAccess + "/api/OrgForRec/GetProvinces/",
                textField: "Description",
                valueField: "Key",
            },

        }
        $scope.$watch('optionsOrgUnits.value', function () {
            if ($scope.optionsOrgUnits.value != null) {
                if ($scope.optionsOrgUnits.value != "") {
                    $scope.AssignLicense.OrgUnitsID = $scope.optionsOrgUnits.value;
                    $scope.optionsPersonnel.lookup.filter.filters[0].Value = $scope.AssignLicense.OrgUnitsID;
                }
            }
        });
        //*******************************************************************************************
        //lookup نوع استخدام
        $scope.optionsEmployType = {
            allowDuplicate: true,
            required: true,
            lookup: {
                fields: [
                        { latinName: "Decription", persianName: "نوع استخدام", typeKey: 104, showInSearchPanel: true, showInGrid: true, },
                ],
                url: WebAccess + "api/EmpForRec/GetEmployeeType/",
                textField: "Decription",
                valueField: "Key",

            },

        }
        $scope.$watch('optionsEmployType.value', function () {
            if ($scope.optionsEmployType.value != null) {
                if ($scope.optionsEmployType.value != "") {
                    $scope.AssignLicense.EmployTypeId = $scope.optionsEmployType.value;
                }
            }
        });
        //*******************************************************************************************
        //lookup پست سازمانی
        $scope.optionsOrgPosition = {
            allowDuplicate: true,
            required: true,
            lookup: {
                fields: [
                           { latinName: "Description", persianName: "پست سازمانی",typeKey: 104, showInSearchPanel: true, showInGrid: true, },
                ],
                url: WebAccess + "api/OrgForRec/GetPosition",
                textField: "Description",
                valueField: "Key",

            },

        }
        $scope.$watch('optionsOrgPosition.value', function () {
            if ($scope.optionsOrgPosition.value != null) {
                if ($scope.optionsOrgPosition.value != "") {
                    $scope.AssignLicense.OrgPositionId = $scope.optionsOrgPosition.value;
                }
            }
        });
        //*******************************************************************************************
        //lookup مدرک تخصیلی
        $scope.optionsEducationalDegreesFrom = {
            allowDuplicate: true,
            required: true,
            lookup: {
                fields: [
                          { latinName: "Description", persianName: "مدرک تحصیلی", typeKey: 104,showInSearchPanel: true, showInGrid: true, },
                ],
                url: WebAccess + "api/BaseInformationForRec/GetEducationalDegree",
                textField: "Description",
                valueField: "Key",

            },

        }
        $scope.$watch('optionsEducationalDegreesFrom.value', function () {
            if ($scope.optionsEducationalDegreesFrom.value != null) {
                if ($scope.optionsEducationalDegreesFrom.value != "") {
                    $scope.AssignLicense.EducationalDegreesIdFrom = $scope.optionsEducationalDegreesFrom.value;
                    $scope.optionsPersonnel.lookup.filter.filters[1].Value = $scope.AssignLicense.EducationalDegreesIdFrom;
                }
            }
        });
        //*****************************************************************************************************************************
        //lookup مدرک تخصیلی
        $scope.optionsEducationalDegreesTo = {
            allowDuplicate: true,
            required: true,
            lookup: {
                fields: [
                          { latinName: "Description", persianName: "مدرک تحصیلی", typeKey: 104, showInSearchPanel: true, showInGrid: true, },
                ],
                url: WebAccess + "api/BaseInformationForRec/GetEducationalDegree",
                textField: "Description",
                valueField: "Key",

            },

        }
        $scope.$watch('optionsEducationalDegreesTo.value', function () {
            if ($scope.optionsEducationalDegreesTo.value != null) {
                if ($scope.optionsEducationalDegreesTo.value != "") {
                    $scope.AssignLicense.EducationalDegreesIdTo = $scope.optionsEducationalDegreesTo.value;
                    $scope.optionsPersonnel.lookup.filter.filters[2].Value = $scope.AssignLicense.EducationalDegreesIdTo;

                }
            }
        });
        //**********************************************************************************************************************************************

        $scope.ChangeFieldItems = function () {

            if ($scope.AssignLicense.Order == "2")//"انفرادی")
            {
                $scope.disableCtrFormCount = true;
                $scope.AssignLicense.Count = 1;
                $scope.AssignLicense.WomenCount = "";
                $scope.AssignLicense.MenCount = "";
                $("#Count").removeAttr("required");
                $scope.Personnel.Attr.hidesearch = false;
                $scope.Personnel.Attr.hideiInfo = false;
            }
            else {
                $scope.disableCtrFormCount = false;
                $scope.AssignLicense.Count = "";
                $scope.AssignLicense.WomenCount = "";
                $scope.AssignLicense.MenCount = "";
                $("#Count").attr("required", "required");
                $scope.Personnel.Attr.hidesearch = true;
                $scope.Personnel.Attr.hideiInfo = true;
            }
        };
        function GetFieldItems() {
            remoteService.post({Code:4}, WebAccess + "api/InfForRec/GetItemGroup").then(function (result) {
                $scope.FieldItems = result.Entities[0].FieldItems;
            });
        };
        //*******************************************************************************************************

        function DisableForm(value) {
            $scope.disableCtrForm = value;
            $scope.disableCtrFormCount = value;
            focus.setFocus('$scope.AssignLicense.OrgUnitsID');
        };

        function initializeForm() {
            $scope.showUI = true;
            DisableForm(false);

            if (cache.recCache.formOperationState == pnenum.pnformstate.insert) {
                ClearDataForm();
            }
            else {
                if (cache.recCache == null || cache.recCache.AssignLicense == null || cache.recCache.AssignLicense.Key == null) {
                    $scope.showUI = false;
                    return;

                }
                else {
                 
                    if (cache.recCache.formOperationState == pnenum.pnformstate.update) 
                        $scope.formOperationState = pnenum.pnformstate.update;        
                    else if (cache.recCache.formOperationState == pnenum.pnformstate.browse) {
                        $scope.formOperationState = pnenum.pnformstate.browse;
                        DisableForm(true);
                    }

                    LoadDataForm();
                }
            }  
            //برگشت به حالت اولیه دکمه ها
            $scope.$emit("toolbar:DoRibbonFalse");

        };

        function ClearDataForm() {
            $scope.formOperationState = pnenum.pnformstate.insert;
            $scope.AssignLicense={}
            $scope.AssignLicense.RecruitmentLicenseID = cache.recCache.AssignLicense.RecruitmentLicenseID;

            $scope.Personnel.Attr.hidesearch = true;
            $scope.Personnel.Attr.hideiInfo = true;
            $scope.Personnel.Info = {};
            $scope.Personnel.Info.Key=null;

            $scope.optionsEducationalDegreesFrom.value = "";
            $scope.optionsEducationalDegreesTo.value = "";
            $scope.optionsOrgUnits.value = "";
            $scope.optionsOrgPosition.value = "";
            $scope.optionsEmployType.value = "";
            $scope.optionsPersonnel.value = "";


            $scope.optionsEducationalDegreesFrom.text = "";
            $scope.optionsEducationalDegreesTo.text = "";
            $scope.optionsOrgUnits.text = "";
            $scope.optionsOrgPosition.text = "";
            $scope.optionsEmployType.text = "";
            $scope.optionsPersonnel.text = "";;



        };
       
        //نمایش اطلاعات
        function LoadDataForm() {
            $scope.AssignLicense = cache.recCache.AssignLicense;
            $scope.AssignLicense.Order = cache.recCache.AssignLicense.FieldItemsOrder;

            if ($scope.AssignLicense.Order == "2")//"انفرادی")
            {
                $scope.disableCtrFormCount = true;
                $scope.Personnel.Attr.hidesearch = false;
                $scope.Personnel.Attr.hideiInfo = false;
            }
            else {
                $scope.disableCtrFormCount = false;
                $scope.Personnel.Attr.hidesearch = true;
                $scope.Personnel.Attr.hideiInfo = true;
            }
            $scope.optionsPersonnel.value = cache.recCache.AssignLicense.EmployID;
            $scope.optionsPersonnel.lookup.filter.filters[0].Value = $scope.AssignLicense.OrgUnitsID;
            //دریافت اطلاعات پرسنل
            if ($scope.AssignLicense.Order == 2)
            {
                remoteService.post({ AssignLicenseId: $scope.AssignLicense.Key }, WebAccess + "api/AssignedPersonnel/GetAllAssignedPersonnel").then(function (result) {
                    $scope.Personnel.Info = result.Entities[0];
                });
            }


            $scope.optionsOrgUnits.showValue = cache.recCache.AssignLicense.OrgUnitsValue;
            $scope.optionsOrgPosition.showValue = cache.recCache.AssignLicense.OrgPositionValue;
            $scope.optionsEducationalDegreesFrom.showValue = cache.recCache.AssignLicense.EducationalDegreesValueFrom;
            $scope.optionsEducationalDegreesTo.showValue = cache.recCache.AssignLicense.EducationalDegreesValueTo;
            $scope.optionsEmployType.showValue = cache.recCache.AssignLicense.EmployTypeValue;
            $scope.optionsPersonnel.showValue = cache.recCache.AssignLicense.EmployLastName;
            $scope.AssignLicense.AssignedPersonnel = [];
            $scope.AssignLicense.AssignedPersonnel.push({ EmployeesId: "" });
        }
        //دریافت اطلاعات
        function GetDataForm() {
            if(  $scope.AssignLicense.WomenCount == "")
                $scope.AssignLicense.WomenCount = "0";

            if ($scope.AssignLicense.MenCount == "")
                $scope.AssignLicense.MenCount = "0";


            for (var i = 0; i < $scope.FieldItems.length; i++) {
                if ($scope.FieldItems[i].Order == $scope.AssignLicense.Order)
                    $scope.AssignLicense.FieldItemsID = $scope.FieldItems[i].FieldItemId;
            }
            if ($scope.AssignLicense.Active == null || $scope.AssignLicense.Active == "")
                $scope.AssignLicense.Active = false;

                       $scope.AssignLicense.FieldItemsValue=$scope.AssignLicense.Order;
                      
                  
                           $scope.AssignLicense.AssignedPersonnel = [];       
            if ($scope.AssignLicense.Order == "2")//"انفرادی")
            {
                if ($scope.Personnel.Info.Key != null) {
                    if ($scope.Personnel.Info.Key != "") {
         
                        $scope.AssignLicense.AssignedPersonnel.push({ EmployeeId: $scope.Personnel.Info.Key });
                        switch($scope.Personnel.Info.SexValue)
                        {
                            case "زن":
                                $scope.AssignLicense.MenCount = "0";
                                $scope.AssignLicense.WomenCount = "1";
                                break;
                            case "مرد":
                                $scope.AssignLicense.WomenCount = "0";
                                $scope.AssignLicense.MenCount = "1";
                                break;
                        }
                    }
                }
            }
        };

        //********************************************************************************************************************
        GetFieldItems();
        initializeForm();
        //****************************************************************************************************

       var resultHandler = function (result, notifyP) {
                if (result.Success) {
                    notify.success(notifyP);
                    initializeForm();
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
            if ($scope.ValidationDataFrom()) {
                $scope.AssignLicense.RecruitmentLicenseID = cache.recCache.RecruitmentLicense.RecruitmentLicenseID;

                if ($scope.formOperationState === pnenum.pnformstate.insert) {
                   remoteService.post($scope.AssignLicense, WebAccess + "api/AssignLicense/CreateAssignLicense").then(function (result) {
                        var notifyP = { message: pnMessage.common.successfullInsert, title: pnMessage.common.insert };
                        var resultStatus = resultHandler(result, notifyP);
                        defferd.resolve(resultStatus);
                    });
                }
                else if ($scope.formOperationState === pnenum.pnformstate.update) {
                      remoteService.post($scope.AssignLicense, WebAccess + "api/AssignLicense/UpdateAssignLicense").then(function (result) {
                        var notifyP = { message: pnMessage.common.SuccessfullUpdate, title: pnMessage.common.update };
                        var resultStatus = resultHandler(result, notifyP);
                        defferd.resolve(resultStatus);
                    });
                }
            }
            else {
                defferd.resolve(false);
            }
            //return defferd.promise;
            return false;
        };

        $scope.doCancel = function () {
            $state.go('home.tab.assignLicense.list');
            return true;
        };
        // اعتبار سنجی اطلاعات
        $scope.ValidationDataFrom = function ()
        {        
        
        var result = {
                    ErrorMessage: null,
                    ValidationErrors: []
                };

          if ($scope.createForm.$valid==false)   
           var result  = validator.Validate($scope.createForm);    
          
       
            if ($scope.AssignLicense.OrgUnitsID == null || $scope.AssignLicense.OrgUnitsID == "")
                    result.ValidationErrors.push({ ErrorMessage: "استان انتخاب نشده است" });
            if ($scope.AssignLicense.OrgPositionId==null||$scope.AssignLicense.OrgPositionId=="")
                    result.ValidationErrors.push({ ErrorMessage: " پست سازمانی انتخاب نشده است" });
            if ($scope.AssignLicense.EmployTypeId == null || $scope.AssignLicense.EmployTypeId== "")
                    result.ValidationErrors.push({ ErrorMessage: "نوع استخدام انتخاب نشده است" });
            if ($scope.AssignLicense.EducationalDegreesIdFrom == null || $scope.AssignLicense.EducationalDegreesIdFrom == "")
                result.ValidationErrors.push({ ErrorMessage: " (از) "+"مدرک تحصیلی انتخاب نشده است" });
            if ($scope.AssignLicense.EducationalDegreesIdTo == null || $scope.AssignLicense.EducationalDegreesIdTo == "")
                result.ValidationErrors.push({ ErrorMessage:" (تا) "+ "مدرک تحصیلی انتخاب نشده است" });
                if (parseInt($scope.AssignLicense.MaxAge) >100)
                    result.ValidationErrors.push({ ErrorMessage: "سن وارد شده معتبر نیست" });

            //***************************************************************************************************************************************
                if ($scope.AssignLicense.EducationalDegreesIdFrom != null && $scope.AssignLicense.EducationalDegreesIdFrom!="" &&
                      $scope.AssignLicense.EducationalDegreesIdTo != null && $scope.AssignLicense.EducationalDegreesIdTo != "")
                    if (parseInt($scope.AssignLicense.EducationalDegreesIdFrom) > parseInt($scope.AssignLicense.EducationalDegreesIdTo))
                        result.ValidationErrors.push({ ErrorMessage: "از مدرک تحصیلی برزگتر از تا مدرک تحصیلی است" });

            //*****************************************************************************************************************************
                if ($scope.AssignLicense.Order == "2") {
                    if(   
                        $scope.AssignLicense.AssignedPersonnel==null ||  
                        $scope.AssignLicense.AssignedPersonnel[0].EmployeeId == null||
                        $scope.AssignLicense.AssignedPersonnel[0].EmployeeId == "")
                    {
                        result.ValidationErrors.push({ ErrorMessage: "هیچ پرسنلی انتخاب نشده است" });
                    }

                }
                else
                    if ($scope.AssignLicense.Order == "1")//گروهی
                {
                        if($scope.AssignLicense.MenCount=="0" && $scope.AssignLicense.WomenCount=="0")
                            result.ValidationErrors.push({ ErrorMessage: "تعداد زن و مرد خالی است" });
                        else if (parseInt($scope.AssignLicense.MenCount) +parseInt( $scope.AssignLicense.WomenCount) != parseInt($scope.AssignLicense.Count))
                           result.ValidationErrors.push({ ErrorMessage: "تعداد وارد شده با مجموع تعداد زن و مرد برابر نیست" });
               }
            //*******************************************************************************
                if (result.ValidationErrors.length > 0) 
                {
                errorHandler.ShowError(result);
                return false;
            }
            else
                return true;
        };

     // **************************************************************************************************************
     
     
    }]);
});
