define(["areas/inf/app.areas.inf"], function (inf) {
    inf.register.controller("fieldGroupCreateController", ["$scope", "pn.remote.service", "pn.enum", "pn.dialog", "pn.errorHandler"
        , "pn.focus", "Notification", "infWebAccess", "$window", "pn.message", "cache", "$state", "$q", "pn.validator",
    function ($scope, remoteService, pnenum, dialog, errorHandler, focus, notify, WebAccess, $window, pnMessage, cache, $state, $q, validator) {

        $scope.TypeArray = [];
        $scope.FieldGroup = {};
        $scope.disableCtrForm = false;
        //برگشت به حالت اولیه دکمه ها
        $scope.$emit("toolbar:DoRibbonFalse");

        $scope.objkendoTypeSelect;
        $scope.objoptionsTypeSelect;
        //**********************************************************************************

        //lookup مناطق
        $scope.optionsType = {
            allowDuplicate: true,
            required: true,
            lookup: {
                fields: [
                         { latinName: "SYST3_Types_Code", persianName: "کد", length: 0, minRange: null, maxRange: null, allowDuplicate: false, required: false, typeKey: 101, items: null, showInSearchPanel: false, showInGrid: false },
                         { latinName: "SYST3_Types_Title", persianName: "نوع مربوط به گروه", length: 10, minRange: null, maxRange: null, allowDuplicate: false, required: false, typeKey: 104, items: null, showInSearchPanel: true, showInGrid: true, }
                ],

                url:  WebAccess + "api/InfOData/Get",
                table: 'SYST.SYST3_Types',
                textField: "SYST3_Types_Title",
                valueField: "SYST3_Types_Code",
            },

        }
        $scope.$watch('optionsType.value', function () {
            if ($scope.optionsType.value != null) {
                 if ($scope.optionsType.value != "") {
                    var info = { FieldGroupKey: null, TypeCode: $scope.optionsType.value, DescType: $scope.optionsType.text };
                    AddtoArray(info);
                }
            }
        });

        //*************************************************************************************************************************************************************

        //گرید مربوط به لیست نوع گروه بندی ها    
        $scope.selectedItemsListType = [];

        //انتخاب اولین سطر بطور پیش فرض
        $scope.gridListType_onDataBound = function (kendo) {
            kendo.select(kendo.tbody.find('tr:first'));
        }

        $scope.TypeSelect_onKendoReady = function (kendo, options) {
            $scope.objkendoTypeSelect = kendo;
            $scope.objoptionsTypeSelect = options;
            $scope.objoptionsTypeSelect.dataSource = $scope.TypeArray;
            $scope.objkendoTypeSelect.setOptions($scope.objoptionsTypeSelect);           
        }

        $scope.gridConfigListType = {
            inlineOperationalUrl: {
                read: {
                    url: null, 
                    data: function () { return $scope.filterQuery; }
                }
            },

            pageSizes: [5, 10, 15, 20, 25, 30, "All"]
        };
        $scope.gridColumnsListType = [{ field: "DescType", editable: false, title: "نوع داده مربوط به گروه بندی", allownull: false}]
        $scope.gridSchemaListType = { model: { id: "Id", fields: { Code: { type: "number", editable: false } } }, data: "Entities", total: "TotalCount" };




        //اضافه کردن عنصر به ارایه
        function AddtoArray(info) {


            debugger;
            var resultSearch = -1;
            for (var i = 0; i < $scope.TypeArray.length; i++) {
                if ($scope.TypeArray[i].TypeCode == info.TypeCode) {
                    resultSearch = i;
                }
            }

            if (resultSearch == -1) {
                $scope.TypeArray.push(info);
                FillDataSourceGrid();

            }

            else {
                var resultValidation = { ErrorMessage: null, ValidationErrors: [] };
                resultValidation.ValidationErrors.push({ ErrorMessage: pnMessage.common.errorRepeat });
                errorHandler.ShowError(resultValidation);
            }
        };
        //
        function FillDataSourceGrid()
        {
            debugger;
            var pageSize = $scope.objkendoTypeSelect.dataSource.pageSize();
            $scope.objoptionsTypeSelect.dataSource = $scope.TypeArray;
            $scope.objkendoTypeSelect.setOptions($scope.objoptionsTypeSelect);
            if (pageSize == null)
                $scope.objkendoTypeSelect.dataSource.pageSize(10);
           else if (pageSize !=5 || pageSize!=10 || pageSize!=20)
                $scope.objkendoTypeSelect.dataSource.pageSize(10);
           else
                $scope.objkendoTypeSelect.dataSource.pageSize(pageSize);
        }
        //حذف از ارایه
        $scope.removeFromArray = function () {
            var resultSearch = -1;
            if ($scope.selectedItemsListType.length > 0) {
                for (var i = 0; i < $scope.TypeArray.length; i++) {
                    if ($scope.TypeArray[i].TypeCode == $scope.selectedItemsListType[0].TypeCode) {
                        resultSearch = i;
                    }
                }
            };
            if (resultSearch != -1) {

                $scope.TypeArray.splice(resultSearch, 1);
                FillDataSourceGrid();
            }
            else {
                var resultValidation = { ErrorMessage: null, ValidationErrors: [] };
                resultValidation.ValidationErrors.push({ ErrorMessage: pnMessage.common.errorDelete });
                errorHandler.ShowError(resultValidation);
            }
        };

        //*************************************************************************************************************************************************************

        // Initilize Form Data
        function initializeForm() {
            $scope.formOperationState = cache.infCache.FieldGroup.formOperationState;
            ClearDataForm();
            switch (cache.infCache.FieldGroup.formOperationState) {
                case pnenum.pnformstate.insert:
                    $scope.showUI = true;
                    break;
                case pnenum.pnformstate.update:
                    if (cache.infCache.FieldGroup == null)
                        $scope.showUI = false;
                    else {
                        $scope.showUI = true;
                        LoadDataForm();
                    }
                    break;
                default:

                    if (cache.infCache.FieldGroup == null)
                        $scope.showUI = false;
                    else {

                        $scope.showUI = true;
                        $scope.disableCtrForm = true;
                        LoadDataForm();
                    }
                    break;

            }





        };
   
        //پاک کردن اطلاعات فرم
        function ClearDataForm() {

            $scope.FieldGroup = {};
            $scope.TypeArray = [];

            if ($scope.objoptionsTypeSelect != null) {
                $scope.objoptionsTypeSelect.dataSource = [];
                $scope.objkendoTypeSelect.setOptions($scope.objoptionsTypeSelect);
            }
            focus.setFocus('$scope.FieldGroup.OrderNo');

        }
        //نمایش اطلاعات
        function LoadDataForm() {

            $scope.FieldGroup = cache.infCache.FieldGroup.Info;
            remoteService.post({ FieldGroupKey: $scope.FieldGroup.Key }, WebAccess + "api/FieldGroupType/GetAllFieldGroupType").then(function (result) {
                debugger;
                $scope.TypeArray = result.Entities;
                FillDataSourceGrid();
            });
        };
        //دریافت اطلاعات
        function GetDataForm() {
            $scope.FieldGroup.TableKey = cache.infCache.FieldGroup.Table.Key;
            $scope.FieldGroup.FieldGroupType = [];
            for (var i = 0; i < $scope.TypeArray.length; i++) {
                $scope.FieldGroup.FieldGroupType.push({ TypeCode: $scope.TypeArray[i].TypeCode, FieldGroupKey: $scope.TypeArray[i].FieldGroupKey });
            }
        }
        //********************************************************************************************************************

        initializeForm();
        //*****************************************************************************************************

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
        $scope.doCancel = function () {
            $state.go('home.tab.fieldGroup.list');
            return true;
        };
        $scope.doApplay = function () {
            var defferd = $q.defer();
            GetDataForm();
            if ($scope.ValidationDataFrom()) {

                if ($scope.formOperationState === pnenum.pnformstate.insert) {
                    remoteService.post($scope.FieldGroup, WebAccess + "api/FieldGroup/CreateFieldGroup").then(function (result) {
                        var notifyP = { message: pnMessage.common.successfullInsert, title: pnMessage.common.insert };
                        var resultStatus = resultHandler(result, notifyP);
                        defferd.resolve(resultStatus);
                    });
                }
                else if ($scope.formOperationState === pnenum.pnformstate.update) {
                   remoteService.post($scope.FieldGroup, WebAccess + "api/FieldGroup/UpdateFieldGroup").then(function (result) {
                        var notifyP = { message: pnMessage.common.SuccessfullUpdate, title: pnMessage.common.update };
                        var resultStatus = resultHandler(result, notifyP);
                        defferd.resolve(resultStatus);
                    });
                }
            }
            else {
                defferd.resolve(false);
            }
            return defferd.promise;
        };


        // اعتبار سنجی اطلاعات
        $scope.ValidationDataFrom = function () {

            var result = {
                ErrorMessage: null,
                ValidationErrors: []
            };

            if ($scope.createForm.$valid == false)
                var result = validator.Validate($scope.createForm);

            //---------------------------------------------------------------------
            if (result.ValidationErrors.length > 0) {
                errorHandler.ShowError(result);
                return false;
            }
            else
                return true;
        };
        //******************************************* 
    }]);
});