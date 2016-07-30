define(["areas/hr/rec/app.areas.hr.rec"], function (rec) {
    rec.register.controller("assignLicenseListController"
        , ["$scope", "$rootScope", "pn.remote.service", "pn.enum", "pn.dialog"
        , "pn.errorHandler", "pn.focus", "Notification", "$state", "recWebAccess", "cache", "pn.message"
   , function ($scope, $rootScope, remoteService, pnenum, dialog, errorHandler, focus, notify, $state, WebAccess, cache, pnMessage) {


        $scope.Personnel = {};
        $scope.Personnel.Attr = {};
        $scope.Personnel.Attr.disabledinfo = true;
        $scope.Personnel.Attr.hidesearch = true;
        $scope.Personnel.Attr.hideiInfo = false;
        $scope.Personnel.Info = {};

        cache.recCache = cache.recCache || {};
        cache.recCache.AssignLicense = {};
        cache.recCache.AssignLicense.RecruitmentLicenseID = cache.recCache.RecruitmentLicense.RecruitmentLicenseID;
        cache.recCache.formOperationState = pnenum.pnformstate.browse;

        $scope.guidEmpty = "00000000-0000-0000-0000-000000000000";
        $scope.selectedItems = [];
        $scope.gridDetailSelectedItems = [];
        $scope.kendo = null;
        $scope.Detailkendo = null;
        //********************************************************************************************************************
        var upperGridSetLoad = function (arg) {
            if (cache.recCache.RecruitmentLicense.RecruitmentLicenseID != null) {
                if (cache.recCache.RecruitmentLicense.RecruitmentLicenseID.toString().length == 36) {
                    var op = $scope.kendo.getOptions();

                    op.dataSource.transport.read.data = { RecruitmentLicenseID: arg }
                    op.dataSource.transport.read.url = WebAccess + "api/assignLicense/GetAssignLicenseSummary";
                    $scope.kendo.setOptions(op);
                };
            }        }

        //*************************************************************************************************************
        $scope.$watch('selectedItems', function (newVal, oldVal) {
            if ($scope.selectedItems.length <= 0)
                return;        
            DetailGridSetLoad();
        });

        $scope.$watch('gridDetailSelectedItems', function (newVal, oldVal) {
            if ($scope.gridDetailSelectedItems.length <= 0)
                return;
            cache.recCache.AssignLicense = $scope.gridDetailSelectedItems[0];
             PersonelGridSetLoad();
        });
       //****************************************************************************************************************************************
        $scope.gridConfig = {
            inlineOperationalUrl: { read: { data: function () { return $scope.filterQuery; } } },
            pageSizes: [5, 10, 15, 20, 25, 30, "All"]
        };

        $scope.onReadyGird = function (kendo) {
            $scope.kendo = kendo;
            upperGridSetLoad(cache.recCache.RecruitmentLicense.RecruitmentLicenseID);          
        };
        //***************************************************************************************************************************************************
    
        $scope.gridDetail_onKendoReady= function(kendo) {
            $scope.Detailkendo = kendo;
        };
       //*****************************************************************************************************************************************************
        $rootScope.$on('someEvent', function (event, args) {
            cache.recCache.RecruitmentLicense.RecruitmentLicenseID = args[0];
            upperGridSetLoad(args[0]);
      
            //خالی کردن گرید
            var op = $scope.Detailkendo.getOptions();
            op.dataSource.transport.read.data = {};
            op.dataSource.transport.read.url = null;
            $scope.Detailkendo.setOptions(op);
          });
        //********************************************************************************************************************************************************************************
        var DetailGridSetLoad = function () {
            var entity = $scope.selectedItems[0];
            var op = $scope.Detailkendo.getOptions();
            op.dataSource.transport.read.data = {
                RecruitmentLicenseID: cache.recCache.RecruitmentLicense.RecruitmentLicenseID,
                OrgUnitsId:entity.OrgUnitsId,
                Type: entity.Type
            };
            op.dataSource.transport.read.url = WebAccess + "api/assignLicense/GetAllAssignLicense";
            $scope.Detailkendo.setOptions(op);
        };
        function PersonelGridSetLoad() {
            debugger;
            if (cache.recCache.AssignLicense.FieldItemsOrder == 1)
                $scope.Personnel.Attr.hideiInfo = true;
            else
                $scope.Personnel.Attr.hideiInfo = false;
            $scope.Personnel.Info = {};
            remoteService.post({ AssignLicenseId: cache.recCache.AssignLicense.Key }, WebAccess + "api/AssignedPersonnel/GetAllAssignedPersonnel").then(function (result) {
                $scope.Personnel.Info = result.Entities[0];


            });
        };



        $scope.gridColumns = [{ field: "StrOrgUnits", editable: false, title: "استان", allownull: false},
                                    { field: "FieldItemsValue", editable: false, title: "نوع مجوز", allownull: false },
                                    { field: "Count", editable: false, title: "تعداد", allownull: false},
                                    { field: "WomenCount", editable: false, title: "تعداد زن", allownull: false},
                                    { field: "MenCount", editable: false, title: "تعداد مرد", allownull: false },
                                    { field: "AssignCount", editable: false, title: "تعداد تخصیص داده شده", allownull: false },
        ];

        $scope.gridSchema = {
            model: { id: "Id", fields: { Code: { type: "number", editable: false } } }
                    , data: "Entities"
                    , total: "TotalCount"
        };

       

        //ریفریش اطلاعات گرید 
        function reloadGridAssignLicense() {
            $scope.gridApi.refresh();
           DetailGridSetLoad();
        }

        //انتخاب اولین سطر بطور پیش فرض
        $scope.grid_onDataBound = function (kendo) {
            kendo.select(kendo.tbody.find('tr:first'));
        }
        
        //*************************************************************************************************************
        //گرید

        $scope.gridDetailConfig = {
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
        $scope.gridDetailColumns = [
                                    { field: "EmployTypeValue", editable: false, title: "نوع استخدام", allownull: false},
                                    { field: "OrgPositionValue", editable: false, title: "پست سازمانی", allownull: false },
                                    { field: "EducationalDegreesValueFrom", editable: false, title: "از مدرک تحصیلی", allownull: false },
                                    { field: "EducationalDegreesValueTo", editable: false, title: "تا مدرک تحصیلی", allownull: false},
                                    { field: "StrActive", editable: false, title: "فعال", allownull: false },
                                    { field: "Count", editable: false, title: "تعداد", allownull: false},
                                    { field: "WomenCount", editable: false, title: "تعداد زن", allownull: false },
                                    { field: "MenCount", editable: false, title: "تعداد مرد", allownull: false},
                                    { field: "MaxAge", editable: false, title: "حداکثر سن", allownull: false},
                                    { field: "Desc", editable: false, title: "توضیحات", allownull: false },
        ];
        $scope.gridDetailSchema  = {
            model: { id: "Id", fields: { Code: { type: "number", editable: false } } }
                    , data: "Entities"
                    , total: "TotalCount"
        };
        //*********************************************************************************************
 
                //تنظیمات پیش فرض فرم
        function initializeForm() {

            //برگشت به حالت اولیه دکمه ها
            $scope.$emit("toolbar:DoRibbonTrue");
        };      
        //***********************************************************************************************************
        $scope.doInsert = function () { return Insert(); }
        $scope.doEdit = function () { return Edit(); }
        $scope.doDelete = function () { return Delete(); };
        $scope.doCancel = function () {
            return true;
        };

        //**********************************************************************
        function Delete() {
            var resultDelete = false;
            dialog.showYesNo(pnMessage.common.note, "ایتم مورد نظر خود را جهت حذف اطلاعات انتخاب کنید", "پرسنل انتخابی", "مجوز انتخابی استان").then(function (result) {
                if (result == null) { return resultDelete; }
                //AssignLicense
                if (result == false)
                    resultDelete = Delete_AssignLicense();

                    //AssignLicensePersonel
                else
                    resultDelete = Delete_AssignLicensePersonel();


            });
        }
                var resultHandler = function (result, notifyP) {
            if (result.Success) {
                notify.success(notifyP);
            }
            else {
                errorHandler.ShowError(result);
            }
            return result.Success;
        }
        function Delete_AssignLicense() {
        debugger;
            var resultDelete = false;
            if (cache.recCache.AssignLicense == null)
                notify.error({ message: pnMessage.common.errorDelete, title: pnMessage.common.error });

            else if (cache.recCache.AssignLicense.Key == null)
                notify.error({ message: pnMessage.common.errorDelete, title: pnMessage.common.error });

          
            else if( $scope.Personnel.Info!=null)
            {  if( $scope.Personnel.Info.PKey !=null)
                notify.error({ message: "مجوز مورد نظر دارای پرسنل می باشد امکان حذف وجود ندارد", title: pnMessage.common.error });
            }
            else {

                dialog.showYesNo(pnMessage.common.note, pnMessage.common.deleteSure, pnMessage.common.yes, pnMessage.common.no).then(function (resultConfrim) {
                    if (resultConfrim == null) { return resultDelete; }

                    else if (resultConfrim == true) {
                        remoteService.post(cache.recCache.AssignLicense, WebAccess + "api/AssignLicense/DeleteAssignLicense").then(function (resultDeleteReq) {
                            var notifyP = { message: pnMessage.common.successfullDelete, title: pnMessage.common.delete };
                            resultDelete = resultHandler(resultDeleteReq, notifyP);
                            reloadGridAssignLicense();
                        });

                    }
                });
            }

            return resultDelete;
        }
        function Delete_AssignLicensePersonel() {
            debugger;
            var resultDelete = false;
            if ($scope.Personnel.Info == null)
                notify.error({ message: pnMessage.common.errorDelete, title: pnMessage.common.error });
            else if (   $scope.Personnel.Info.PKey == null)
                notify.error({ message: pnMessage.common.errorDelete, title: pnMessage.common.error });
            else {

                dialog.showYesNo(pnMessage.common.note, pnMessage.common.deleteSure, pnMessage.common.yes, pnMessage.common.no).then(function (resultConfrim) {
                    if (resultConfrim == null) { return resultDelete; }

                    else if (resultConfrim == true) {
                        remoteService.post({ Key: $scope.Personnel.Info.PKey }, WebAccess + "api/AssignedPersonnel/DeleteAssignedPersonnel").then(function (resultDeleteReq) {
                            var notifyP = { message: pnMessage.common.successfullDelete, title: pnMessage.common.delete };
                            resultDelete = resultHandler(resultDeleteReq, notifyP);
                            PersonelGridSetLoad();

                        });

                    }
                });
            }

            return resultDelete;
        }
        function Insert() {
            cache.recCache.formOperationState = pnenum.pnformstate.insert;
            $state.go('home.tab.assignLicense.create');
            return true;

        };
        function Edit() {
            var result = false;
            if (cache.recCache.AssignLicense.Key == null)
                notify.error({ message: pnMessage.common.errorUpdate, title: pnMessage.common.error });
            else {
                remoteService.post({ ParentID: cache.recCache.AssignLicense.Key, }, WebAccess + "api/assignLicense/GetExistsAssignLicenseRegion").then(function (resultReq) {
                    if (resultReq.Entities.length > 0)
                        notify.error({ message: "برای این تخصیص در سطح منطقه مجوز تخصیص داده شده است بنابراین امکان ویرایش وجود ندارد", title: pnMessage.common.error });
                    else {
                        cache.recCache.formOperationState = pnenum.pnformstate.update;
                        $state.go('home.tab.assignLicense.create');
                        result = true;
                    }
                });
            }
            return result;
        };
        //*****************************************************************************************************
        initializeForm();

    }]);
});