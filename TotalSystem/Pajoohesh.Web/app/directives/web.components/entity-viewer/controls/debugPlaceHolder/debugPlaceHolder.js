define(['directives/web.components/entity-viewer/controls/pn.entityViewer.controls'], function (entityViewerControls) {
   var controller = function($scope, $element){        
        var options = $scope.options;
        options.labelElem = $element.find('label');
        options.editorElem = $element.find('input');
    };

    entityViewerControls.directive('debugPlaceHolder', function factory() {
        var directiveDefinitionObject = {
            templateUrl: "app/directives/web.components/entity-viewer/controls/debugPlaceHolder/debugPlaceHolder.html",
            restrict: 'E',
            scope: {
                options: '='
            },
            controller: controller,
            link: function(scope, elem, attr){

            }
        };
        return directiveDefinitionObject;
    });
    
});