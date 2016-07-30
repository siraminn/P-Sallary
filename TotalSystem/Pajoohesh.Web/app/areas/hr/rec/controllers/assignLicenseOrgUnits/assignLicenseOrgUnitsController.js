define(["areas/hr/rec/app.areas.hr.rec"], function (rec) {
    rec.register.controller("assignLicenseOrgUnitsController", ["$scope","cache","recWebAccess","$state",
    function ($scope,   cache,   WebAccess,  $state) {
        //*******************************************************************************************

        cache.recCache = cache.recCache || {};
        cache.recCache.AssignLicense = {};
        cache.recCache.AssignLicense.Province = {};
        //************************************************
                $scope.tab =
                    {
                        model: { name: 'persianName' },
                        fixedTabs: [{ persianName: 'لیست تخصیص ها', urlName: 'home.tab.assignLicenseOrgUnits.list', icon: 'list', isActive: true },
                            { persianName: 'ورود اطلاعات', urlName: 'home.tab.assignLicenseOrgUnits.create', icon: 'plus', isActive: false }]
                           ,
                                };
         /*********************************************************************/

        //گرید
        //گرید مربوط به لیست مجوز های استان    
        $scope.selectedItems = [];
        $scope.$watch('selectedItems', function (newVal, oldVal) {
             if ($scope.selectedItems.length <= 0)
                return; 
            cache.recCache.AssignLicense.Province=$scope.selectedItems[0];
            $state.go('home.tab.assignLicenseOrgUnits.list');
            $scope.$emit('someEventOrgUnits');
        });
 
        //انتخاب اولین سطر بطور پیش فرض
        $scope.provincegrid_onDataBound = function (kendo) {
            kendo.select(kendo.tbody.find('tr:first'));

        }

        $scope.gridConfig = {
            inlineOperationalUrl: {
                read: {
                    url: WebAccess + "api/assignLicense/GetAllAssignLicenseProvince",
                    data: function () { return $scope.filterQuery; }
                }
            },
            pageSizes: [5, 10, 15, 20, 25, 30, "All"]
        };
        $scope.gridColumns = [
        { field: "NO", editable: false, title: "شماره مجوز", allownull: false},
        { field: "Subject", editable: false, title: "موضوع مجوز", allownull: false},
        { field: "SolarRecordDate", editable: false, title: "تاریخ صدرو مجوز", allownull: false},
        { field: "OrgUnitsValue", editable: false, title: "استان", allownull: false },
        { field: "EmployTypeValue", editable: false, title: "نوع استخدام", allownull: false},
        { field: "OrgPositionValue", editable: false, title: "پست سازمانی", allownull: false},
        { field: "EducationalDegreesValueFrom", editable: false, title:"(از)"+ "مدرک تحصیلی", allownull: false},
        { field: "EducationalDegreesValueTo", editable: false, title:"(تا)"+ "مدرک تحصیلی", allownull: false},
        { field: "FieldItemsValue", editable: false, title: "نوع مجوز", allownull: false },
        { field: "Count", editable: false, title: "تعداد", allownull: false, typeKey: 101 },
        { field: "WomenCount", editable: false, title: "تعداد زن", allownull: false },
        { field: "MenCount", editable: false, title: "تعداد مرد", allownull: false },
        ];
        $scope.gridSchema = { model: { id: "Id", fields: { Code: { type: "number", editable: false } } }, data: "Entities", total: "TotalCount" };
        //*****************************************************************************************************************************************************
        $state.go('home.tab.assignLicenseOrgUnits.list');

     
    }]);
});
