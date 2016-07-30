define(["areas/hr/prs/mapping"], function () {
    var prs = angular.module("app.areas.hr.prs", []);
    prs.config([
        "$stateProvider", "$translatePartialLoaderProvider", "routeResolverProvider", "$controllerProvider", "$provide",
        function ($stateProvider, $translatePartialLoaderProvider, routeResolverProvider, $controllerProvider, $provide) {
            
            $translatePartialLoaderProvider.addPart("app/areas/hr/prs");

            prs.register = {
                controller: $controllerProvider.register,
                factory: $provide.factory,
                service: $provide.service
            };
            debugger;
            var route = routeResolverProvider.route;
            mappingPRS.forEach(function (row) {
            var routeDefn = route.resolve(row.url, row.access, row.subSystem, row.module, row.folder, row.controller, row.view, row.pageTitle, row.sticky, row.tabMenu, row.stickyGateway);
                route.register(row.action, routeDefn);
            });
        }
    ]);
    return prs;
});