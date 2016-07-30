define(["areas/finance/acc/app.areas.finance.acc"], function (acc) {
    acc.register.controller("periodListController", ["$scope", function ($scope) {


        /*****grid****/
        $scope.gridConfig = {
            inlineOperationalUrl: {
                read: {
                    url: null,
                    data: function () { return $scope.filterQuery; }
                }
            },
            
        };
        $scope.gridColumns = [
                                    { field: "FieldItemsValue", editable: false, title: "نوع دفتر", allownull: false },
                                    { field: "NO", editable: false, title: "شرح دوره", allownull: false },
                                    { field: "Subject", editable: false, title: "کدینگ", allownull: false },
                                    { field: "SolarDate", editable: false, title: "تاریخ شروع", allownull: false },
                                    { field: "SolarRecordDate", editable: false, title: "تاریخ پایان", allownull: false },
                                    { field: "Comments", editable: false, title: "نحوه ثبت سند", allownull: false },
                                     { field: "Comments", editable: false, title: ";کد تفصیلی", allownull: false },
                                     { field: "Comments", editable: false, title: "نوع ثبت سند", allownull: false },
                                      { field: "Comments", editable: false, title: "سیستم ارزی", allownull: false },
        ];
        $scope.gridSchema = { model: { id: "Id", fields: { Code: { type: "number", editable: false } } }, data: "Entities", total: "TotalCount" };


       

        /****grid2*****/
        $scope.gridConfig2 = {
            inlineOperationalUrl: {
                read: {
                    url: "",
                    data: function () { return $scope.filterQuery; }
                }
            },

        };
        $scope.gridColumns2 = [
                                    { field: "FieldItemsValue", editable: false, title: "سال شروع دوره", allownull: false },

        ];
        $scope.gridSchema2 = { model: { id: "Id", fields: { Code: { type: "number", editable: false } } }, data: "Entities", total: "TotalCount" };


      


    }]);
});




