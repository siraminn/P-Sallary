define(["areas/hr/rec/app.areas.hr.rec"], function (rec) {
    rec.register.controller("assignLicenseOrgUnitsListController", ["$scope", "pn.remote.service", "recWebAccess", "cache"
        , "$rootScope", "$state", "pn.enum", "pn.dialog", "pn.errorHandler", "Notification", "pn.message",
    function ($scope, remoteService, WebAccess, cache, $rootScope, $state, pnenum, dialog, errorHandler, notify, pnMessage) {
        //*****************************************************************************************************************
       //تعریف متغیر های مربوطه

        $scope.guidEmpty = "00000000-0000-0000-0000-000000000000";
        $scope.AssignLicense = {};
        $scope.AssignLicense.Province = {};
        $scope.AssignLicense.Regions = {};
      
        cache.recCache.AssignLicense.Regions = {}; 
        cache.recCache.AssignLicense.formOperationState={};
  

        //****************************************************************************************************************************************
        $rootScope.$on('someEventOrgUnits', function (event) {
              regionGridSetLoad();
              PersonelGridSetLoad($scope.guidEmpty);
             }); 
    
        //برگشت به حالت اولیه دکمه ها
          $scope.$emit("toolbar:DoRibbonTrue");
        //********************************************************************************************************
        //گرید
        //گرید مربوط به مناطق
        $scope.regionkendo = null;
        $scope.onRegionReadyGird = function (regionkendo, options)
        {
            $scope.regionkendo = regionkendo;

            //دربازگشت
          if(cache.recCache.AssignLicense.Province.Key!=null)
             regionGridSetLoad ();

        };

        function regionGridSetLoad() {
            debugger;
            $scope.AssignLicense.Regions = null;
            cache.recCache.AssignLicense.Regions = null;

                $scope.AssignLicense.Province =cache.recCache.AssignLicense.Province;
            var op = $scope.regionkendo.getOptions();

            op.dataSource.transport.read.data = { ParentID: $scope.AssignLicense.Province.Key, };

            op.dataSource.transport.read.url = WebAccess + "api/assignLicense/GetAssignLicenseRegion";
            $scope.regionkendo.setOptions(op);
        };

        $scope.regionSelectedItems = [];
        $scope.$watch('regionSelectedItems', function (newVal, oldVal) {

            if ($scope.regionSelectedItems.length <= 0)
                return;
            cache.recCache.AssignLicense.Regions = $scope.regionSelectedItems[0];
            $scope.AssignLicense.Regions = cache.recCache.AssignLicense.Regions;
            PersonelGridSetLoad(cache.recCache.AssignLicense.Regions.Key);
        });
     

        $scope.gridConfig1 = {
            inlineOperationalUrl: { read: { url: "", data: function () { return $scope.filterQuery; } } },
            pageSizes: [5, 10, 15, 20, 25, 30, "All"]
        };
        $scope.gridColumns1 = [
                                    { field: "OrgUnitsValue", editable: false, title: "نام منطقه", allownull: false},
                                    { field: "FieldItemsValue", editable: false, title: "نوع مجوز", allownull: false },
                                    { field: "Count", editable: false, title: "تعداد", allownull: false },
                                    { field: "WomenCount", editable: false, title: "تعداد زن", allownull: false},
                                    { field: "MenCount", editable: false, title: "تعداد مرد", allownull: false },
                                    { field: "Desc", editable: false, title: "توضیحات", allownull: false},
        ];
        $scope.gridSchema1 = { model: { id: "Id", fields: { Code: { type: "number", editable: false } } }, data: "Entities", total: "TotalCount" };
        $scope.gridRegion_onDataBound = function (kendo) {
            kendo.select(kendo.tbody.find('tr:first'));
        }

        //***********************************************************************************************************************************************
        $scope.personelKendo = null;
        $scope.onPersonelReadyGird = function (personelKendo, options) {
            $scope.personelKendo = personelKendo;

        };
        var PersonelGridSetLoad = function (AssignLicenseId) {

            var op = $scope.personelKendo.getOptions();

            op.dataSource.transport.read.data = {
                AssignLicenseId: AssignLicenseId
            };
            op.dataSource.transport.read.url = WebAccess + "api/assignedPersonnel/GetAllAssignedPersonnel";
            $scope.personelKendo.setOptions(op);
        };


        $scope.gridConfig2 = {
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
$scope.gridColumns2 = [
                            { field: "EmployeeId", editable: false, title: "کد پرسنلی", allownull: false},
                            { field: "NationalId", editable: false, title: "کد ملی", allownull: false },
                            { field: "FirstName", editable: false, title: "نام", allownull: false },
                            { field: "LastName", editable: false, title: "نام خانوادگی", allownull: false},
                            { field: "SexValue", editable: false, title: "جنسیت", allownull: false },
                            { field: "FatherName", editable: false, title: "نام پدر", allownull: false},
        ];
        $scope.gridSchema2 = { model: { id: "Id", fields: { Code: { type: "number", editable: false } } }, data: "Entities", total: "TotalCount" };
        $scope.gridPersonel_onDataBound = function (kendo) {
            kendo.select(kendo.tbody.find('tr:first'));
        }

        $scope.personelSelectedItems = [];
        $scope.$watch('personelSelectedItems', function (newVal, oldVal) {

            if ($scope.personelSelectedItems.length <= 0)
                return;
            $scope.AssignLicense.Regions.Personel = $scope.personelSelectedItems[0];
        });

        //**********************************************************************************************************************************************************************


        $scope.doInsert = function () { return Insert(); }
        $scope.doEdit = function () { return Edit(); }
        $scope.doDelete = function () { return Delete(); }
        $scope.doCancel = function () { $state.go('home.tab.assignLicenseOrgUnits.list');  return true; };
        $scope.doCancel();
        //**********************************************************************
            var resultHandler = function (result, notifyP) {
            if (result.Success) {
                notify.success(notifyP);
     
                regionGridSetLoad();
            }
            else {
                errorHandler.ShowError(result);
            }
            return result.Success;
        }
        function Insert() {
        
            cache.recCache.AssignLicense.formOperationState = pnenum.pnformstate.insert;
            $state.go('home.tab.assignLicenseOrgUnits.create');
            return true;

        };
        function Edit() {

            if ($scope.AssignLicense.Regions == null || $scope.AssignLicense.Regions.Key == null) {
                var objMsg = { message: pnMessage.common.errorUpdate, title: pnMessage.common.error };
                notify.error(objMsg);
                return false;
            }
            else {
                cache.recCache.AssignLicense.formOperationState = pnenum.pnformstate.update;
                $state.go('home.tab.assignLicenseOrgUnits.create');
                return true;
            }
        };

        function Delete() {
            var resultDelete = false;
            dialog.showYesNo(pnMessage.common.note, "ایتم مورد نظر خود را جهت حذف اطلاعات انتخاب کنید", "پرسنل انتخابی", "مجوز انتخابی منطقه").then(function (result) {
                if (result == null) { return resultDelete; }
                //AssignLicense
                if (result == false)
                    resultDelete = Delete_AssignLicenseRegions();

                    //AssignLicenseRegionsPersonel
                else
                    resultDelete = Delete_AssignLicenseRegionsPersonel();


            });
        }
        function Delete_AssignLicenseRegions() {
            var resultDelete = false;
            if ($scope.AssignLicense.Regions == null)
                notify.error({ message: pnMessage.common.errorDelete, title: pnMessage.common.error });

            else if ($scope.AssignLicense.Regions.Key == null)
                notify.error({ message: pnMessage.common.errorDelete, title: pnMessage.common.error });

            else if ($scope.personelKendo.dataSource.total() > 0)
                notify.error({ message:"مجوز مورد نظر دارای پرسنل می باشد امکان حذف وجود ندارد", title: pnMessage.common.error });
           else {

                dialog.showYesNo(pnMessage.common.note, pnMessage.common.deleteSure, pnMessage.common.yes, pnMessage.common.no).then(function (resultConfrim) {
                    if (resultConfrim == null) { return resultDelete; }

                    else if (resultConfrim == true) {
                        remoteService.post(cache.recCache.AssignLicense.Regions, WebAccess + "api/AssignLicense/DeleteAssignLicense").then(function (resultDeleteReq) {
                            var notifyP = { message: pnMessage.common.successfullDelete, title: pnMessage.common.delete };
                            resultDelete = resultHandler(resultDeleteReq, notifyP);
                            regionGridSetLoad();
                        });

                    }
                });
            }

            return resultDelete;
        }

        function Delete_AssignLicenseRegionsPersonel() {
            debugger;
            var resultDelete = false;
            if ($scope.AssignLicense.Regions.Personel  == null)
                notify.error({ message: pnMessage.common.errorDelete, title: pnMessage.common.error });

            else if ($scope.AssignLicense.Regions.Personel.PKey == null)
                notify.error({ message: pnMessage.common.errorDelete, title: pnMessage.common.error });
            else {

                dialog.showYesNo(pnMessage.common.note, pnMessage.common.deleteSure, pnMessage.common.yes, pnMessage.common.no).then(function (resultConfrim) {
                    if (resultConfrim == null) { return resultDelete; }

                    else if (resultConfrim == true) {
                        remoteService.post({ Key: $scope.AssignLicense.Regions.Personel.PKey }, WebAccess + "api/AssignedPersonnel/DeleteAssignedPersonnel").then(function (resultDeleteReq) {
                            var notifyP = { message: pnMessage.common.successfullDelete, title: pnMessage.common.delete };
                            resultDelete = resultHandler(resultDeleteReq, notifyP);
                            PersonelGridSetLoad(cache.recCache.AssignLicense.Regions.Key);
                        });

                    }
                });
            }

            return resultDelete;
        }


    }]);
});
