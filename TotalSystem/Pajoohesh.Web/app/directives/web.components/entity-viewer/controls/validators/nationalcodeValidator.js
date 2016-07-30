define(['directives/web.components/entity-viewer/controls/pn.entityViewer.controls'], function (entityViewerControls) {
    var isValidIranianNationalCode = function(input) {
        input = input.replace(/[-_]/g, '');
        if (!/^\d{10}$/.test(input))
            return false;

        var check = parseInt(input[9]);
        var sum = [0, 1, 2, 3, 4, 5, 6, 7, 8]
                .map(function (x) { return parseInt(input[x]) * (10 - x); })
                .reduce(function (x, y) { return x + y; }) % 11;
        return sum < 2 && check == sum || sum >= 2 && check + sum == 11;
    };

    entityViewerControls.directive('nationalcodeValidator', function factory() {
        var directiveDefinitionObject = {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, ele, attrs, ctrl){
                ctrl.$parsers.unshift(function(value) {
                    var doValidate = scope.$eval(attrs['nationalcodeValidator']);
                    if (doValidate) {
                        var valid;
                        if(value){
                            valid = isValidIranianNationalCode(value);
                            ctrl.$setValidity('invalidNationalcodeValidator', valid);
                        }
                        return valid ? value : undefined;
                    }
                    return value;
                });
            }
        };
        return directiveDefinitionObject;
    });
    
});