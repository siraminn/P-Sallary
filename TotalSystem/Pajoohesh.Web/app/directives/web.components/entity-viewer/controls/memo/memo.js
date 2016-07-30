define(['directives/web.components/entity-viewer/controls/pn.entityViewer.controls'], function (entityViewerControls) {

   var controller = function($scope, $element, $attrs) {
        var options = $scope.options;
        options.labelElem = $element.find('label');
        options.editorElem = $element.find('.form-control');
        options.height = 200;

        $scope.openEditor = function(){
            if(!$scope.options.disabled)
                $scope.$root.$broadcast('memeoEditor:open', $scope.value, setValue);
        };
        var setValue = function(val){
            $scope.value = val;
        }

    };

    entityViewerControls.directive('memo', function factory() {
        var directiveDefinitionObject = {
            templateUrl: "app/directives/web.components/entity-viewer/controls/memo/memo.html",
            restrict: 'E',
            scope: {
                options: '=',
                ngModel: '='
            },
            controller: controller,
            link: function (scope, elem, attr) {
            }
        };
        return directiveDefinitionObject;
    });   
    
});
