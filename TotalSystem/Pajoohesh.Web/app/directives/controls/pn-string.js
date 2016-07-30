define(['directives/controls/pnControls'], function(control) {
    control.directive('pnString', function factory() {
        var directiveDefinitionObject = {
            template: '<input type="input" ' +
                            ' ng-maxlength="{{options.length}}" ' +
                            ' ng-model="ngModel" ng-required="options.required" ' +
                            ' ng-disabled="options.disabled" ' +
                            ' class="form-control"> ',
            restrict: 'E',
            scope: {
                options: '=',
                ngModel: '=',
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