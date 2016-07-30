define(["areas/inf/app.areas.inf"], function (inf) {
    inf.register.controller("fieldGroupListController", ["$scope", "pn.remote.service", "pn.enum", "pn.dialog",
        "pn.focus", "Notification", "infWebAccess", "$window","cache",  "$rootScope","$state","pn.message",
    function ($scope, remoteService, pnenum, dialog, focus, notify, WebAccess, $window, cache,$rootScope,$state,pnMessage) {

        cache.infCache.FieldGroup.formOperationState = pnenum.pnformstate.browse;
        cache.infCache.FieldGroup.Info = {};

        $scope.guidEmpty = "00000000-0000-0000-0000-000000000000";
        $scope.FieldGroup = {};
        $scope.FieldGroup.Type = {};
        $rootScope.$on('someEventFieldGroup', function (event) {
            $scope.FieldGroup = {};
            listGroupGridSetLoad();
            listTypeGridSetLoad($scope.guidEmpty);
        });
        /*********************************************************************/
      //گرید مربوط به لیست گروه بندی ها    
        $scope.listGroupkendo = null;
        $scope.onListGroupReadyGird = function (kendo) {
            $scope.listGroupkendo = kendo;
            //دربازگشت
            if (cache.infCache.FieldGroup.Table != null)
                listGroupGridSetLoad();
        };

        function listGroupGridSetLoad() {
            $scope.Table = cache.infCache.FieldGroup.Table;
            var op = $scope.listGroupkendo.getOptions();
            op.dataSource.transport.read.data = { TableKey: $scope.Table.Key, };
            op.dataSource.transport.read.url = WebAccess + "api/FieldGroup/GetAllFieldGroupMain";
            $scope.listGroupkendo.setOptions(op);   
        };

        $scope.selectedItemsListGroup = [];
        $scope.$watch('selectedItemsListGroup', function (newVal, oldVal) {
            if ($scope.selectedItemsListGroup.length <= 0)
                return;
            debugger;
            cache.infCache.FieldGroup.Info = $scope.selectedItemsListGroup[0];
            $scope.FieldGroup = cache.infCache.FieldGroup.Info;
            listTypeGridSetLoad($scope.FieldGroup.Key);

        });

        //انتخاب اولین سطر بطور پیش فرض
        $scope.gridListGroup_onDataBound = function (kendo) {
            kendo.select(kendo.tbody.find('tr:first'));

        }

        $scope.gridConfigListGroup = {
            inlineOperationalUrl: {
                read: {                    url: "",                    data: function () { return $scope.filterQuery; }
                }
            },
            pageSizes: [5, 10, 15, 20, 25, 30, "All"]
        };
        $scope.gridColumnsListGroup = [
    { field: "OrderNo", editable: false, title: "کد", allownull: false, width: 100 },
    { field: "Description", editable: false, title: "شرح", allownull: false, width: 100 }]
        $scope.gridSchemaListGroup = { model: { id: "Id", fields: { Code: { type: "number", editable: false } } }, data: "Entities", total: "TotalCount" };
        //*************************************************************************************************************************************************************
        //گرید مربوط به لیست نوع گروه بندی ها    
        $scope.listTypekendo = null;
        $scope.onListTypeReadyGird = function (kendo) {
            $scope.listTypekendo = kendo;
        };

        function listTypeGridSetLoad(FieldGroupKey) 
            {
            var op = $scope.listTypekendo.getOptions();
            op.dataSource.transport.read.data = { FieldGroupKey:FieldGroupKey , };
            op.dataSource.transport.read.url = WebAccess + "api/FieldGroupType/GetAllFieldGroupType";
            $scope.listTypekendo.setOptions(op);
        };

        $scope.selectedItemsListType = [];
        $scope.$watch('selectedItemsListType', function (newVal, oldVal) {
            if ($scope.selectedItemsListType.length <= 0)
                return;

            $scope.FieldGroup.Type = $scope.selectedItemsListType[0];
        });

        //انتخاب اولین سطر بطور پیش فرض
        $scope.gridListType_onDataBound = function (kendo) {
            kendo.select(kendo.tbody.find('tr:first'));

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
        $scope.gridColumnsListType = [
    { field: "DescType", editable: false, title: "نوع داده مربوط به گروه بندی", allownull: false, width: 100 }]
        $scope.gridSchemaListType = { model: { id: "Id", fields: { Code: { type: "number", editable: false } } }, data: "Entities", total: "TotalCount" };
        //*************************************************************************************************************************************************************
        //تنظیمات پیش فرض فرم
        function initializeForm() {

            //برگشت به حالت اولیه دکمه ها
            $scope.$emit("toolbar:DoRibbonTrue");
        };
        //***********************************************************************************************************

        $scope.doInsert = function () { return Insert(); }
        $scope.doEdit = function () { return Edit(); }
        $scope.doDelete = function () { return Delete(); }
        $scope.doCancel = function () { $state.go('home.tab.fieldGroup.list'); return true; };
        //**********************************************************************
        var resultHandler = function (result, notifyP) {
            if (result.Success) {
                notify.success(notifyP);
                listGroupGridSetLoad();
            }
            else {
                errorHandler.ShowError(result);
            }
            return result.Success;
        }

        function Insert() {

            cache.infCache.FieldGroup.formOperationState = pnenum.pnformstate.insert;
            $state.go('home.tab.fieldGroup.create');
            return true;

        };
        function Edit() {

            if ($scope.FieldGroup.Key == null) {
                notify.error("لطفا آیتمی را برای ویرایش انتخاب کنید", "عدم انتخاب آیتم برای ویرایش");
                return false;
            }
            else {
                cache.infCache.FieldGroup.formOperationState = pnenum.pnformstate.update;
                $state.go('home.tab.fieldGroup.create');
                return true;
            }
        };

        function Delete() {
            var resultDelete = false;
            dialog.showYesNo(pnMessage.common.note, "ایتم مورد نظر خود را جهت حذف اطلاعات انتخاب کنید", "نوع داده مربوط به گروه بندی", "گروه بندی").then(function (result) {
                if (result == null) { return resultDelete; }
                //FieldGroup
                if (result == false)
                    resultDelete = Delete_FieldGroup();

                    //FieldGroupType
                else
                    resultDelete = Delete_FieldGroupType();


            });
        }

        function Delete_FieldGroup() {
            var resultDelete = false;
            if ($scope.FieldGroup == null)
                notify.error({ message: pnMessage.common.errorDelete, title: pnMessage.common.error });

            else if ($scope.FieldGroup.Key == null)
               notify.error({ message: pnMessage.common.errorDelete, title: pnMessage.common.error });

            else if ($scope.listTypekendo.dataSource.total() > 0)
                 notify.error({ message:"گروه بندی مورد نظر دارای نوع داده می باشد امکان حذف وجود ندارد", title: pnMessage.common.error });
            else {

                dialog.showYesNo(pnMessage.common.note, pnMessage.common.deleteSure, pnMessage.common.yes, pnMessage.common.no).then(function (resultConfrim) {
                    if (resultConfrim == null) { return resultDelete; }

                    else if (resultConfrim == true) {
                        remoteService.post(cache.recCache.AssignLicense.Regions, WebAccess + "api/FieldGroup/DeleteFieldGroup").then(function (resultDeleteReq) {
                            var notifyP = { message: pnMessage.common.successfullDelete, title: pnMessage.common.delete };
                            resultDelete = resultHandler(resultDeleteReq, notifyP);
                            listGroupGridSetLoad();
                        });

                    }
                });
            }

            return resultDelete;
        }

        function Delete_FieldGroupType() {
            debugger;
            var resultDelete = false;
            if ($scope.FieldGroup.Type == null)
                notify.error({ message: pnMessage.common.errorDelete, title: pnMessage.common.error });

            else if ($scope.FieldGroup.Type.Key == null)
                notify.error({ message: pnMessage.common.errorDelete, title: pnMessage.common.error });
            else {

                dialog.showYesNo(pnMessage.common.note, pnMessage.common.deleteSure, pnMessage.common.yes, pnMessage.common.no).then(function (resultConfrim) {
                    if (resultConfrim == null) { return resultDelete; }

                    else if (resultConfrim == true) {
                        remoteService.post({ Key: $scope.FieldGroup.Type.Key }, WebAccess + "api/FieldGroupType/DeleteFieldGroupType").then(function (resultDeleteReq) {
                            var notifyP = { message: pnMessage.common.successfullDelete, title: pnMessage.common.delete };
                            resultDelete = resultHandler(resultDeleteReq, notifyP);
                            listTypeGridSetLoad($scope.FieldGroup.Key);;
                        });

                    }
                });
            }

            return resultDelete;
        }
        //------------------------------------------------------------
        initializeForm();
    }]);
});