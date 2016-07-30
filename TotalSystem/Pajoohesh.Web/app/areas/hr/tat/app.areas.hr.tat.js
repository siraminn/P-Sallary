define(["areas/hr/tat/mapping"], function () {

    var tat = angular.module("app.areas.hr.tat", []);
    tat.config([
        "$stateProvider", "$translatePartialLoaderProvider", "routeResolverProvider", "$controllerProvider", "$provide",
        function ($stateProvider, $translatePartialLoaderProvider, routeResolverProvider, $controllerProvider, $provide) {

            $translatePartialLoaderProvider.addPart("app/areas/hr/tat");

            tat.register = {
                controller: $controllerProvider.register,
                factory: $provide.factory,
                service: $provide.service
            };
            
            var route = routeResolverProvider.route;
            mapping.forEach(function (row) {
                var routeDefn = route.resolve(row.url, row.access, row.subSystem, row.module, row.folder, row.controller, row.view, row.pageTitle, row.sticky, row.tabMenu, row.stickyGateway);
                route.register(row.action, routeDefn);
            });
        }
    ]);
    return tat;
});