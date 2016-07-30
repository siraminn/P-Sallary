//import registerShell from './components/shell/shell'

define(['app'], function (app) {
    app.directive('pnHierarchyMeta', function factory() {
        var directiveDefinitionObject = {
            restrict: "E",
            require: 'ngModel',
            scope: {
                data: "=",
                height: "@"
            },
            controller: function ($scope) {
                var defaultData = {
                    head: {
                        count: 1,
                        descriptionRows: 1
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
                            for (i = 0; i < newValue - rowsLength; i++)
                                $scope.data.rows.push({ state: 1 });
                        } else {
                            for (i = 0; i < rowsLength - newValue; i++)
                                $scope.data.rows.pop();
                        }

                    }
                });

                
            },
            compile: function (element, attrs) {
                element.find(".pn-hierarchy-meta-body").slimScroll({
                    position: "left",
                    height: attrs.height,
                    railVisible: true
                });

                return {
                    pre: function (scope, element, attrs, ngModelCtrl) {
                        ngModelCtrl.$setViewValue(newValue);
                    },
                    post: function () {
                        //console.log('PostLink()');
                    }
                };

                
            },
            templateUrl: "app/directives/web.components/hierarchy-meta/hierarchy-meta.html"
        };
        return directiveDefinitionObject;
    });
});