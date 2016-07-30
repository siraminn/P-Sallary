define(['directives/web.components/formula/services/pn.formula.services'], function (formulaControls){

    formulaControls.directive('pnFormula', ['formulaService', function(formulaService){
     return {
        restrict: 'E',
        replace: true,
        templateUrl: 'app/directives/web.components/formula/controls/formula/pn-formula.html',
        controller: function ($scope, $compile, $http, $filter, $element, notificationService, formulaService) {

            $scope.rows = [];

            $scope.usedVariables = [];
            $scope.variables = [];
            $scope.parantezcalItems = [];
            $scope.items = [];
            $scope.result = '';
            $scope.title = 'Formula 1';
            $scope.currentLineIndex = -1;
            $scope.selectedRowIndex = 0;
            $scope.currentItemIndex = -1;
            $scope.variableCount = 0;
            $scope.allowAddEqual = true;

            $scope.addToVariable = function (item) {
                $scope.variables.push({
                    caption: item.caption,
                    script: item.script,
                    typeItem: fieldOperationsEnum.variable,
                    tag: item.tag,
                    tagStr: "",
                });
            };

            $scope.canAddLine = function () {
                return $scope.selectedRowIndex !=-1 &&($scope.rows[$scope.selectedRowIndex].Lines.length == 0 || $scope.rows[$scope.selectedRowIndex].Lines[$scope.currentLineIndex].Items.length > 0);
            };

            $scope.canInsertLine = function () {
                return $scope.currentLineIndex != -1 && $scope.rows[$scope.selectedRowIndex].Lines[$scope.currentLineIndex].Items.length > 0;
            };

            $scope.canInsertBeforLine = function () {
                return $scope.currentLineIndex != -1 && $scope.rows[$scope.selectedRowIndex].Lines[$scope.currentLineIndex].Items.length > 0;
            };

            $scope.canDeleteGroup = function () {
                return $scope.selectedRowIndex > 0;
            };

            $scope.canAddNewVariable = function () {
                return $scope.currentLineIndex != -1 && $scope.rows[$scope.selectedRowIndex].Lines[$scope.currentLineIndex].Items.length == 0;
            };

            $scope.addLine = function () {
                var obj = {
                    "Items": []
                };

                $scope.rows[$scope.selectedRowIndex].Lines.push(obj);
                $scope.currentLineIndex = $scope.rows[$scope.selectedRowIndex].Lines.length - 1;
                $scope.currentItemIndex = -1;
                $scope.getVariablesByLine();
            };

            $scope.insertLine = function (type) {
                var obj = {
                    "Items": []
                };

                switch (type) {
                    case "befor":
                        // $scope.currentLineIndex = $scope.currentLineIndex;
                        break;
                    case "after":
                        $scope.currentLineIndex = $scope.currentLineIndex + 1;
                        break;
                }

                $scope.rows[$scope.selectedRowIndex].Lines.splice($scope.currentLineIndex, 0, obj);
                $scope.currentItemIndex = -1;
                $scope.getVariablesByLine();
            };

            $scope.addGroup = function (item) {

                var obj = {
                    "Items": []
                };
                var row = {
                    Group: item.data,
                    Lines: []
                };

                row.Lines.push(obj);



                switch (item.type) {
                    case linearSingleOperatorEnum.beforLine:
                        row.Lines = $scope.rows[$scope.selectedRowIndex].Lines.slice($scope.currentLineIndex);
                        $scope.rows[$scope.selectedRowIndex].Lines.splice($scope.currentLineIndex);
                        $scope.rows.splice(++$scope.selectedRowIndex, 0, row);
                        
                        break;
                    case linearSingleOperatorEnum.afterLine:
                        row.Lines = $scope.rows[$scope.selectedRowIndex].Lines.slice($scope.currentLineIndex + 1);
                        $scope.rows[$scope.selectedRowIndex].Lines.splice($scope.currentLineIndex + 1);
                        $scope.rows.splice(++$scope.selectedRowIndex, 0, row);

                        break;
                    case linearSingleOperatorEnum.group:
                        $scope.rows.push(row);
                        $scope.selectedRowIndex = $scope.rows.length - 1;

                        break;
                    default:
                }
                $scope.currentLineIndex = 0;
                $scope.currentItemIndex = -1;
                $scope.getVariablesByLine();
            };

            $scope.getAllLine = function () {

                var lines = [];
                angular.forEach($scope.rows, function (row) {
                    lines.push.apply(lines, row.Lines);
                });
                return lines;
            };

            $scope.getVariablesByLine = function () {
                var lines = [];
                $scope.variables = [];

                for (var i = 0; i <= $scope.rows.length - 1; i++) {
                    if (i == $scope.selectedRowIndex) {
                        for (var j = 0; j <= $scope.currentLineIndex - 1; j++) {
                            lines.push($scope.rows[i].Lines[j]);
                        }
                        break;
                    }
                    lines.push.apply(lines, $scope.rows[i].Lines);
                }

                for (var k = 0; k <= lines.length - 1; k++) {
                    var items = $filter('filter')(lines[k].Items, { typeItem: fieldOperationsEnum.variable, tagStr: "new" }, true);
                    items.forEach(function (item) {
                        if ($scope.variables.indexOf(item.script) === -1) {
                            $scope.addToVariable(item);
                        }
                    });
                };
            };

            $scope.getLastVariableId = function () {
                var lines = $scope.getAllLine();
                var newVariables = [];
                for (var k = 0; k <= lines.length - 1; k++) {
                    var items = $filter('filter')(lines[k].Items, { typeItem: fieldOperationsEnum.variable, tagStr: "new" }, true);
                    if (items.length > 0) {
                        newVariables.push(items[0].script);
                    }
                };

                if (newVariables.length > 0) {
                    var script = newVariables[newVariables.length - 1];
                    $scope.variableCount = script.substring(4);
                }
            };

            $scope.restoreVariables = function () {
                var variables = [];
                var lines = $scope.getAllLine();

                for (var i = 0; i <= lines.length - 1; i++) {
                    var items = $filter('filter')(lines[i].Items, { typeItem: fieldOperationsEnum.variable, tagStr: "new" }, true);
                    items.forEach(function (item) {
                        if (variables.indexOf(item.script) === -1) {
                            variables.push({
                                caption: item.caption,
                                script: item.script,
                                typeItem: fieldOperationsEnum.variable,
                                tag: item.tag,
                                tagStr: "",
                            });
                            $scope.usedVariables.push(item.script);
                        }
                    });
                };
                return variables;
            };

            $scope.createItem = function (data) {
                var item;

                switch (data.typeItem) {
                    case fieldOperationsEnum.numeric:
                    case fieldOperationsEnum.variable:
                    case fieldOperationsEnum.field:
                        item = new fieldOperations(data.caption, data.script, data.tag, data.typeItem, data.tagStr);
                        break;
                    case linearSingleOperatorEnum.comment:
                        item = new linearSingleOperator(data.caption, data.script, data.tag, data.typeItem, data.tagStr);
                        break;
                    case parantezEnum.openParantez:
                    case parantezEnum.closeParantez:
                        item = new parantez(data.caption, data.script, data.tag, data.typeItem, data.tagStr);
                        break;
                    case mathematicalOperatoEnum.plus:
                    case mathematicalOperatoEnum.minus:
                    case mathematicalOperatoEnum.division:
                    case mathematicalOperatoEnum.korrutada:
                    case mathematicalOperatoEnum.power:
                        item = new mathematical(data.caption, data.script, data.tag, data.typeItem, data.tagStr);
                        break;
                    case comparisonOperatorEnum.equal:
                    case comparisonOperatorEnum.greater:
                    case comparisonOperatorEnum.less:
                    case comparisonOperatorEnum.greaterEqual:
                    case comparisonOperatorEnum.lessEqual:
                        item = new comparisonOperator(data.caption, data.script, data.tag, data.typeItem, data.tagStr);
                        break;
                    default:
                        item = undefined;
                        break;
                }
                return item;
            };

            $scope.checkVariableIsUsed = function (item) {
                var result = false;
                var lines = $scope.getAllLine();
                angular.forEach(lines, function (line) {
                    var found = $filter('filter')(line.Items, { script: item.script, tagStr: "" }, true);
                    if (found.length) {
                        result = true;
                        return;
                    }
                });
                return result;
            };
            
            $scope.checkValiableIsInitialized = function (item) {
                var result = false;
                var lines = $scope.getAllLine();
                angular.forEach(lines, function (line) {
                    var found = $filter('filter')(line.Items, { typeItem: fieldOperationsEnum.variable, script: item.script, tagStr: "new", }, true);
                    if (found.length) {
                       if(line.Items.length > 2)
                        result = true;
                        return;
                    }
                });
                return result;
            };

            $scope.deleteVariable = function (index) {
                var variable = $scope.variables[index];
                if ($scope.checkVariableIsUsed(variable)) {
                    notificationService.displayError("متغیر در فرمول استفاده شده است!");
                    return false;
                }
                if ($scope.checkValiableIsInitialized(variable)) {
                    notificationService.displayError("متغیر مقدار دهی شده است!");
                    return false;
                }
                for (var i = 0; i <= $scope.rows.length - 1; i++) {
                    for (var j = 0; j <= $scope.rows[i].Lines.length - 1; j++) {
                        for (var k = 0; k <= $scope.rows[i].Lines[j].Items.length - 1; k++) {
                            if ($scope.rows[i].Lines[j].Items[k].script === variable.script) {
                                $scope.rows[i].Lines[j].Items.splice(k, 2);
                                $scope.variables.splice(index, 1);
                                return true;
                            }
                        }
                    }
                }
                return false;
            };

            $scope.allowToDeleteLine = function () {
                var result = true;
                if ($scope.rows[$scope.selectedRowIndex].Lines[$scope.currentLineIndex].Items.length != 0) {
                    var firstItem = $scope.rows[$scope.selectedRowIndex].Lines[$scope.currentLineIndex].Items[0];
                    if (firstItem.tagStr == "new" && $scope.checkVariableIsUsed(firstItem)) {
                        notificationService.displayError("متغیر در فرمول استفاده شده است و خط قابل حذف نمی باشد.");
                        result = false;
                    }
                }
                return result;
            };

            $scope.deleteLine = function () {

                if ($scope.allowToDeleteLine()) {
                    $scope.rows[$scope.selectedRowIndex].Lines.splice($scope.currentLineIndex, 1);
                    $scope.usedVariables = [];
                    //گروه پیش فرض نباید حذف شود $scope.selectedRowIndex != 0
                    if ($scope.selectedRowIndex != 0 && $scope.rows[$scope.selectedRowIndex].Lines.length == 0) {
                        $scope.rows.splice($scope.selectedRowIndex);
                        $scope.selectedRowIndex = -1;
                        $scope.currentLineIndex = -1;
                        $scope.currentItemIndex = -1;
                    } else {
                        $scope.currentLineIndex = $scope.rows[$scope.selectedRowIndex].Lines.length - 1;
                        $scope.currentItemIndex = -1;
                        $scope.getVariablesByLine();
                    }
                 

                }

            };

            $scope.deleteGroup = function () {

                var lines = $scope.rows[$scope.selectedRowIndex].Lines.slice(0);
                $scope.rows[$scope.selectedRowIndex - 1].Lines.push.apply($scope.rows[$scope.selectedRowIndex - 1].Lines, lines);
                $scope.rows.splice($scope.selectedRowIndex, 1);
                $scope.selectedRowIndex = $scope.selectedRowIndex - 1;
                $scope.currentLineIndex = $scope.rows[$scope.selectedRowIndex].Lines.length - 1;
                $scope.currentItemIndex = $scope.rows[$scope.selectedRowIndex].Lines[$scope.currentLineIndex].Items.length - 1;
                $scope.getVariablesByLine();

            };

            $scope.deleteVariableByItem = function (item) {

                if ($scope.currentItemIndex == 0 && item.tagStr == "new") {
                    if ($scope.checkVariableIsUsed(item)) {
                        notificationService.displayError("متغیر در فرمول استفاده شده است!");
                        return;
                    }
                    if ($scope.checkValiableIsInitialized(item)) {
                        notificationService.displayError("متغیر مقدار دهی شده است!");
                        return;
                    }
                    else {
                        //حذف متغیر به همراه مساوی
                        $scope.rows[$scope.selectedRowIndex].Lines[$scope.currentLineIndex].Items.splice($scope.currentItemIndex, 2);
                        $scope.currentItemIndex = $scope.rows[$scope.selectedRowIndex].Lines[$scope.currentLineIndex].Items.length - 1;
                    }
                } else {
                    $scope.rows[$scope.selectedRowIndex].Lines[$scope.currentLineIndex].Items.splice($scope.currentItemIndex, 1);
                    $scope.currentItemIndex = $scope.rows[$scope.selectedRowIndex].Lines[$scope.currentLineIndex].Items.length - 1;
                }
            };

            $scope.deleteEqualItem = function () {
                var beforItem = $scope.rows[$scope.selectedRowIndex].Lines[$scope.currentLineIndex].Items[$scope.currentItemIndex - 1];
                if (beforItem.typeItem == fieldOperationsEnum.variable && beforItem.tagStr == "new") {
                    if ($scope.checkVariableIsUsed(beforItem)) {
                        notificationService.displayError("متغیر در فرمول استفاده شده است!");
                        return;
                    }
                    if ($scope.checkValiableIsInitialized(beforItem)) {
                        notificationService.displayError("متغیر مقدار دهی شده است!");
                        return;
                    }
                    else {
                        //حذف متغیر به همراه مساوی
                        $scope.rows[$scope.selectedRowIndex].Lines[$scope.currentLineIndex].Items.splice($scope.currentItemIndex - 1, 2);
                        $scope.currentItemIndex = $scope.rows[$scope.selectedRowIndex].Lines[$scope.currentLineIndex].Items.length - 1;
                    }
                } else {
                    $scope.rows[$scope.selectedRowIndex].Lines[$scope.currentLineIndex].Items.splice($scope.currentItemIndex, 1);
                    $scope.currentItemIndex = $scope.rows[$scope.selectedRowIndex].Lines[$scope.currentLineIndex].Items.length - 1;
                }
            };

            $scope.deleteItem = function () {
                var item = $scope.rows[$scope.selectedRowIndex].Lines[$scope.currentLineIndex].Items[$scope.currentItemIndex];
                switch (item.typeItem) {
                    case fieldOperationsEnum.variable:
                        $scope.deleteVariableByItem(item);
                        break;
                    case comparisonOperatorEnum.equal:
                        $scope.deleteEqualItem(item);
                        break;
                    default:
                        $scope.rows[$scope.selectedRowIndex].Lines[$scope.currentLineIndex].Items.splice($scope.currentItemIndex, 1);
                        $scope.currentItemIndex = $scope.rows[$scope.selectedRowIndex].Lines[$scope.currentLineIndex].Items.length - 1;
                        break;
                }

            };

            $scope.validationAllItems = function () {
                var result = true;
                angular.forEach($scope.rows, function (row) {
                    angular.forEach(row.Lines, function (line) {
                        for (var i = 0; i < line.Items.length - 1; i++) {
                            if (!line.Items[i].validationTypeItemNext(line.Items[i + 1])) {
                                line.Items[i + 1].isvalid = false;
                                result = false;
                                return result;
                            } else {
                                line.Items[i + 1].isvalid = true;
                            }

                        }
                    });
                });

                if (result) {
                    notificationService.displaySuccess("فرمول صحیح می باشد،");

                } else {
                    notificationService.displayError("فرمول صحیح نمی باشد،");
                }
            };

            $scope.addOperator = function (i) {
                var item = $scope.operators[i];
                $scope.addItem(item);
            };

            $scope.SaveToServer = function () {
                formulaService.saveFormula($scope.rows).then(function (data) {
                    if (data) {
                        notificationService.displaySuccess("فرمول ذخیره گردید");
                    } else {
                        notificationService.displayError("خطایی در عملیات ذخیره سازی فرمول رخ داده است");
                    }
                });
            };

            $scope.GetFromServer = function (formulaName) {
                formulaService.getFormula(formulaName).then(function (data) {
                    if (data.length == 0) {
                        notificationService.displayWarning("اطلاعاتی جهت بازیابی وجود ندارد");

                    } else {
                        $scope.rows = JSON.parse(data);
                        $scope.initialAfterRestoreItems();
                        notificationService.displaySuccess("فرمول بازیابی گردید");
                    }

                });
            };

            $scope.initialAfterRestoreItems = function () {

                $scope.selectedRowIndex = $scope.rows.length - 1;
                $scope.currentLineIndex = $scope.rows[$scope.selectedRowIndex].Lines.length - 1;
                $scope.currentItemIndex = $scope.rows[$scope.selectedRowIndex].Lines[$scope.currentLineIndex].Items.length - 1;
                $scope.variables = $scope.restoreVariables();

                $.each($scope.rows, function (i) {
                    $scope.rows[i].Lines.forEach(function (line) {
                        line.Items.forEach(function (item) {
                            item.__proto__ = baseItem.prototype;
                        });
                    });
                });

                $scope.getVariablesByLine();
                $scope.getLastVariableId();
            };

            $scope.addItem = function (data) {
                var result = false;
                if ($scope.checkVallidateNextItem(data)) {
                    var item = $scope.createItem(data);
                    if (item == undefined) {
                        notificationService.displayError("آیتم در سیستم تعریف نشده است!");
                    } else {
                        if ($scope.currentItemIndex != -1) {
                            $scope.rows[$scope.selectedRowIndex].Lines[$scope.currentLineIndex].Items.splice($scope.currentItemIndex + 1, 0, item);
                            $scope.currentItemIndex = $scope.currentItemIndex + 1;
                        } else {
                            $scope.rows[$scope.selectedRowIndex].Lines[$scope.currentLineIndex].Items.push(item);
                            $scope.currentItemIndex = $scope.rows[$scope.selectedRowIndex].Lines[$scope.currentLineIndex].Items.length - 1;
                        }
                        result = true;
                    }

                }
                return result;
            };

            $scope.selectLine = function (index, rowIndex) {

                $scope.selectedRowIndex = rowIndex;
                $scope.currentLineIndex = index;
                $scope.currentItemIndex = $scope.rows[rowIndex].Lines[index].Items.length - 1;
                $scope.getVariablesByLine();
            };

            $scope.selectGroup = function (index) {
                /* $scope.selectedRowIndex = index;
                 $scope.currentLineIndex = $scope.rows[index].Lines.length > 0 ? $scope.rows[index].Lines.length - 1 : -1;
                 $scope.currentItemIndex = $scope.currentLineIndex > 0 && $scope.rows[index].Lines[$scope.currentLineIndex].Items.length > 0 ? $scope.rows[index].Lines[$scope.currentLineIndex].Items.length - 1 : -1;
 
                 $scope.getVariablesByLine();*/
            };

            $scope.selectItem = function (index, lineIndex, rowIndex) {

                $scope.selectedRowIndex = rowIndex;
                $scope.currentItemIndex = index;
                $scope.currentLineIndex = lineIndex;
                $scope.getVariablesByLine();
            };

            $scope.checkVallidateNextItem = function (nextItem) {

                if ($scope.currentItemIndex != -1 && !$scope.rows[$scope.selectedRowIndex].Lines[$scope.currentLineIndex].Items[$scope.currentItemIndex].validationTypeItemNext(nextItem)) {
                    notificationService.displayError(" مجاز به استفاده از'" + $scope.getItemTypeTitle(nextItem) + "' نمی باشید");
                    return false;
                }
                return true;
            };

            $scope.getItemTypeTitle = function (item) {
                var title = "";
                switch (item.typeItem) {
                    case fieldOperationsEnum.numeric:
                        title = "عدد";
                        break;
                    case fieldOperationsEnum.variable:
                        title = "متغیر";
                        break;
                    case fieldOperationsEnum.field:
                        title = "فیلد";
                        break;
                    case linearSingleOperatorEnum.comment:
                        title = "شرح";
                        break;
                    case linearSingleOperatorEnum.group:
                        title = "گروع";
                        break;
                    default:
                        title = item.caption;
                }
                return title;
            };

            $scope.init = function () {
                var obj = {
                    "Items": []
                };
                $scope.rows.push({
                    Group: 'defultGroup',
                    Lines: []
                });
                $scope.rows[0].Lines.push(obj);
                $scope.currentLineIndex = 0;
            };

            $scope.init();
        },
    };
    }]);

});