define(["areas/pay/mapping"], function () {
    var pay = angular.module("app.areas.pay", []);
    pay.config([
        "$stateProvider", "$translatePartialLoaderProvider", "routeResolverProvider", "$controllerProvider", "$provide",
        function ($stateProvider, $translatePartialLoaderProvider, routeResolverProvider, $controllerProvider, $provide) {

            $translatePartialLoaderProvider.addPart("app/areas/pay");
            pay.register = {
                controller: $controllerProvider.register,
                factory: $provide.factory,
                service: $provide.service
            };
    
            var route = routeResolverProvider.route;
            payMapping.forEach(function (row) {
                var routeDefn = route.resolve(row.url, row.access, row.subSystem, row.module, row.folder, row.controller, row.view, row.pageTitle, row.sticky, row.tabMenu);
                route.register(row.action, routeDefn);
            });
        }
    ]);
    return pay;
});