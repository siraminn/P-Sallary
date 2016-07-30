define(['directives/controls/pnControls'], function (control) {

    control.directive('pnTextboxPrice', function () {
        return {
            restrict: 'E',
            replace: 'true',
            template: '<input type="text" class="form-control auto" data-v-max="999999999999"  data-v-min="0"/> '
        };
    });
});