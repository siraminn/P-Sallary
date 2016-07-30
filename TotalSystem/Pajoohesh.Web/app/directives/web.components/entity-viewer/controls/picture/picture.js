define(['directives/web.components/entity-viewer/controls/pn.entityViewer.controls'], function (entityViewerControls) {

    var controller = function($scope, $element, $attrs, $timeout) {
        var options = $scope.options;
        options.labelElem = $element.find('label');
        options.editorElem = $element.find('input');

        $scope.fileReaderSupported = window.FileReader != null;
        $scope.photoChanged = function(files){
            if (files != null) {
                var file = files[0];
                if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
                    $timeout(function() {
                        var fileReader = new FileReader();
                        fileReader.readAsDataURL(file);
                        fileReader.onload = function(e) {
                            $timeout(function(){
                                $scope.ngModel = e.target.result;
                            });
                        }
                    });
                }
            }
        };
    };

    entityViewerControls.directive('picture', function factory() {
        var directiveDefinitionObject = {
            templateUrl: "app/directives/web.components/entity-viewer/controls/picture/picture.html",
            restrict: 'E',
            scope: {
                options: '=',
                ngModel: '='
            },
            controller: controller,
            link: function(scope, elem, attr){
            }
        };
        return directiveDefinitionObject;
    });
});