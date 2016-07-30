define(["areas/inf/app.areas.inf"], function (inf) {
    inf.register.controller("tabController", function ($scope, $rootScope, $state, $element, $compile, cache) {
        $scope.uiTabs = [];
        $scope.$state = $state;
        cache.tabController  = cache.tabController || {};
        $scope.uiTabs = cache.tabController.uiTabs || [];
        $rootScope.$on("ui-router:sticky:configed", function (ev, uiTabs) {
            cache.tabController.uiTabs = uiTabs;
            $scope.uiTabs = uiTabs;
            //var uiViewContainer = $element.find('.pn-tab-ui-views');
            //uiTabs.forEach(function(uiTab) {
            //    uiViewContainer.append($compile('<div ui-view="' + uiTab + '" ng-show="$state.includes(\'' + uiTab + '\')" ></div>')($scope));
            //});

        });

    });
});
