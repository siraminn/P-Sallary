define(["areas/hr/rec/mapping"], function () {
    var rec = angular.module("app.areas.hr.rec", []);
    rec.config([
        "$stateProvider", "$translatePartialLoaderProvider", "routeResolverProvider", "$controllerProvider", "$provide",
        function ($stateProvider, $translatePartialLoaderProvider, routeResolverProvider, $controllerProvider, $provide) {

            $translatePartialLoaderProvider.addPart("app/areas/hr/rec");


            rec.register = {
                controller: $controllerProvider.register,
                factory: $provide.factory,
                service: $provide.service
            };
            
            var route = routeResolverProvider.route;


            recMapping.forEach(function (row) {
                var routeDefn = route.resolve(row.url, row.access, row.subSystem, row.module, row.folder, row.controller, row.view, row.pageTitle);
                route.register(row.action, routeDefn);
            });
        }
    ]);
    return rec;
});