define(["areas/finance/acc/app.areas.finance.acc"], function (acc) {
    acc.register.controller("periodController", ["$scope", "$state", function ($scope, $state) {

                //******************tab***********************
             $scope.tab ={
                        model: { name: 'persianName' },
                        fixedTabs:  [{ persianName: 'لیست دفاتر', urlName: 'home.tab.period.list', icon: 'list', isActive: true },
                                     { persianName: 'ویرایش دفاتر', urlName: 'home.tab.period.edit', icon: 'plus', isActive: false }],
                       };

        //*****فعال نمودن تب اول****
             $state.go('home.tab.period.list');
    }]);
});