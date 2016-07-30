define(['directives/controls/pnControls'], function (control) {
    control.directive("pnTreeview", [defFunc]);
    function defFunc() {
        return {
            restrict: 'EA',
            replace: false,
            scope: {
                config: "=",
                onReady: '&'
            },
            template: ' <div class="k-rtl k-content"><ul kendo-tree-view="Kendo" k-options="config" class="pn-treeview"></ul></div>',
            
            link: function (scope, element, attrs) {

                scope.$watch("scope.config", function(newValue, oldValue) {
                    if (newValue)
                        scope.Kendo.setOption(newValue);
                });

                scope.$on('kendoRendered', function () {
                    scope.onReady({ kendo: scope.Kendo, option : scope.option });
                });

            },
        };
    }
});