define(['directives/controls/pnControls'], function (control) {


    control.directive('pnRadio', function () {
        return {
            restrict: 'E',
            scope: {
                title: '@',
                name: '@'
            },
            template: '<div class="radio">' +
                        '<label><input type="radio" name="{{ name }}">{{title}}</label>' +
                        '</div>'
        };
    });

});