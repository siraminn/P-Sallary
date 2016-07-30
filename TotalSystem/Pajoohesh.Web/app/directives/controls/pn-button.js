define(['directives/controls/pnControls'], function (control) {
    control.directive('pnButton', function () {
        return {
            restrict: 'E',
            scope: {
                value: '@'
            },
            template: '<input type="submit" class="btn btn-primary" value= "{{ value }}" />'
        };
    });
});