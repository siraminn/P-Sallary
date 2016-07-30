define(["areas/userManagement/mapping"], function () {
    var userManagement = angular.module("app.areas.userManagement",[]);
    userManagement.config([
        "$stateProvider", "$translatePartialLoaderProvider", "routeResolverProvider", "$controllerProvider", "$provide",
        function ($stateProvider, $translatePartialLoaderProvider, routeResolverProvider, $controllerProvider, $provide) {

            $translatePartialLoaderProvider.addPart("app/areas/userManagement");
            userManagement.register = {
                controller: $controllerProvider.register,
                factory: $provide.factory,
                service: $provide.service
            };
    
            var route = routeResolverProvider.route;
            userManagementMapping.forEach(function (row) {
                var routeDefn = route.resolve(row.url, row.access, row.subSystem, row.module, row.folder, row.controller, row.view, row.pageTitle, row.sticky, row.tabMenu);
                route.register(row.action, routeDefn);
            });
        }
    ]);
    return userManagement;
});