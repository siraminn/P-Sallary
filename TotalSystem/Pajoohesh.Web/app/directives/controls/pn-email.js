define(['directives/controls/pnControls'], function(control) {
    control.directive('pnEmail', function factory() {
        var directiveDefinitionObject = {
            template: '<input type="email" ' +
                            ' ng-model="value" ng-required="options.required" ' +
                            ' ng-disabled="options.disabled" ' +
                            ' class="form-control text-left ltr"> ',
            restrict: 'E',
            scope: {
                options: '=',
                value: '=',
                onDestory: '&'
            },
            link: function(scope, elem, attr) {
                scope.$on('$destroy', function () {
                    scope.onDestory();
                    scope.options = null;
                });
            }
        };
        return directiveDefinitionObject;
    });
});