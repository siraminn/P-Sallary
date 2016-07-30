define(['app'], function (app) {
    app.directive('pnHierarchyEditor', function factory() {
        var directiveDefinitionObject = {
            restrict: "E",
            scope: {
                editor: '=',
                //data: "=",
                //meta: "=",
                mode: "@",
                height: "@"
            },
            templateUrl: "app/directives/web.components/hierarchy-meta/pn-hierarchy-editor.html",
            controller: function ($scope, $timeout) {
                
                $scope.onSelectRow = function(index) {
                    $scope.selectedRowIndex = index;
//                    console.log(index);
                }
                $scope.initRepeaterItem = function (index, last, item) {
                    
                    if (index === 0)
                        $scope.deferedTasks = [];

                    $scope.deferedTasks.push(function() {
                        item.levelValue = index;
                        item.labelElement = $scope.thisElement.find('.level-element[data-index=' + index + ']');
                        item.codeElement = item.codeElementOptions.editorElem;
                        item.codeElement.element.on("focus", function () {
                            $scope.onSelectRow(index);
                        });
                        item.descriptionElement = $scope.thisElement.find('.description-element[data-index=' + index + ']');
                    });

                    item.setEnableCode = function(value) {
                        item.codeElementOptions.disabled = !value;
                    }
                    item.setEnableDescription = function(value) {
                        item.descriptionDisabled = !value;
                    }
                    item.setEnableRow = function (value) {
                        item.setEnableCode(value);
                        item.setEnableDescription(value);
                    }
                    item.setVisibility = function (visibility) {
                        if (visibility)
                            $scope.thisElement.find('tr[data-index=' + index + ']').show();
                        else
                            $scope.thisElement.find('tr[data-index=' + index + ']').hide();
                    }
                    
                    if (last) {
                        $timeout(function () {
                            $scope.deferedTasks.forEach(function(task) {
                                task();
                            });
                            $scope.applyMode();
                        }, 200);
                    }
                    
                }

                $scope.applyMode = function () {
                    /*
                    show: 
                            disabled all, show all
                    create: 
                            previous level: show all, disable all
                            current level: show, enable
                    assign:
                        show all
                        enabled only code until current level and current level,
                        disable after current level
                    */
                    var rowsLen = $scope.editor.meta.rows.length;
                    if ($scope.mode === 'show') {
                        $scope.editor.api.setEnable(false, 0, rowsLen);
                        $scope.editor.api.setVisibility(true, 0, rowsLen);
                    }
                    if ($scope.mode === 'create') {
                        $scope.editor.api.setEnable(false, 0, rowsLen);
                        $scope.editor.api.setVisibility(true, 0, rowsLen);
                    }
                };

                $scope.$watch("editor.meta.rows", function (newValue, oldValue) {
                    if (!newValue)
                        return;

                    var genMask = function (rowLength) {
                        var mask = "";
                        for (var i = 0; i < rowLength; i++) {
                            mask += "0";
                        }
                        return mask;
                    }

                    $scope.editor.data = [];
                    newValue.forEach(function (row) {
                        $scope.editor.data.push({});
                        row.codeElementOptions = {
                            kendoOptions: {
                                mask: genMask(row.rowLength)
                            }
                        };
                    });
                    
                });

                $scope.editor.api = {
                    setEnable: function (enable, index, offset) {
                        var i = 0;
                        //for (i = 0; i < $scope.editor.meta.rows.length; i++) {
                        //    $scope.editor.meta.rows[i].setEnableCode(!enable);
                        //    $scope.editor.meta.rows[i].setEnableDescription(!enable);
                        //}
                        for (i = index; i < index + offset; i++) {
                            $scope.editor.meta.rows[i].setEnableCode(enable);
                            $scope.editor.meta.rows[i].setEnableDescription(enable);
                        }
                    },
                    setVisibility: function (visibility, index, offset) {
                        var i = 0;
                        //for (i = 0; i < $scope.editor.meta.rows.length; i++) {
                        //    $scope.editor.meta.rows[i].setVisibility(!visibility);
                        //}
                        for (i = index; i < index + offset; i++) {
                            $scope.editor.meta.rows[i].setVisibility(visibility);
                        }
                        
                    }
                }

            },
            compile: function (element, attrs) {
                element.find(".pn-hierarchy-editor-body").slimScroll({
                    position: "left",
                    height: attrs.height,
                    railVisible: true
                });

                return {
                    pre: function (scope, element, attrs, ngModelCtrl) {
                        scope.thisElement = element;
                        //ngModelCtrl.$setViewValue(scope.data);
                    },
                    post: function () {
                        //console.log('PostLink()');
                    }
                };
            }
            
        };
        return directiveDefinitionObject;
    });
});