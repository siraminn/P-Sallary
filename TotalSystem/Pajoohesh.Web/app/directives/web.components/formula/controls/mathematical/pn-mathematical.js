define(['directives/web.components/formula/controls/pn.formula.controls'], function (formula){
    formula.directive('pnFormula', function(){
        return {
            restrict: 'E',
            replace: true,
            scope: { formula: '@' },
            templateUrl: 'app/directives/web.components/formula/controls/mathematical/pn-mathematical.html',
            controller: function ($scope) {
                $scope.formulaScope = angular.element($("#" + $scope.formula)).scope();
                $scope.operands = [
                  { caption: "+", script: "+", typeItem: mathematicalOperatoEnum.plus, tag: 0, tagStr: "" },
                  { caption: "-", script: "-", typeItem: mathematicalOperatoEnum.minus, tag: 0, tagStr: "" },
                  { caption: "/", script: "/", typeItem: mathematicalOperatoEnum.division, tag: 0, tagStr: "" },
                  { caption: "*", script: "*", typeItem: mathematicalOperatoEnum.korrutada, tag: 0, tagStr: "" },
                  { caption: "^", script: "^", typeItem: mathematicalOperatoEnum.power, tag: 0, tagStr: "" },
                ];
                $scope.addItem = function (index) {
                    $scope.formulaScope.addItem($scope.operands[index]);
                };
            }
        };
    });
});