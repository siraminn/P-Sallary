define(["areas/inf/mapping"], function () {
    var inf = angular.module("app.areas.inf", []);
    inf.config([
        "$stateProvider", "$translatePartialLoaderProvider", "routeResolverProvider", "$controllerProvider", "$provide",
        function ($stateProvider, $translatePartialLoaderProvider, routeResolverProvider, $controllerProvider, $provide) {
            $translatePartialLoaderProvider.addPart("app/areas/inf");
            inf.register = {
                controller: $controllerProvider.register,
                factory: $provide.factory,
                service: $provide.service
            };
            var route = routeResolverProvider.route;
            infMapping.forEach(function (row) {
                route.register(row.action, route.resolve(row.url, row.access, row.subSystem, row.module, row.folder, row.controller, row.view, row.pageTitle));
            });
        }
    ]);
    return inf;
});