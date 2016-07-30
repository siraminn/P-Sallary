define(['directives/controls/pnControls'], function (control) {
    control.directive('pnComboBox', function factory() {
        return {
            restrict: 'EA',
            replace: false,
            scope: {
                dataSource: '=data',
                ngModel: "=",
                onChange: "&",
                onSelect: "&",
                onClose: "&",
                onOpen: "&",
                onFiltering: "&",
                onDataBound: "&",
                disable: "="
            },
            template: function (element, attrs) {
                return '<select class="k-rtl"  enabled="enabled" ng-model="ngModel" kendo-combo-box="kendoCombo" k-placeholder="\'انتخاب کنید...\'" k-data-text-field="textField" k-data-value-field="valueField"  k-data-source="data" k-change="change" k-select="select" k-close="close" k-open="open" k-filtering="filtering" k-data-bound="dataBound"   k-auto-bind="true" > </select>';
            },
            link: function ($scope) {
                $scope.textField = $scope.dataSource.text;
                $scope.valueField = $scope.dataSource.value;
                if ($scope.disable == null) {
                    $scope.enabled = true;
                }
                else {
                    $scope.enabled = $scope.disable;
                }

                $scope.data = {
                    type: "json",
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: $scope.dataSource.transport.read.url,
                        }
                    }
                };
                $scope.change = function () {
                    $scope.onChange({ combo: $scope.kendoCombo });
                }
                $scope.select = function (e) {
                    var data = $scope.kendoCombo.dataItem(e.item);
                    $scope.onSelect({ combo: data });
                }
                $scope.close = function () {
                    $scope.onClose({ combo: $scope.kendoCombo });
                }
                $scope.open = function () {
                    $scope.onOpen({ combo: $scope.kendoCombo });
                }
                $scope.filtering = function () {
                    $scope.onFiltering({ combo: $scope.kendoCombo });
                }
                $scope.dataBound = function () {
                    $scope.onDataBound({ combo: $scope.kendoCombo });
                }
            }
        }
    });
});