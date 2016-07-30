define(["areas/inf/app.areas.inf"], function (inf) {
    
    inf.register.controller("testTreeListController", ["$scope", "$timeout", "toaster", "pn.remote.service", "pn.dialog", "pn.focus", "pn.kendo.config",
        function ($scope, $timeout, toaster, remoteService, dialog, focus, kendoConfig) {
            $scope.treeListConfig = kendoConfig.getTreelistConfig();
            $scope.treeListConfig.dataSource.transport.read.url = "api/Test/TestTreeList";
            
            $scope.treeListConfig.columns = [
                {
                    field: 'id',
                    editable: false,
                    title: "شماره",
                    allownull: false,
                    width: 90,
                    expandable: true
                },
                {
                    field: 'Name',
                    editable: false,
                    title: "نام",
                    allownull: false,
                    width: 90,
                    expandable: true
                },
                {
                    field: 'parentId',
                    editable: false,
                    title: "نام انگلیسی",
                    allownull: false,
                    width: 130
                },
                {
                    field: 'Phone',
                    editable: false,
                    hidden: true,
                    title: "شماره",
                    allownull: false,
                    width: 130
                },
                {
                    field: 'Position',
                    editable: false,
                    hidden: true,
                    title: "موقعیت",
                    allownull: false,
                    width: 130
                }
            ];


            $scope.treeListConfig.expand =  function(e) {
                console.log(e);
            }

            window.s = $scope;
        }]);
});

