define(['directives/web.components/formula/controls/pn.formula.controls'], function (formulaControls){
    formulaControls.directive('pnFormulaToolbar', function(){
    return {
        restrict: 'E',
        replace: true,
        scope: { formula: '@' },
        templateUrl: 'app/directives/web.components/formula/controls/fourmulaToolbar/pn-formula-toolbar.html',
        controller: function ($scope) {
            $scope.formulaScope = angular.element($("#" + $scope.formula)).scope();

            $scope.addLine = function () {
                $scope.formulaScope.addLine();
            };

            $scope.insertLine = function (type) {
                $scope.formulaScope.insertLine(type);
            };

            $scope.deleteItem = function () {
                $scope.formulaScope.deleteItem();
            };

            $scope.deleteLine = function (callByManager) {
                $scope.formulaScope.deleteLine(callByManager);
            };

            $scope.deleteGroup = function () {
                $scope.formulaScope.deleteGroup();
            };

            $scope.canDeleteGroup = function () {
                return $scope.formulaScope.canDeleteGroup();
            };

            $scope.canAddLine = function () {
                return $scope.formulaScope.canAddLine();
            };

            $scope.canInsertLine = function () {
                return $scope.formulaScope.canInsertLine();
            };

            $scope.canInsertBeforLine = function () {
                return $scope.formulaScope.canInsertBeforLine();
            };

            $scope.validationAllItems = function () {
                $scope.formulaScope.validationAllItems();
            };

            $scope.SaveToServer = function () {
                $scope.formulaScope.SaveToServer();
            };

            $scope.GetFromServer = function (name) {
                $scope.formulaScope.GetFromServer(name);
            };

        }
    };
    });
});
