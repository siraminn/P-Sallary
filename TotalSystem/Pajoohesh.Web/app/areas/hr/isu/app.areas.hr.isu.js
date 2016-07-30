define(["areas/hr/isu/mapping"], function () {
    var rec = angular.module("app.areas.hr.isu", []);
    rec.config([
        "$stateProvider", "$translatePartialLoaderProvider", "routeResolverProvider", "$controllerProvider", "$provide",
        function ($stateProvider, $translatePartialLoaderProvider, routeResolverProvider, $controllerProvider, $provide) {

            $translatePartialLoaderProvider.addPart("app/areas/hr/isu");


            rec.register = {
                controller: $controllerProvider.register,
                factory: $provide.factory,
                service: $provide.service
            };
            
            var route = routeResolverProvider.route;


            isuMapping.forEach(function (row) {
                var routeDefn = route.resolve(row.url, row.access, row.subSystem, row.module, row.folder, row.controller, row.view, row.pageTitle);
                route.register(row.action, routeDefn);
            });
        }
    ]);
    return rec;
});