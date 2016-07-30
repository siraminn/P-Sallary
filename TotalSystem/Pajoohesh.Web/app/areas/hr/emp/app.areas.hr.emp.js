define(["areas/hr/emp/mapping"], function () {

    var emp = angular.module("app.areas.hr.emp", []);
   
    emp.config([
        "$stateProvider", "$translatePartialLoaderProvider", "routeResolverProvider", "$controllerProvider", "$provide",
        function ($stateProvider, $translatePartialLoaderProvider, routeResolverProvider, $controllerProvider, $provide) {

            $translatePartialLoaderProvider.addPart("app/areas/hr/emp");

            emp.register = {
                controller: $controllerProvider.register,
                factory: $provide.factory,

                service: $provide.service
            };
            debugger;
            var route = routeResolverProvider.route;
            empMapping.forEach(function (row) {
                var routeDefn = route.resolve(row.url, row.access, row.subSystem, row.module, row.folder, row.controller, row.view, row.pageTitle, row.sticky, row.tabMenu, row.stickyGateway);
                route.register(row.action, routeDefn);
                //$stateProvider.state(row.action, route.resolve(row.url, row.access, row.subSystem, row.module, row.folder, row.controller, row.view, row.pageTitle));
            });
        }
    ]);
    return emp;
});