define(['app.areas.register', 'services/routeResolverService'], function () {
    var app = angular.module("app", [
        'ngSanitize',
        'ngAnimate',
        'cfp.hotkeys',
        'pascalprecht.translate',
        'LocalStorageModule',
        'routeResolverServices',
        'angularModalService',
        'ui.router',
        'ui-notification',
        'ui.bootstrap',
        'ui.bootstrap.persian.datepicker',
        'ui.bootstrap.datepicker',
        'pnControls',
        'app.areas.register',
        'ct.ui.router.extras',
        'blockUI'
    ]);
    app.config(function ($logProvider) {
        $logProvider.debugEnabled(false);
    });
    app.config([
        "$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
            $stateProvider.state("home", {
                url: "/home",
                controller:"homeController",
                templateUrl: "app/views/home/homeView.html",
                resolve: {
                    auth: function ($q, $state, $timeout, localStorageService, AuthToken) {
                        var deferred = $q.defer();
                        var key = localStorageService.get(AuthToken);
                        $timeout(function () {
                            if (!(key && key.length > 0)) {
                                $state.go('login');
                                deferred.reject();
                            } else {
                                // everything is fine, proceed
                                deferred.resolve();
                            }
                        });

                        return deferred.promise;
                    }
                }
            }).state("main", {
                url: "/",
                controller:"mainController",
                templateUrl: "app/views/main/mainView.html"
            })
            .state("login",{
                url: "/login",
                controller: "loginController",
                templateUrl: "app/views/login/loginView.html"
            }).state("logout", {
                url: "/logout",
                controller:"logoutController",
                template: ""
            }).state("404", {
                url: "/404",
                templateUrl: "app/views/errors/404.tmpl.html",
                controllerAs: "vm",
                controller: [
                    "$state", function (e) {
                        var t = this;
                        t.goHome = function () { e.go("home") }
                    }
                ]
            }).state("500", {
                url: "/500",
                templateUrl: "app/views/errors/500.tmpl.html",
                controllerAs: "vm",
                controller: [
                    "$state", function (e) {
                        var t = this;
                        t.goHome = function () { e.go("home") }
                    }
                ]
            })
            ,$urlRouterProvider.when("", "/home"), $urlRouterProvider.otherwise("/main");
        }
    ]);
    app.config(['pn.kendo.configProvider', function(kendoConfig) {
        kendoConfig.setTreelistConfig({
                dataSource: {
                    transport: {
                        type: "json",
                        read: {
                            dataType: "json"
                        }
                    },
                    schema: {
                        model: {
                            id: "id",
                            parentId: "parentId",
                            expanded: true,
                        }
                    }
                },
                resizable: true,
                height: 300
            });
     kendoConfig.setTreeViewConfig({
                dataSource: {
                    transport: {
                        type: "json",
                        read: {
                            dataType: "json"
                        }
                    },                    
                }
            });
    }]);


    


    app.constant("APP_LANGUAGES", [
            {
                name: "LANGUAGES.PERSIAN",
                key: "fa"
            }, {
                name: "LANGUAGES.ENGLISH",
                key: "en"
            }
    ])
        .constant("API_CONFIG", { url: "api/ts/" });

    app.provider("settings", function () {
        function e(e) { i.languages.push(e) }

        function t(e) { i.logo = e }

        function a(e) { i.name = e }

        function n(e) { i.copyright = e }

        function l(e) { i.version = e }

        var i = { languages: [], name: "", logo: "", copyright: "", version: "" };
        this.addLanguage = e, this.setLogo = t, this.setName = a, this.setCopyright = n, this.setVersion = l, this.$get = function () {
            return {
                languages: i.languages,
                name: i.name,
                copyright: i.copyright,
                logo: i.logo,
                version: i.version,
                defaultSkin: i.defaultSkin
            }
        }
    }
    );

    app.config([
        "settingsProvider", "APP_LANGUAGES", function (e, t) {
            var a = new Date;
            e.setName("  نام سیستم"), e.setCopyright("&copy;" + a.getFullYear() + " pajoohesh"), e.setLogo("assets/images/logo.png"), e.setVersion("1.0.0");
            for (var n = t.length - 1; n >= 0; n--)
                e.addLanguage({
                    name: t[n].name,
                    key: t[n].key
                });
        }
    ]);

    app.config([
        "$translateProvider", "$translatePartialLoaderProvider", "APP_LANGUAGES", function (e, t, a) {
            e.useLoader("$translatePartialLoader", {
                urlTemplate: "{part}/i18n/{lang}.js"
            }),
                t.addPart("app"), e.useSanitizeValueStrategy("sanitize"), e.useLoaderCache(!0);
            for (var n = [], l = a.length - 1; l >= 0; l--)
                n.push(a[l].key);
            e.registerAvailableLanguageKeys(n, {
                en_US: "fa_IR"
            }).use("fa");
        }
    ]);

    app.run([
       '$templateCache', '$rootScope', '$state', function ($templateCache, $rootScope, $state) {
           $templateCache.put('/dialogs/custom.html', '<div class="modal-header"><h4 class="modal-title"><span class="glyphicon glyphicon-star"></span> User\'s Name</h4></div><div class="modal-body"><ng-form name="nameDialog" novalidate role="form"><div class="form-group input-group-lg" ng-class="{true: \'has-error\'}[nameDialog.username.$dirty && nameDialog.username.$invalid]"><label class="control-label" for="course">Name:</label><input type="text" class="form-control" name="username" id="username" ng-model="user.name" ng-keyup="hitEnter($event)" required><span class="help-block">Enter your full name, first &amp; last.</span></div></ng-form></div><div class="modal-footer"><button type="button" class="btn btn-default" ng-click="cancel()">Cancel</button><button type="button" class="btn btn-primary" ng-click="save()" ng-disabled="(nameDialog.$dirty && nameDialog.$invalid) || nameDialog.$pristine">Save</button></div>');
           $templateCache.put('/dialogs/custom2.html', '<div class="modal-header"><h4 class="modal-title"><span class="glyphicon glyphicon-star"></span> Custom Dialog 2</h4></div><div class="modal-body"><label class="control-label" for="customValue">Custom Value:</label><input type="text" class="form-control" id="customValue" ng-model="data.val" ng-keyup="hitEnter($event)"><span class="help-block">Using "dialogsProvider.useCopy(false)" in your applications config function will allow data passed to a custom dialog to retain its two-way binding with the scope of the calling controller.</span></div><div class="modal-footer"><button type="button" class="btn btn-default" ng-click="done()">Done</button></div>')
            
           $rootScope.$on('pnTab:document:ready', function (event, data) {
             
               $state.go(data.$state.current.name + '_dummy');
               $state.go(data.$state.current.name);
           });
        }
    ]);
  
    app.config(['$stateProvider', 'routeResolverProvider', '$futureStateProvider', 
        function ($stateProvider, routeResolverProvider, $futureStateProvider) {
            routeResolverProvider.route.stateProviderRefrence = $stateProvider;

            $futureStateProvider.addResolve(function($q) {
                routeResolverProvider.route.futureState = $q.defer();
                return routeResolverProvider.route.futureState.promise;
            });
        }
    ]);



    app.constant('infWebAccess', 'http://localhost:145/');
    app.constant('baseWebAccess', 'http://localhost:145/');
    app.constant('empWebAccess', 'http://localhost:145/');
    app.constant('recWebAccess', 'http://localhost:145/');
    app.constant('userManagementWebAccess', 'http://localhost:145/');
    app.constant('payWebAccess', 'http://localhost:145/');
    app.constant('AuthToken', 'Auth-Token');

    return app;
});