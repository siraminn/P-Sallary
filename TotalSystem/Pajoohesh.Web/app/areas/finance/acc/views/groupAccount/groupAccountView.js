define(["areas/finance/acc/app.areas.finance.acc"], function (acc) {
    acc.register.controller("groupAccount", ["$scope", "$state", function ($scope, $state) {
        //----------------------grid Columns----------------------------
        $scope.gridColumnsItemGroup = [
            {
                field: "Code",
                editable: false,
                title: "کد",
                allownull: false,
                width: 90
            },
            {
                field: "Description",
                editable: false,
                title: "شرح",
                allownull: false,
                width: 90
            },
            {
                field: "Nature",
                editable: false,
                title: "ماهیت",
                allownull: false,
                attributes: { style: "text-align:left" },
                width: 90
            }
        ];

        //----------------------grid Schema----------------------------
        $scope.gridSchemaItemGroup = {
            model: {
                id: "Id",
                fields: {
                    Code: {
                        type: "number",
                        editable: false
                    }
                }
            },
            data: "Entities",
            total: "TotalCount"

        };
//-----strt2--------
        //----------------------grid Columns----------------------------
        $scope.gridConfigFieldItems = [
            {
                field: "Code",
                editable: false,
                title: "کد",
                allownull: false,
                width: 90
            },
            {
                field: "Description",
                editable: false,
                title: "شرح",
                allownull: false,
                width: 90
            },
            {
                field: "Nature",
                editable: false,
                title: "ماهیت",
                allownull: false,
                attributes: { style: "text-align:left" },
                width: 90
            }
        ];

        //----------------------grid Schema----------------------------
        $scope.gridConfigFieldItems = {
            model: {
                id: "Id",
                fields: {
                    Code: {
                        type: "number",
                        editable: false
                    }
                }
            },
            data: "Entities",
            total: "TotalCount"

        };
        //------------- 




      
    }]);
});