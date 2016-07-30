define([], function () {

    var services = angular.module("routeResolverServices", []);
    var history = [];
    var pagetitle = '';
    services.provider("routeResolver", function () {
        this.$get = function () {
            return this;
        };

        this.routeConfig = function () {

            var viewsDirectory = "app/areas/",
                controlleDirectory = "app/areas/",
                setBaseDirectories = function (viewDir, controllerDir) {
                    viewsDirectory = viewDir;
                    controlleDirectory = controllerDir;
                },
                getViewDirectory = function () {
                    return viewsDirectory;
                },
                getControllerDirectory = function () {
                    return controlleDirectory;
                };

            return {
                setBaseDirectories: setBaseDirectories,
                getViewDirectory: getViewDirectory,
                getControllerDirectory: getControllerDirectory
            };
        }();

        this.route = function (routeConfig) {
            var stateProviderRefrence = undefined;
            var routes = {};
            var register = function (action, routeDefn) {
                routes[action] = routeDefn;
            };
            

            var resolve = function (url, access, subSystemName, moduleName, baseName, controllerName, viewName, title, sticky, tabMenu, stickyGateway) {

                var routeDef = {};
                var subsystemDirectory = subSystemName;
                if (moduleName)
                    subsystemDirectory = subsystemDirectory + "/" + moduleName;

                routeDef.pagetitle = title;
                routeDef.sticky = sticky;
                routeDef.tabMenu = tabMenu;
                routeDef.stickyGateway = stickyGateway;
                routeDef.url = url;
                routeDef.templateUrl = routeConfig.getViewDirectory() + subsystemDirectory + "/views/" + baseName + "/" + (viewName == undefined ? baseName : viewName) + ".html?v=2.0";
                routeDef.controller = (controllerName == undefined ? baseName : controllerName) + "Controller";
                //routeDef.caseInsensitiveMatch = true;
                routeDef.resolve = {
                    load: ["$q", "$rootScope", "$location", "$window", function ($q, $rootScope, $location, $window) {
                        var dependency = [routeConfig.getControllerDirectory() + subsystemDirectory + "/controllers/" + baseName + "/" + (controllerName == undefined ? baseName : controllerName) + "Controller.js"];
                        pagetitle = title;

                        return resolveDependencies($q, $rootScope, $location, $window, dependency);
                    }]
                };

                return routeDef;
            };

            var resolveDependencies = function ($q, $rootScope, $location, $window, dependencies) {
                var defer = $q.defer();
                $window.document.title = pagetitle;
                //$rootScope.pageTitle = pagetitle;
                require(dependencies, function () {
                    defer.resolve();
                    $rootScope.$apply();
                });
                $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
                    $rootScope.pageTitle = pagetitle;
                    if (history.length > 1) {
                        if (history[history.length - 1] != $location.$$path)
                            history.push($location.$$path);
                    }
                    else
                        history.push($location.$$path);
                });
                $rootScope.$on('$locationChangeSuccess',
                        function (event, current, previous) {

                            $rootScope.$previouslocation = previous;
                        });
                $rootScope.back = function () {
                    var prevUrl = "#";
                    prevUrl += history.length > 1 ? history[history.length - 2] : "/";
                    $window.location.replace(prevUrl);
                };
                return defer.promise;
            };

            return {
                resolve: resolve,
                register: register,
                routes: routes
            };

        }(this.routeConfig);

    });

})