define(['app'], function (app) {
    console.log(app);
    app.directive('pnHierarchyMeta', function factory() {
        var directiveDefinitionObject = {
            restrict: "E",
            scope: {
                data: "=",
                height: "@",
                editable: "="
            },
            templateUrl: "app/directives/web.components/hierarchy-meta/pn-hierarchy-meta.html",
            controller: function ($scope) {

                if (angular.isDefined($scope.editable)) {
                    $scope.editable = true;
                }
                var defaultData = {
                    head: {
                        count: 1,
                        descriptionRows: 1,
                        countNoAction: 0,
                        description: ""

                    },
                    rows: []
                };
                $scope.data = angular.extend({}, $scope.data, defaultData);
                $scope.config = {
                    rowStateOptions: [
                        { title: "بدون تکرار در سطح بالاتر", id: 1 },
                        { title: "بدون تکرار در سطوح یکسان", id: 2 }
                    ]
                }

                $scope.$watch("data.head.count", function (newValue, oldValue) {
                    var i;
                    if (newValue) {
                        var rowsLength = $scope.data.rows.length;
                        if (rowsLength <= newValue) {
                            for (i = 0; i < newValue - rowsLength; i++) {
                                $scope.data.rows.push({ status: newValue == 1 ? true : false, state: newValue == 1 ? "2" : "1", rowLength: 2 });
                            }

                        } else {
                            for (i = 0; i < rowsLength - newValue; i++)
                                $scope.data.rows.pop();
                        }
                    }
                    else {
                        $scope.data = defaultData;
                    }
                });

                $scope.$watch("data.head.countNoAction", function (newValue, oldValue) {
                    if (newValue) {
                        debugger;
                        if ($scope.data.head.count > newValue) {
                            for (var i = 0; i < $scope.data.head.count; i++) {
                                if (newValue > i) {
                                    $scope.data.rows[i + 1].status = true;
                                    $scope.data.rows[i + 1].state = "2";
                                }
                                else {
                                    $scope.data.rows[i + 1].status = false;
                                    $scope.data.rows[i + 1].state = "1";
                                }
                            }
                        }
                        else {
                            $scope.data.head.countNoAction = oldValue;
                        }
                    }
                });


            },
            compile: function (element, attrs) {
                element.find(".pn-hierarchy-meta-body").slimScroll({
                    position: "left",
                    height: attrs.height,
                    railVisible: true,
                    //alwaysVisible: true
                });

                return {
                    pre: function (scope, element, attrs, ngModelCtrl) {
                        //ngModelCtrl.$setViewValue(scope.data);
                    },
                    post: function () {

                    }
                };
            }

        };
        return directiveDefinitionObject;
    });
});