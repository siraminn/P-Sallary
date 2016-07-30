define(['app'], function (app) {
    app.directive('pnStaticPartialEmp', [ function () {
        return {
            restrict: 'E',
          
            templateUrl: function(ele, attrs) {

                return '/app/areas/hr/emp/partials/emploee/EmployeeInfoPartialView.html' ;
                
            }
        };
    }]);
});