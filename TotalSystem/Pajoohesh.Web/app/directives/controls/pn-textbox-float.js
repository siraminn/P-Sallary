define(['directives/controls/pnControls'], function (control) {
    control.directive('pnTextboxFloat', function () {
        return {
            restrict: 'E',
            replace: 'true',
            template: '<input type="text" class="form-control auto" data-a-sep/> '
        };
    });
});