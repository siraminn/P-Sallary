define(['app'], function (app) {
    app.directive('pnTab', [
        "pn.remote.service", "pn.array", "$http", "$compile", "$rootScope", "$state", "routeResolver",
        function (pnRemoteService, pnarray, $http, $compile, $rootScope, $state, routeResolver) {
            return {
                restrict: 'EA',
                replace: true,
                scope: {
                    data: "=",
                    route: "=",
                    onTabClick: "&"
                },
                template:
                    '<div  class="row profile">' +
                        '<div class="col-md-2 ma22" > <div class="profile-sidebar"> <div class="profile-usermenu"> <ul id="tabHeader" class="nav" >' + '</ul></div></div></div>' +
                        '<div class="col-md-10 ma22" > <div class="profile-content ma22 maqk"><div ui-view></div></div>' +
                      '</div>',

                link: function (scope, element, attrs, ctrl, transclude) {
                    scope.$state = $state;
                    var uiViewContainer = element.find('.profile-content');
                    var el = element.find('#tabHeader');

                    angular.forEach(scope.data.fixedTabs, function (tab, index) {
                        el.append($compile('<li class="list-group-item"><a ng-click=\'tabClick($event, ' + '"' + tab.urlName + '")\' ui-sref=' + '"' + tab.urlName + '">' + tab.persianName + '<span class="pn-tab-size pull-left glyphicon glyphicon-' + tab.icon + '"></span></a></li>')(scope));
                        //el.append($compile('<li class="list-group-item"><a ng-click=\'tabClick(' + '"' + tab.urlName + '")\' >' + tab.persianName + '<span class="pn-tab-size pull-left glyphicon glyphicon-' + tab.icon + '"></span></a></li>')(scope));
                        uiViewContainer.append($compile('<div ui-view="' + tab.urlName + '" ng-show="$state.current.name === \'' + tab.urlName + '\'" ></div>')(scope));
                    });

                    scope.tabClick = function ($event, route) {
                        if (scope.onTabClick({ route: route }) === "stop") {
                            $event.preventDefault();
                        }
                        
                    }

                    if (scope.data.isDynamic == null) {
                        scope.data.isDynamic = false;
                    }

                    $rootScope.$emit('pnTab:document:ready', {
                        $state: $state,
                        timestap: (new Date()).getTime()
                    });

                    if (scope.data.isDynamic) {
                        var routes = [];
                        scope.dynamicRoutrResolve = function () {

                        };

                        pnRemoteService.get(null, scope.data.url).then(function (result) {
                            var tableLists = result.Entities;
                            if (tableLists) {
                                var newStates = [];
                                var route = routeResolver.route;
                                angular.forEach(tableLists, function (table, index) {
                                    if (table[scope.data.model.name.toString()] !== "") {

                                        var routeDyno = scope.data.routePrefix + "." + table.LatinName.replace(/\./g, '_');
                                        scope.route.pageTitle = '';//table.PersianName;
                                        var routeDefn = route.resolve(
                                            scope.route.url + table.LatinName.replace(/\./g, '_'), //row.url
                                            scope.route.access, //row.access
                                            scope.route.subSystem, //row.subSystem, 
                                            scope.route.module, //row.module, 
                                            scope.route.folder, //row.folder,
                                            scope.route.controller, //row.controller, 
                                            scope.route.view, //row.view, 
                                            scope.route.pageTitle, //row.pageTitle, 
                                            scope.route.sticky, //row.sticky,  // TODO Make true
                                            scope.route.tabMenu, //row.tabMenu,
                                            scope.route.stickyGateway
                                        );
                                        routeDefn.data = table.LatinName;
                                        //routeDefn.params = {
                                        //    currentForm: { value: tab.LatinName }
                                        //};
                                        routeDefn.views = {};
                                        routeDefn.views[routeDyno] = {
                                            controller: routeDefn.controller,
                                            templateUrl: routeDefn.templateUrl
                                        };
                                        routeDefn.sticky = true;
                                        routeDefn.deepStateRedirect = true;

                                        delete routeDefn.controller;
                                        delete routeDefn.templateUrl;

                                        try {
                                            routeResolver.route.stateProviderRefrence.state(routeDyno, routeDefn);
                                        } catch (e) {
                                            //
                                        }


                                        //el.append($compile('<li  class="list-group-item"><a  ui-sref="home.tab.createEmployeeFile.employeeDynamicEnitity({currentForm: \'' + tab.LatinName + '\'})">' + tab[scope.data.model
                                        //    .name.toString()] + '</a></li>')(scope));
                                        newStates.push(routeDyno);
                                        el.append($compile('<li  class="list-group-item" ><a ng-click=\'tabClick($event, ' + '"' + routeDyno + '")\' ui-sref="' + routeDyno + '" >' + table[scope.data.model
                                            .name.toString()] + '</a></li>')(scope));
                                        uiViewContainer.append($compile('<div ui-view="' + routeDyno + '" ng-show="$state.current.name === \'' + routeDyno + '\'" ></div>')(scope));
                                    }
                                });

                            }
                        });
                    }

                }
            };
        }
    ]);
});