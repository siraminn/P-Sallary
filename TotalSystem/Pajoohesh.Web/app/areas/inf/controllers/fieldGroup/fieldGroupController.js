define(["areas/inf/app.areas.inf"], function (inf) {
    inf.register.controller("fieldGroupController", ["$scope", "cache", "infWebAccess", "$state",
    function ($scope, cache, WebAccess, $state) {

        cache.infCache =cache.infCache || {};
        cache.infCache.FieldGroup = {};
        cache.infCache.FieldGroup.Table = {};
        //************************************************
         $scope.tab =
                    {
                        model: { name: 'persianName' },
                        fixedTabs: [{ persianName: 'لیست گروه بندی', urlName: 'home.tab.fieldGroup.list', icon: 'list', isActive: true },
                                    { persianName: 'ورود اطلاعات', urlName: 'home.tab.fieldGroup.create', icon: 'plus', isActive: false }]    ,                      
                                };
        /*********************************************************************/


        //گرید
        //گرید مربوط به لیست جداول    
        $scope.selectedItemsListTable = [];
        $scope.$watch('selectedItemsListTable', function (newVal, oldVal) {
            if ($scope.selectedItemsListTable.length <= 0)
                return;
            cache.infCache.FieldGroup.Table = $scope.selectedItemsListTable[0];
            $state.go('home.tab.fieldGroup.list');
            $scope.$emit('someEventFieldGroup');
        });
        //انتخاب اولین سطر بطور پیش فرض
        $scope.gridListTable_onDataBound = function (kendo) {
            kendo.select(kendo.tbody.find('tr:first'));

        }
        $scope.gridConfigListTable = {
            inlineOperationalUrl: {
                read: {
                    url: WebAccess + "api/Table/GetTableAll",
                    data: function () { return $scope.filterQuery; }
                }
            },
            pageSizes: [5, 10, 15, 20, 25, 30, "All"]
        };
        $scope.gridColumnsListTable = [
        { field: "LatinName", editable: false, title: "شرح لاتین", allownull: false, },
        { field: "PersianName", editable: false, title: "شرح فارسی", allownull: false,  },
        { field: "TablesGroup", editable: false, title: "گروه جدول", allownull: false, }]
        $scope.gridSchemaListTable = { model: { id: "Id", fields: { Code: { type: "number", editable: false } } }, data: "Entities", total: "TotalCount" };
        //*************************************************************************************************************************************************************
        $state.go('home.tab.fieldGroup.list');

    }]);
});