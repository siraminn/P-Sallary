define(['directives/controls/pnControls'], function(control) {
    control.directive('pnRichtext', function factory() {
        var directiveDefinitionObject = {
            template:   '<textarea kendo-editor="options.editorElem" ' +
                        ' ng-model="value"' + 
                        ' ng-required="options.required"' + 
                        ' ng-disabled="options.disabled"' + 
                        ' k-options="options.kendoOptions">' +
                        ' </textarea>',
            restrict: 'E',
            scope: {
                options: '=',
                value: '=',
                onDestory: '&'
            },
            link: function (scope, elem, attrs) {
                scope.options = scope.options || {};
                scope.options.kendoOptions = scope.options.kendoOptions || {};

                scope.$on('$destroy', function () {
                    scope.onDestory();
                    scope.options = null;
                });
            }
        };
        return directiveDefinitionObject;
    });
});