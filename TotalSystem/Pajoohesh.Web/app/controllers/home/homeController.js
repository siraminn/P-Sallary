define(['app'], function (app) {
    app.controller("homeController", ['infWebAccess', '$interval', '$rootScope', 'routeResolver', '$state', '$timeout', "pn.remote.service", "$scope",
        function (WebAccess, $interval, $rootScope, routeResolver, $state, $timeout, remoteService, $scope) {

            //$scope.onChange = function(combo){
            //    alert('changed!')
            //}
            //$scope.selected = 2;
            //$scope.data1 = {
            //    text: 'title',
            //    value: 'id',
            //    transport: {
            //        read: {
            //            url: "http://jsonplaceholder.typicode.com/posts",
            //        }
            //    }
            //};

            remoteService.post(null, WebAccess + 'api/Menu/Menu').then(function (loadDataResult) {
                var menu = loadDataResult.Entity;
                var interval = $interval(function () {
                    if ($rootScope.$$listeners['toolbar:fetched'] != undefined) {
                        $rootScope.$emit('toolbar:fetched', menu);
                        $interval.cancel(interval);
                    }
                }, 200);

                var items = menu.Items;
                var i, j, k, allTabsRoutes = [];
                for (i = 0; i < items.length; i++) {
                    for (j = 0; j < items[i].Features.length; j++) {
                        for (k = 0; k < items[i].Features[j].Functions.length; k++) {
                            allTabsRoutes.push(items[i].Features[j].Functions[k].SystemFeatureViewAction);
                        }
                    }
                }

                var uiTabs = [];
                for (route in routeResolver.route.routes) {
                    if (routeResolver.route.routes.hasOwnProperty(route)) {
                        var routeDefn = routeResolver.route.routes[route];
                        if ((allTabsRoutes.indexOf(route) > -1 || routeDefn.sticky === true) && routeDefn.sticky !== false) {
                            routeDefn.views = {};
                            routeDefn.views[route] = {
                                controller: routeDefn.controller,
                                templateUrl: routeDefn.templateUrl
                            };
                            routeDefn.sticky = true;
                            routeDefn.deepStateRedirect = true;
                            delete routeDefn.controller;
                            delete routeDefn.templateUrl;

                            if (routeDefn.tabMenu !== false)
                                uiTabs.push(route);
                        }

                        routeResolver.route.stateProviderRefrence.state(route, routeDefn);

                        if (routeDefn.stickyGateway === true) {

                            var routeDefnClone = angular.copy(routeDefn);
                            //                            routeDefnClone.views[route] = {
                            //                                controller: function () { console.log('cool'); },
                            //                                template: ''
                            //                            };
                            routeDefnClone.url = routeDefn.url + '_dummy';
                            routeResolver.route.stateProviderRefrence.state(route + "_dummy", routeDefnClone);

                        }
                    }

                    routeResolver.route.futureState.resolve();
                };


                var interval2 = $interval(function () {
                    if ($rootScope.$$listeners['ui-router:sticky:configed'] != undefined) {
                        $rootScope.$emit('ui-router:sticky:configed', uiTabs);
                        $interval.cancel(interval2);
                    }
                }, 200);


            });
        }]);
});