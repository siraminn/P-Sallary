define(['directives/web.components/formula/controls/pn.formula.controls'], function (formulaControls){
    formulaControls.directive('pnField', function(){
     return {
            restrict: 'E',
            replace: true,
            scope: { formula: '@' },
            templateUrl: 'app/directives/web.components/formula/controls/field/pn-field.html',
            controller: function ($scope) {
                $scope.formulaScope = angular.element($("#" + $scope.formula)).scope();
                $scope.searchfield = '';
                $scope.fields = [
                   { caption: "حکم1", script: "@hokm1", typeItem: fieldOperationsEnum.field, tag: 0, tagStr: "" },
                   { caption: "حکم2", script: "@hokm2", typeItem: fieldOperationsEnum.field, tag: 0, tagStr: "" },
                   { caption: "حکم3", script: "@hokm3", typeItem: fieldOperationsEnum.field, tag: 0, tagStr: "" },
                   { caption: "حکم4", script: "@hokm4", typeItem: fieldOperationsEnum.field, tag: 0, tagStr: "" },
                   { caption: "حکم5", script: "@hokm5", typeItem: fieldOperationsEnum.field, tag: 0, tagStr: "" },
                   { caption: "حکم6", script: "@hokm6", typeItem: fieldOperationsEnum.field, tag: 0, tagStr: "" },
                   { caption: "حکم7", script: "@hokm7", typeItem: fieldOperationsEnum.field, tag: 0, tagStr: "" },
                   { caption: "حکم8", script: "@hokm8", typeItem: fieldOperationsEnum.field, tag: 0, tagStr: "" },
                   { caption: "حکم9", script: "@hokm9", typeItem: fieldOperationsEnum.field, tag: 0, tagStr: "" },
                   { caption: "حکم10", script: "@hokm10", typeItem: fieldOperationsEnum.field, tag: 0 },
                ];
                $scope.selectField = function (index) {
                    $scope.formulaScope.addItem($scope.fields[index]);

                };
            }
        };
    });
});
