define(['directives/controls/pnControls'], function (control) {
    control.directive("pnTreelist", [defFunc]);

    function defFunc() {
        return {
            restrict: 'E',
            scope: {
                Config: "=config",
                onReady: '&',
                api: "="
            },
            template: '<div kendo-tree-list="Kendo" class="k-rtl" k-options="Config">',
            link: function (scope, element, attrs) {
                scope.$watch(scope.Config, function (newValue, oldValue) {
                    if (newValue)
                        scope.Kendo.setOption(newValue);
                });

                
            },
            controller: function ($scope) {
                $scope.$on('kendoWidgetCreated', function () {
                    $scope.onReady({ kendo: $scope.Kendo, option: $scope.Config });
                    $scope.api = {
                        refresh: function () {
                            $scope.Kendo.dataSource.read();
                        }
                    };
                });
            }
        };
    }
});