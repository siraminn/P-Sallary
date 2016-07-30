define(["areas/finance/acc/mapping"], function () {
    var acc = angular.module("app.areas.finance.acc", []);
    acc.config([
        "$stateProvider", "$translatePartialLoaderProvider", "routeResolverProvider", "$controllerProvider", "$provide",
        function ($stateProvider, $translatePartialLoaderProvider, routeResolverProvider, $controllerProvider, $provide) {
            $translatePartialLoaderProvider.addPart("app/areas/finance/acc");
            acc.register = {
                controller: $controllerProvider.register,
                factory: $provide.factory,
                service: $provide.service
            };
            var route = routeResolverProvider.route;
            accMapping.forEach(function (row) {
                route.register(row.action, route.resolve(row.url, row.access, row.subSystem, row.module, row.folder, row.controller, row.view, row.pageTitle));
            });
        }
    ]);
    return acc;
});