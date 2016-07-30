define(["areas/inf/app.areas.inf"], function (inf) {
    inf.register.controller("createSystemFeatureController", ["$scope", "pn.remote.service", "pn.enum", "pn.dialog",
        "pn.focus", "Notification", "infWebAccess", "$window", "pn.kendo.config",
         function ($scope, remoteService, pnenum, dialog, focus, notify, WebAccess, $window, kendoConfig) {

          

             //********************* Tree List **********************
             $scope.treeListConfig = kendoConfig.getTreelistConfig();
             $scope.selectedItems = [];
             $scope.treeListConfig = {
                 columns: [
                    { 
                    field: 'SystemFeatureCode', 
                    title: "کد ویژگی", 
                    expandable: true 
                    },
                    { field: 'SystemFeatureTitle', title: "شرح" },
                    { field: 'LatinName', title: "نام لاتین" },
                    { field: 'TypesTitle', title: "نوع جدول" },
                    { field: 'Action', title: "وضعیت" },
                    { field: 'IsActive', title: "فعال" },
                    { field: 'Icon', title: "آیکون" }
                 ],
                 dataSource: {
                     schema: {
                         data: 'Entities',
                         total: 'TotalCount',
                         model: {
                             id: "id",
                             expanded: true,
                             fields: { id: { field: "id", nullable: false, type: "string" } }
                         }
                     },
                     transport: {
                         read: {
                             url: WebAccess + "api/SystemFeature/GetSystemFeature",
                             type: "POST",
                             data: function () {
                                 return { guid: $scope.subSystemSelectedItemId };
                             }
                         }
                     }
                 }
             };

             //********* on System Feature Ready Gird *************
             $scope.systemFeaturekendoGrid = null;
             $scope.onSystemFeatureReadyGird = function (kendo, options) {
                 $scope.systemFeaturekendoGrid = kendo;
             };

            //................................................
                 $scope.reloadTreeList = function () {
                 $scope.treeListApi.refresh();
             };

             //********* disable Grid ************            
             var disableGrid = function (gridId) {
                 $scope.gridApi.setActive(false);
             };

             //******* enableGrid *********
             var enableGrid = function () {
                 if ($scope.gridApi)
                     $scope.gridApi.setActive(true);
             };

             //****** reloadGrid ********
             var reloadGrid = function () {
                 $scope.gridApi.refresh();
             };

             // *******Initilize Form Data*************
             $scope.initializeForm = function () {
                 $scope.formOperationState = pnenum.pnformstate.browse;
                 $scope.systemFeature = {}
                 $scope.disableSystemFeatureForm = true;
                 $scope.disableSystems = false;
                 $scope.systemSelectedItemId = "";
                 $scope.subSystemSelectedItemId = "";
                 enableGrid();
             };

             $scope.initializeForm();

             // ************Systems ComboBox **************
             $scope.getSystems = function () {
                 remoteService.post(null, WebAccess + "api/System/GetMainSystems").then(function (loadDataResult) {
                     $scope.systemSelectedItemId = '0';
                     $scope.systemNames = loadDataResult.Entities;
                 });
             };

             // ************Sub Systems ComboBox **************
             $scope.getSubSystemsByParentId = function () {

                 var selectedSubSystem = { ParentId: $scope.systemSelectedItemId };
                 remoteService.post(selectedSubSystem, WebAccess + "api/System/GetActiveSubSystemsByParentId").then(function (loadDataResult) {
                     $scope.subSystemSelectedItemId = '0';
                     $scope.subSystemNames = loadDataResult.Entities;                    
                     $scope.subSystemSelectedItemId = $scope.tempSubSystemSelectedItemId;
                 });
             };

             //******************** نوع جدول*********************
             $scope.getTableSqlType = function () {
                 remoteService.post(null, WebAccess + "api/Types/GetTableSqlTypeSystemFeature").then(function (loadDataResult) {
                     $scope.TableSqlType = loadDataResult.Entities;
                 });
             };

             //************* نمایش اطلاعات گرید در تکست باکس ها***************
             $scope.showGridSelectedRowInForm = function (entity) {
                 $scope.systemSelectedItemId = entity.parentId;
                 $scope.subSystemSelectedItemId = entity.SystemId;
                 $scope.systemFeature.SystemFeatureCode = entity.SystemFeatureCode;
                 $scope.systemFeature.TypesTitle = entity.TypesTitle;
                 $scope.systemFeature.Icon = entity.Icon;
                 $scope.systemFeature.SystemFeatureTitle = entity.SystemFeatureTitle;
                 $scope.systemFeature.LatinName = entity.EnglishDesc;
                 $scope.systemFeature.Action = entity.Action;
                 $scope.systemFeature.IsActive = entity.IsActive;

             };

             $scope.$watch('selectedItems', function (newVal, oldVal) {
                 if ($scope.selectedItems.length <= 0)
                     return;
                 $scope.showGridSelectedRowInForm($scope.selectedItems[0]);
             });

             $scope.getSystems();
             $scope.getSubSystemsByParentId();
             $scope.getTableSqlType();
           
             //******* End ******** 
         }]);
});
