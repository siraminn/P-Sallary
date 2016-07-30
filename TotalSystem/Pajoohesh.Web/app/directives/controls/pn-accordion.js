define(['directives/controls/pnControls'], function (control) {
    control.controller('test', function ($scope) {
        $scope.panelBarOptions = {
            contentUrls: [null, null, null]
        };
        expandMode: "single"
        $scope.hello = "Hello from controller";
    });

     control.directive('pnAccordion', function () {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                Config: "=config",
            },
            template: '<ul kendo-panel-bar k-options="Config">'+
                      '</ul>'                    
            ,
            link : function(scope, element, attrs){
                //scope.panelBarOptions = {
                //    contentUrls: [null, null, "../content/web/loremIpsum.html"]
                //};
                //scope.hello = "Hello from controller";
            }
        };
    });
});







