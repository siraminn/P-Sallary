define(["areas/hr/prs/app.areas.hr.prs"], function (prs) {

    prs.register.controller("personnelDynamicController",
        ["$scope", "$timeout", "pn.remote.service", "pn.dialog", "pn.focus",
        "pn.enum", "pn.array", "Notification", "$window", "$rootScope", "$stateParams", "empWebAccess",
        "cache", "$state", "pn.errorHandler","$q",
        function ($scope, $timeout, remoteService, dialog, focus, pnenum,
                  pnarray, notify, $window, $rootScope, $stateParams, empWebAccess,
                  cache, $state, errorHandler,$q) {

            var routePrefix = 'home.tab.basicTables';
            $scope.tabData=
                {
                    url: empWebAccess + 'api/PRSCommonService/GetTableListofGroup',
                    isDynamic: true,
                    routePrefix: routePrefix,

                    model: { name: 'PersianName' },
                    fixedTabs: [
                        //{ persianName: 'مشخصات پرسنل', urlName: routePrefix + '.personelInfo' }
                    ]
                };

            $scope.tabRoute = prsTabRoute;

              }]);
});