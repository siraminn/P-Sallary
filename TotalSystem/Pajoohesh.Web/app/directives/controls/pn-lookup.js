define(['directives/controls/pnControls'], function (control) {
    var controller = function ($scope, $element, $attrs, $transclude, $compile, Notification, $rootScope, $state) {
        $scope.searchEnable = true;
        $scope.onGridReady = function (kendo) {
            $scope.kendo = kendo;
            $scope.gridOptions = $scope.kendo.getOptions();
            $scope.gridOptions.autoBind = false;
            $scope.gridOptions.columns = [];
            $scope.searchFields = [];


            $scope.options.lookup.fields.forEach(function (field) {
                if (field.showInSearchPanel)
                    $scope.searchFields.push(field);
                if (field.showInGrid) {
                    $scope.gridOptions.columns.push({
                        field: field.latinName.replace(/\./ig, "_"),
                        title: field.persianName
                    });
                }
            });

            $scope.searchGroup = {
                "Fields_FieldGroup": "گروه 1",
                "FieldsList": $scope.searchFields
            };
            var childScope = $scope.$new();
            var group = "<group-control options='searchGroup' bare></group-control>";
            var el = $compile(group)(childScope);
            $('#lookup-search-' + $scope.$id).append(el);



            $scope.kendo.setOptions($scope.gridOptions);

            $scope.kendo.bind("dataBound", function () {
                $scope.searchEnable = true;
            });
            $scope.kendo.dataSource.bind("error", function () {
                $scope.searchEnable = true;
            });

            $scope.onReady({ kendo: $scope.kendo });
        };

        $scope.openPopup = function (event) {
            event.preventDefault();
            if ($('#lookup-search-' + $scope.$id).data("search") !== true) {
                $('#lookup-search-' + $scope.$id).data("search", true);


                //$scope.kendo.dataSource.read();
                $scope.search();
            } else {
                $scope.searchGroup.FieldsList.forEach(function (x) {
                    x.value = "";
                });
                $scope.search();
            }



            $scope.searchGroup.FieldsList.map(function(item){item.disabled = false});

            $scope.options.window.open();
            $scope.options.window.center();
        };
        $scope.search = function () {
            $scope.searchEnable = false;
            try {
                var filters = [];
                angular.forEach($scope.searchGroup.FieldsList, function (item) {
                    if (item.value) {
                        filters.push({
                            field: item.latinName,
                            value: item.value,
                            operator: (item.operator == null ? "contains" : item.operator),
                            dataType: item.typeKey
                        });
                    }
                });

                if ($scope.options.lookup.filter) {
                    for (var i = 0; i < $scope.options.lookup.filter.filters.length; i++) {
                        filters = filters.concat($scope.options.lookup.filter.filters[i]);
                    }
                    $scope.kendo.dataSource.filter.logic = $scope.options.lookup.filter.logic;
                }
                $scope.kendo.dataSource.filter(filters);
            } catch (e) {
                Notification.error({ message: "خطا خطا خطا", title: "خطا" });
                $scope.searchEnable = true;
            }
        };
        $scope.onDblClick = function (items) {
            var selectedItem = items[0];

            $scope.safeApply = function (fn) {
                var phase = this.$root.$$phase;
                if (phase === '$apply' || phase === '$digest')
                    this.$eval(fn);
                else
                    this.$apply(fn);
            };

            $scope.safeApply(function () {
                $scope.options.text = selectedItem[$scope.options.lookup.textField.replace(/\./ig, "_")];
                $scope.options.value = selectedItem[$scope.options.lookup.valueField.replace(/\./ig, "_")];
            });

            /*
            remark: this code not used in this project.
            var canClick = $scope.options.cancelClick() || true;
            $scope.onAfterDblClick({ selectedItem: selectedItem });
            */

            $scope.options.window.close();
        };


        //


        $scope.getExtraData = function () {
            var extraData = $scope.extraData || {};
            extraData.currentDate = $state.current.data;
            extraData.currentName = $state.current.name;
            extraData.table = $scope.options.lookup.table;
            extraData.data = $scope.options.lookup.data;

            if ($scope.options.lookup.fields && $scope.options.lookup.fields.map)

                extraData.fields = $scope.options.lookup.fields.map(function (x) { return x.latinName });

            for (var j = 0; j < $rootScope.tabItems.length; j++) {
                if ($rootScope.tabItems[j].action === $state.current.name) {
                    debugger;
                    extraData.SystemId = $rootScope.tabItems[j].SystemKey;
                    extraData.FormId = $rootScope.tabItems[j].FormId;
                    break;
                }
            }

            return extraData;
        }
        $scope.selectedItems = [];
        $scope.gridConfig = {
            inlineOperationalUrl: {
                read: {
                    url: $scope.options.lookup.url,
                    data: $scope.getExtraData
                },
            },
            autoBind: false
        };
        $scope.gridSchema = {
            model: {
                id: 'Id'
            },
            data: 'Entities',
            total: 'TotalCount'
        };

        $scope.api = {
            refreshGrid: function () {
                $scope.kendo.dataSource.read();
            },
            search: function () {
                $scope.search();
            }
        };

    };

    control.directive('pnLookup', function factory() {
        var directiveDefinitionObject = {
            templateUrl: "app/partials/directives/pn-lookup.html",
            restrict: 'E',
            scope: {
                options: '=',
                api: '=',
                extraData: '=',
                ngModel: '=',
                onReady: '&',
                onAfterDblClick: '@',
                setFormInfo: '&'
            },
            controller: controller,
            link: function (scope, elem, attr) {

                scope.$watch('options.showValue', function (newValue, oldValue) {
                    if (scope.options.showValue != null) {
                        scope.options.text = scope.options.showValue;
                    }
                });


            }
        };
        return directiveDefinitionObject;
    });

});