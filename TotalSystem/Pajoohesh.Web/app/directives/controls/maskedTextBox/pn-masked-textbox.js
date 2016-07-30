define(['app'], function (app) {
    app.directive('pnMaskedTextbox', function factory() {
        var directiveDefinitionObject = {
            template: '<input kendo-masked-text-box="options.editorElem" ' +
                            'k-options="options.kendoOptions" ' +
                            ' ng-model="ngModel" ng-required="options.required" ' +
                            ' nationalcode-validator="options.isNationalcode" ' + 
                            ' ng-disabled="options.disabled" ' +
                            ' class="form-control text-left ltr"> ',
            restrict: 'E',
            scope: {
                options: '=',
                ngModel: '=',
                onDestory: '&'
            },
            controller: function($scope, $element, $attrs) {
            },
            link: function (scope, elem, attr) {
                scope.$on('$destroy', function () {
                    scope.onDestory();
                    scope.options = null;
                });
            }
        };
        return directiveDefinitionObject;
    });
});