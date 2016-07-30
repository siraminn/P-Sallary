define(["areas/inf/app.areas.inf"], function (inf) {
    inf.register.controller("testTreeController", function ($scope) {
    
            var defaultDataSource = new kendo.data.HierarchicalDataSource({
                transport: {
                    type: "jsonp",
                    read: {
                        url: "Test/GetHierarchies",
                        contentType: "application/json",
                        data: function () {
                            var params = {

                            };
                            
                            return params;
                        }
                    },
                    parameterMap: function (data, operation) {
                        if (operation === "read") {
                            return kendo.stringify(data);
                        }
                    }
                },
                schema: {
                    model: {
                        id: "Id",
                        hasChildren: "HasChildren"
                    },
                    data: "Entities",
                    total: "TotalCount"
                }
            });

            $scope.treeOptions = {
                autoBind: true,
                loadOnDemand: true,
                dataSource: defaultDataSource,
                dataTextField: "Title",
                dataImageUrlField: "ImageUrl",
                messages: {
                    loading: "در حال خواندن اطلاعات ..."
                },
                select: function (e) {
                },
                dataBound: function (e) {
                },
                expand: function (e) {
                }
            }


            $scope.onTreeNodeChange = function (dataItem) {

                $scope.dataItem = dataItem;
                $scope.tree.expand($scope.tree.select());
                $scope.paneToolbarName = dataItem.Name;

            }


            $scope.orientation = "horizontal";
            $scope.hello = "Hello from Controller!";

            $scope.parameters = {};
            

            var getSelectedTreeNode = function () {
                return $scope.tree.dataItem($scope.tree.select());
            }
           
        $scope.filterQuery = {
            Query: {
                SearchText: ''
            },
            showSearch: false,
            toggleSearch: function () {
                this.showSearch = !this.showSearch;
            },
            reloadGrid: function () {
                var grid = $('#kendogrid').data('kendoGrid');
                grid.dataSource.read();
            }
        };

        $scope.selectedItems = [];

        $scope.gridConfig = {
            inlineOperationalUrl: {
                read: {
                    url: "Personnel/GetList",
                    data: function () {
                        return $scope.filterQuery;
                    }
                }
            }
        };
        $scope.gridColumns = [
            {
                field: 'Code',
                editable: false,
                title: "کد",
                allownull: false,
                width: 80
            },
            {
                field: 'FirstName',
                editable: false,
                title: "نام",
                allownull: false,
                width: 90
            },
            {
                field: 'LastName',
                editable: false,
                title: "نام خانوادگی",
                allownull: false,
                width: 130
            },
            {
                field: 'City',
                editable: false,
                title: "شهر",
                allownull: false,
                width: 130
            }
        ];
        $scope.gridSchema = {
            model: {
                id: 'Id',
                fields: {
                    Code: {
                        type: 'number',
                        editable: false
                    }
                }
            },
            data: 'Entities',
            total: 'TotalCount'
        };
        $('#kendogrid').on('dblclick', 'tr.k-state-selected', function () {
            alert($scope.selectedItems[0].Id);
        });

            $scope.onAddToolbar = function () {

                var selectedNode = getSelectedTreeNode();
                if (selectedNode) {

                }
            };

    });
});

