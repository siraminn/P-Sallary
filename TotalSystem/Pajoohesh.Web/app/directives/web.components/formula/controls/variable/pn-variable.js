define(['directives/web.components/formula/controls/pn.formula.controls'], function (formulaControls){
    formulaControls.directive('pnFormula', function(){
        return {
        restrict: 'E',
        replace: true,
        scope: { formula: '@' },
        templateUrl: 'app/directives/web.components/formula/controls/variable/pn-variable.html',
        controller: function ($scope) {
            $scope.formulaScope = angular.element($("#" + $scope.formula)).scope();
            $scope.dialogData = { data: "", title: "", type: "" };
            $scope.operands = [
               { caption: "درج گروه", script: "", typeItem: linearSingleOperatorEnum.group, tag: 0, tagStr: "", disable: "false" },
                { caption: "درج گروه قبل از خط", script: "", typeItem: linearSingleOperatorEnum.beforLine, tag: 0, tagStr: "", disable: "!canAddGroupBeforLine()", },
                { caption: "درج گروه بعد از خط", script: "", typeItem: linearSingleOperatorEnum.afterLine, tag: 0, tagStr: "", disable: "false" },
                { caption: "شرح", script: "", typeItem: linearSingleOperatorEnum.comment, tag: 0, tagStr: "", disable: "false" },
                { caption: "عدد", script: "0", typeItem: fieldOperationsEnum.numeric, tag: 0, tagStr: "", disable: "false" },
                { caption: "=", script: "=", typeItem: comparisonOperatorEnum.equal, tag: 0, tagStr: "", disable: "false"},
                { caption: ">", script: ">", typeItem: comparisonOperatorEnum.greater, tag: 0, tagStr: "", disable: "false" },
                { caption: "<", script: "<", typeItem: comparisonOperatorEnum.less, tag: 0, tagStr: "", disable: "false" },
                { caption: ">=", script: ">=", typeItem: comparisonOperatorEnum.greaterEqual, tag: 0, tagStr: "", disable: "false" },
                { caption: "<=", script: "<=", typeItem: comparisonOperatorEnum.lessEqual, tag: 0, tagStr: "", disable: "false" },
                { caption: "(", script: "(", typeItem: parantezEnum.openParantez, tag: 0, tagStr: "", disable: "false" },
                { caption: ")", script: ")", typeItem: parantezEnum.closeParantez, tag: 0, tagStr: "", disable: "false" },
            ];

            $scope.canAddGroupBeforLine = function () {
                
                return $scope.formulaScope.selectedRowIndex != 0 && $scope.formulaScope.currentLineIndex > 0;
            };
            $scope.currentItem = -1;

            $scope.openDialog = function (type) {
                ngDialog.open({
                    template: '/Scripts/Directives/popupTmpl.html',
                    scope: $scope,
                    data: $scope.dialogData,
                    controller: function () {

                    }
                });
            };

            $scope.create = function (opts) {
                if (opts.name == "") {
                    notificationService.displayError("!مقدار را وارد نمایید");
                    return;
                }
                ngDialog.close();
                switch ($scope.dialogData.type) {
                    case linearSingleOperatorEnum.group:
                    case linearSingleOperatorEnum.beforLine:
                    case linearSingleOperatorEnum.afterLine:
                        $scope.formulaScope.addGroup($scope.dialogData);
                        break;

                    default:
                        var item = { caption: $scope.dialogData.data, script: $scope.dialogData.data, typeItem: $scope.dialogData.type, tag: 0 };
                        $scope.formulaScope.addItem(item);
                }

                $scope.dialogData.data = '';
            };

            $scope.addItem = function (index) {
                $scope.currentItem = index;
                switch ($scope.operands[index].typeItem) {

                    case fieldOperationsEnum.numeric:
                        $scope.dialogData.title = "عدد مورد نظر را وارد نمایید.";
                        $scope.dialogData.type = fieldOperationsEnum.numeric;
                        $scope.openDialog();
                        break;
                    case linearSingleOperatorEnum.comment:
                        $scope.dialogData.title = "شرح مورد نظر را وارد نمایید.";
                        $scope.dialogData.type = linearSingleOperatorEnum.comment;
                        $scope.openDialog();
                        break;
                    case linearSingleOperatorEnum.group:
                        $scope.dialogData.title = "گروه مورد نظر را وارد نمایید.";
                        $scope.dialogData.type = linearSingleOperatorEnum.group;
                        $scope.openDialog();
                        break;
                    case linearSingleOperatorEnum.beforLine:
                        $scope.dialogData.title = "گروه مورد نظر را وارد نمایید.";
                        $scope.dialogData.type = linearSingleOperatorEnum.beforLine;
                        $scope.openDialog();
                        break;
                    case linearSingleOperatorEnum.afterLine:
                        $scope.dialogData.title = "گروه مورد نظر را وارد نمایید.";
                        $scope.dialogData.type = linearSingleOperatorEnum.afterLine;
                        $scope.openDialog();
                        break;
                    default:
                        $scope.formulaScope.addItem($scope.operands[index]);
                        break;
                }

            };

        },

    };
    });
});