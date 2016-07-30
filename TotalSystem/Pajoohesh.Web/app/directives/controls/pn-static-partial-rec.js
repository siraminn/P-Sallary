define(['app'], function (app) {
    app.directive('pnStaticPartialRec', [ function () {
        return {
             
                //transclude: true,
                //scope: {
                //    // hiddensearch: '@',
                //     //disabledinfo: '@',
                //     // hiddeninfo: '@',
                //},

            restrict: 'E',
          
            templateUrl: function(ele, attrs) {
                return '/app/areas/hr/rec/views/partial/RecEmployeeInfoPartialView.html' ;
                
            }
        };
    }]);
});