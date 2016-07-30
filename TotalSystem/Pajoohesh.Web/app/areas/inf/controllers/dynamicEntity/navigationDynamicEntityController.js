define(["areas/inf/app.areas.inf"], function (inf) {
    inf.register.controller("navigationDynamicEntityController", ["$rootScope", "$scope", "$state", "cache", "pn.dialog",
        function ($rootScope,$scope, $state, cache, dialog) {

            $scope.umsCache = $scope.umsCache || {};
            $scope.umsCache = cache.umsCache;

            $scope.tab =
                    {
                        model: { name: 'persianName' },
                        fixedTabs: [
                                { persianName: 'تعریف جدول', urlName: 'home.tab.navigationDynamicEntity.createDynamicEntity', icon: 'th-list', isActive: true },
                                { persianName: 'تعریف فیلد ', urlName: 'home.tab.navigationDynamicEntity.createDynamicField', icon: 'th-list', isActive: false },
                        ]
                    };
            $state.go("home.tab.navigationDynamicEntity.createDynamicEntity");

            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                if (toState.name == "home.tab.navigationDynamicEntity.createDynamicField") {
                    if (angular.isUndefined($rootScope.selectedItemDynamicEntity) || $rootScope.selectedItemDynamicEntity==false) {
                        event.preventDefault();
                        dialog.showMessage("خطا", "لطفا ابتدا گروه جداول را انتخاب کنید");
                    }
                }
              

            })
            
        }]);
});