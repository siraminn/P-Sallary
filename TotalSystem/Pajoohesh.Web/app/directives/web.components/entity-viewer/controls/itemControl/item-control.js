define(['directives/web.components/entity-viewer/controls/pn.entityViewer.controls'], function (entityViewerControls) {
   
  
    entityViewerControls.directive('itemControl', function factory() {
        var directiveDefinitionObject = {
            templateUrl: "app/directives/web.components/entity-viewer/controls/itemControl/item-control.html",
            restrict: 'E',
            scope: {
                options: '=',
                value: '=',
                tag: '@'
            },
            controller: function ($scope, $element, $attrs, $compile) {
                var items = [];
                var options = $scope.options;

                options.labelElem = $element.find('label');
                if ($element.find('input:not(.if-yes)').length === 1)
                    options.editorElem = $element.find('input');

                options.kendoOptions = {};
                var tagSplit = $scope.tag.split(' ');
                $scope.tagAttr = '';
                if (tagSplit.length > 1) {
                    $scope.tag = tagSplit[0];
                    $scope.tagAttr = tagSplit.join(' ').replace($scope.tag, "");
                }


                if ($scope.tag === 'pn-numeric') {
                    if (options.type === 'smallint') {
                        options.minRange = isNaN(options.minRange) ? -1 * Math.pow(2, 15) : options.minRange;
                        options.maxRange = isNaN(options.maxRange) ? Math.pow(2, 15) - 1 : options.maxRange;
                    }
                    if (options.type === 'int') {
                        options.minRange = isNaN(options.minRange) ? -1 * Math.pow(2, 31) : options.minRange;
                        options.maxRange = isNaN(options.maxRange) ? Math.pow(2, 31) - 1 : options.maxRange;
                    }
                    if (options.type === 'bigint') {
                        options.minRange = isNaN(options.minRange) ? -1 * Math.pow(2, 63) : options.minRange;
                        options.maxRange = isNaN(options.maxRange) ? Math.pow(2, 63) - 1 : options.maxRange;
                    }
                    options.pattern = /\d*/;
                    options.labelElem = $element.find('label');
                    options.editorElem = $element.find('input');
                }

                if ($scope.tag === 'pn-dropdownlist') {
                    options.items = options.items || [];
                    options.items.forEach(function (v, i) {
                        items.push({ text: v.Value, value: v.Key });
                    });
                    $scope.value = [];
                    options.kendoOptions.dataSource = items;
                    options.kendoOptions.dataTextField = "text";
                    options.kendoOptions.dataValueField = "value";
                }

                if ($scope.tag === 'pn-multiselect') {
                    options.items.forEach(function (v, i) {
                        items.push({ text: v, value: v });
                    });
                    $scope.value = [];
                    options.kendoOptions.dataSource = items;
                    options.kendoOptions.dataTextField = "text";
                    options.kendoOptions.dataValueField = "value";                    
                }

                options.disabled = true;
                //options.disabled = $scope.options.ifYes || false;
                //var template = `<${$scope.tag} ${$scope.tagAttr} ng-model="value"  options='options' ng-disabled='options.disabled' ></${$scope.tag}>`;
                var template = ["<" + $scope.tag, $scope.tagAttr, "ng-model='value'", "options='options'", "ng-disabled='options.disabled'", ">", "</" + $scope.tag + ">"].join(" ");
                var el = $compile(template)($scope);
                $element.find('span').replaceWith(el);
            }
        };
        return directiveDefinitionObject;
    });
    
});